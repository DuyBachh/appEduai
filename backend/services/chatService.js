const {
    ObjectId,
} = require("mongodb");

const {
    client,
} = require("../config/database");

const {
    createConversation,
} = require("../models/conversationModel");

const {
    createMessage,
} = require("../models/messageModel");

const {
    generateText,
} = require("./aiService");

const {
    getChatPrompt,
} = require("../prompts/chatPrompts");

// ========================================
// CONFIG
// ========================================

const MAX_HISTORY_MESSAGES =
    12;

const MAX_DOCUMENT_CONTEXT_CHARS =
    28000;

const DOCUMENT_CHUNK_SIZE =
    7000;

const MAX_RELEVANT_CHUNKS =
    4;

const CHAT_MAX_OUTPUT_TOKENS =
    700;

// ========================================
// ERROR
// ========================================

const createServiceError = (
    message,
    statusCode
) => {
    const error =
        new Error(
            message
        );

    error.statusCode =
        statusCode;

    return error;
};

// ========================================
// VALIDATE ID
// ========================================

const validateObjectId = (
    id,
    message =
        "ID không hợp lệ."
) => {
    if (
        !ObjectId.isValid(
            id
        )
    ) {
        throw createServiceError(
            message,
            400
        );
    }
};

// ========================================
// NORMALIZE TEXT
// ========================================

const normalizeText = (
    text = ""
) => {
    return String(
        text
    )
        .replace(
            /\r\n/g,
            "\n"
        )

        .replace(
            /\u0000/g,
            ""
        )

        .replace(
            /[ \t]+\n/g,
            "\n"
        )

        .replace(
            /\n{3,}/g,
            "\n\n"
        )

        .trim();
};

// ========================================
// SPLIT DOCUMENT
// ========================================

const splitTextIntoChunks = (
    text,
    maxChars =
        DOCUMENT_CHUNK_SIZE
) => {
    const normalized =
        normalizeText(
            text
        );

    if (!normalized) {
        return [];
    }

    if (
        normalized.length <=
        maxChars
    ) {
        return [
            normalized,
        ];
    }

    const paragraphs =
        normalized.split(
            /\n{2,}/
        );

    const chunks = [];

    let current =
        "";

    const flush = () => {
        const value =
            current.trim();

        if (value) {
            chunks.push(
                value
            );
        }

        current = "";
    };

    for (
        const paragraph of
        paragraphs
    ) {
        const value =
            paragraph.trim();

        if (!value) {
            continue;
        }

        if (
            value.length >
            maxChars
        ) {
            flush();

            for (
                let index = 0;
                index <
                value.length;
                index +=
                    maxChars
            ) {
                const part =
                    value
                        .slice(
                            index,
                            index +
                                maxChars
                        )
                        .trim();

                if (part) {
                    chunks.push(
                        part
                    );
                }
            }

            continue;
        }

        const candidate =
            current
                ? `${current}\n\n${value}`
                : value;

        if (
            candidate.length >
            maxChars
        ) {
            flush();

            current =
                value;
        } else {
            current =
                candidate;
        }
    }

    flush();

    return chunks;
};

// ========================================
// KEYWORDS
// ========================================

const getKeywords = (
    text
) => {
    const stopWords =
        new Set([
            "của",
            "cho",
            "với",
            "trong",
            "những",
            "các",
            "này",
            "đó",
            "được",
            "là",
            "và",
            "hay",
            "một",
            "về",
            "theo",
            "như",
            "tôi",
            "bạn",
            "thì",
            "nào",
            "gì",
            "sao",
            "hãy",
            "giải",
            "thích",
        ]);

    const words =
        String(
            text || ""
        )
            .toLowerCase()
            .match(
                /[\p{L}\p{N}]+/gu
            ) || [];

    return [
        ...new Set(
            words.filter(
                (
                    word
                ) =>
                    word.length >=
                        3 &&
                    !stopWords.has(
                        word
                    )
            )
        ),
    ].slice(
        0,
        30
    );
};

// ========================================
// SELECT DOCUMENT CONTEXT
// ========================================

const selectDocumentContext = ({
    documentText,
    question,
    history = [],
}) => {
    const normalized =
        normalizeText(
            documentText
        );

    if (
        normalized.length <=
        MAX_DOCUMENT_CONTEXT_CHARS
    ) {
        return normalized;
    }

    const chunks =
        splitTextIntoChunks(
            normalized
        );

    const recentUserHistory =
        history
            .filter(
                (
                    item
                ) =>
                    item.role ===
                    "user"
            )
            .slice(-3)
            .map(
                (
                    item
                ) =>
                    item.content
            )
            .join(
                " "
            );

    const queryText =
        `${recentUserHistory} ${question}`;

    const keywords =
        getKeywords(
            queryText
        );

    const scoredChunks =
        chunks.map(
            (
                chunk,
                index
            ) => {
                const lowerChunk =
                    chunk.toLowerCase();

                let score =
                    0;

                for (
                    const keyword of
                    keywords
                ) {
                    if (
                        lowerChunk.includes(
                            keyword
                        )
                    ) {
                        score +=
                            1;
                    }
                }

                return {
                    index,
                    chunk,
                    score,
                };
            }
        );

    let selected =
        scoredChunks
            .sort(
                (
                    a,
                    b
                ) =>
                    b.score -
                    a.score
            )
            .slice(
                0,
                MAX_RELEVANT_CHUNKS
            );

    // Nếu không tìm được keyword phù hợp,
    // lấy các phần đầu tài liệu.
    if (
        selected.every(
            (
                item
            ) =>
                item.score ===
                0
        )
    ) {
        selected =
            scoredChunks
                .sort(
                    (
                        a,
                        b
                    ) =>
                        a.index -
                        b.index
                )
                .slice(
                    0,
                    MAX_RELEVANT_CHUNKS
                );
    }

    // Đưa về đúng thứ tự xuất hiện
    selected.sort(
        (
            a,
            b
        ) =>
            a.index -
            b.index
    );

    return selected
        .map(
            (
                item,
                index
            ) =>
                `Phần tài liệu ${index + 1}:\n${item.chunk}`
        )
        .join(
            "\n\n"
        )
        .slice(
            0,
            MAX_DOCUMENT_CONTEXT_CHARS
        );
};

// ========================================
// CHAT WITH DOCUMENT
// ========================================

const chatWithDocument =
    async ({
        userId,
        documentId,
        conversationId =
            null,
        question,
    }) => {
        validateObjectId(
            userId,
            "User ID không hợp lệ."
        );

        validateObjectId(
            documentId,
            "Document ID không hợp lệ."
        );

        const normalizedQuestion =
            String(
                question || ""
            ).trim();

        if (
            !normalizedQuestion
        ) {
            throw createServiceError(
                "Câu hỏi không được để trống.",
                400
            );
        }

        if (
            normalizedQuestion.length >
            3000
        ) {
            throw createServiceError(
                "Câu hỏi quá dài.",
                400
            );
        }

        const db =
            client.db(
                "appEduai"
            );

        const documentsCollection =
            db.collection(
                "documents"
            );

        const conversationsCollection =
            db.collection(
                "conversations"
            );

        const messagesCollection =
            db.collection(
                "messages"
            );

        const userObjectId =
            new ObjectId(
                userId
            );

        const documentObjectId =
            new ObjectId(
                documentId
            );

        // ========================================
        // DOCUMENT
        // ========================================

        const document =
            await documentsCollection.findOne(
                {
                    _id:
                        documentObjectId,

                    userId:
                        userObjectId,
                }
            );

        if (!document) {
            throw createServiceError(
                "Không tìm thấy tài liệu hoặc bạn không có quyền truy cập.",
                404
            );
        }

        const documentText =
            normalizeText(
                document.extractedText
            );

        if (
            !documentText
        ) {
            throw createServiceError(
                "Tài liệu chưa có nội dung để chat.",
                400
            );
        }

        // ========================================
        // CONVERSATION
        // ========================================

        let conversation;

        let isNewConversation =
            false;

        if (
            conversationId
        ) {
            validateObjectId(
                conversationId,
                "Conversation ID không hợp lệ."
            );

            conversation =
                await conversationsCollection.findOne(
                    {
                        _id:
                            new ObjectId(
                                conversationId
                            ),

                        userId:
                            userObjectId,
                    }
                );

            if (
                !conversation
            ) {
                throw createServiceError(
                    "Không tìm thấy cuộc trò chuyện.",
                    404
                );
            }

            if (
                !conversation.documentId ||
                conversation.documentId.toString() !==
                    documentObjectId.toString()
            ) {
                throw createServiceError(
                    "Cuộc trò chuyện không thuộc tài liệu này.",
                    400
                );
            }
        } else {
            conversation =
                createConversation(
                    {
                        userId,

                        documentId,

                        title:
                            normalizedQuestion.slice(
                                0,
                                60
                            ),
                    }
                );

            isNewConversation =
                true;
        }

        // ========================================
        // HISTORY
        // ========================================

        let history =
            [];

        if (
            !isNewConversation
        ) {
            history =
                await messagesCollection
                    .find({
                        conversationId:
                            conversation._id,

                        userId:
                            userObjectId,
                    })
                    .sort({
                        createdAt:
                            -1,
                    })
                    .limit(
                        MAX_HISTORY_MESSAGES
                    )
                    .toArray();

            history.reverse();
        }

        console.log(
            `CHAT HISTORY: ${history.length} message(s)`
        );

        // ========================================
        // DOCUMENT CONTEXT
        // ========================================

        const documentContext =
            selectDocumentContext(
                {
                    documentText,

                    question:
                        normalizedQuestion,

                    history,
                }
            );

        console.log(
            `CHAT DOCUMENT SOURCE: ${documentText.length} chars`
        );

        console.log(
            `CHAT DOCUMENT CONTEXT: ${documentContext.length} chars`
        );

        // ========================================
        // PROMPT
        // ========================================

        const prompt =
            getChatPrompt({
                documentText:
                    documentContext,

                history,

                question:
                    normalizedQuestion,
            });

        // ========================================
        // AI
        // ========================================

        const startedAt =
            Date.now();

        const answer =
            await generateText({
                instructions:
                    [
                        "Bạn là trợ lý học tập của appEduai.",

                        "Chỉ trả lời dựa trên tài liệu được cung cấp.",

                        "Lịch sử hội thoại chỉ dùng để hiểu ngữ cảnh.",

                        "Không tự bổ sung kiến thức ngoài tài liệu.",

                        "Viết tiếng Việt có dấu.",

                        "Trả lời trực tiếp và dễ hiểu.",
                    ].join(
                        " "
                    ),

                prompt,

                maxOutputTokens:
                    CHAT_MAX_OUTPUT_TOKENS,
            });

        console.log(
            "GEMINI CHAT TIME:",
            `${(
                (Date.now() -
                    startedAt) /
                1000
            ).toFixed(
                2
            )} giây`
        );

        const normalizedAnswer =
            normalizeText(
                answer
            );

        if (
            !normalizedAnswer
        ) {
            throw createServiceError(
                "AI không trả về câu trả lời hợp lệ.",
                502
            );
        }

        // ========================================
        // SAVE NEW CONVERSATION
        // ========================================

        if (
            isNewConversation
        ) {
            await conversationsCollection.insertOne(
                conversation
            );

            console.log(
                "CHAT CONVERSATION CREATED:",
                conversation._id.toString()
            );
        }

        // ========================================
        // SAVE MESSAGES
        // ========================================

        const userMessage =
            createMessage({
                conversationId:
                    conversation._id,

                userId,

                role:
                    "user",

                content:
                    normalizedQuestion,
            });

        const assistantMessage =
            createMessage({
                conversationId:
                    conversation._id,

                userId,

                role:
                    "assistant",

                content:
                    normalizedAnswer,
            });

        await messagesCollection.insertMany(
            [
                userMessage,
                assistantMessage,
            ]
        );

        // ========================================
        // UPDATE CONVERSATION
        // ========================================

        const updatedAt =
            new Date();

        await conversationsCollection.updateOne(
            {
                _id:
                    conversation._id,

                userId:
                    userObjectId,
            },
            {
                $set: {
                    updatedAt,
                },
            }
        );

        console.log(
            "CHAT SAVED:",
            conversation._id.toString()
        );

        return {
            conversationId:
                conversation._id,

            isNewConversation,

            userMessage,

            assistantMessage,
        };
    };

// ========================================
// CHAT HISTORY
// ========================================

const getConversations =
    async ({
        userId,
        documentId =
            null,
    }) => {
        validateObjectId(
            userId,
            "User ID không hợp lệ."
        );

        if (
            documentId
        ) {
            validateObjectId(
                documentId,
                "Document ID không hợp lệ."
            );
        }

        const db =
            client.db(
                "appEduai"
            );

        const conversationsCollection =
            db.collection(
                "conversations"
            );

        const messagesCollection =
            db.collection(
                "messages"
            );

        const userObjectId =
            new ObjectId(
                userId
            );

        const filter = {
            userId:
                userObjectId,
        };

        if (
            documentId
        ) {
            filter.documentId =
                new ObjectId(
                    documentId
                );
        }

        const conversations =
            await conversationsCollection
                .find(
                    filter
                )
                .sort({
                    updatedAt:
                        -1,
                })
                .toArray();

        if (
            conversations.length ===
            0
        ) {
            return [];
        }

        const conversationIds =
            conversations.map(
                (
                    item
                ) =>
                    item._id
            );

        const counts =
            await messagesCollection
                .aggregate([
                    {
                        $match: {
                            userId:
                                userObjectId,

                            conversationId:
                                {
                                    $in:
                                        conversationIds,
                                },
                        },
                    },

                    {
                        $group: {
                            _id:
                                "$conversationId",

                            messageCount:
                                {
                                    $sum:
                                        1,
                                },
                        },
                    },
                ])
                .toArray();

        const countMap =
            new Map(
                counts.map(
                    (
                        item
                    ) => [
                        item._id.toString(),

                        item.messageCount,
                    ]
                )
            );

        return conversations.map(
            (
                conversation
            ) => ({
                ...conversation,

                messageCount:
                    countMap.get(
                        conversation._id.toString()
                    ) || 0,
            })
        );
    };

// ========================================
// GET MESSAGES
// ========================================

const getConversationMessages =
    async ({
        userId,
        conversationId,
    }) => {
        validateObjectId(
            userId,
            "User ID không hợp lệ."
        );

        validateObjectId(
            conversationId,
            "Conversation ID không hợp lệ."
        );

        const db =
            client.db(
                "appEduai"
            );

        const conversationsCollection =
            db.collection(
                "conversations"
            );

        const messagesCollection =
            db.collection(
                "messages"
            );

        const userObjectId =
            new ObjectId(
                userId
            );

        const conversationObjectId =
            new ObjectId(
                conversationId
            );

        const conversation =
            await conversationsCollection.findOne(
                {
                    _id:
                        conversationObjectId,

                    userId:
                        userObjectId,
                }
            );

        if (
            !conversation
        ) {
            throw createServiceError(
                "Không tìm thấy cuộc trò chuyện.",
                404
            );
        }

        const messages =
            await messagesCollection
                .find({
                    conversationId:
                        conversationObjectId,

                    userId:
                        userObjectId,
                })
                .sort({
                    createdAt:
                        1,
                })
                .toArray();

        return {
            conversation,

            messages,
        };
    };

// ========================================
// DELETE CONVERSATION
// ========================================

const deleteConversation =
    async ({
        userId,
        conversationId,
    }) => {
        validateObjectId(
            userId,
            "User ID không hợp lệ."
        );

        validateObjectId(
            conversationId,
            "Conversation ID không hợp lệ."
        );

        const db =
            client.db(
                "appEduai"
            );

        const conversationsCollection =
            db.collection(
                "conversations"
            );

        const messagesCollection =
            db.collection(
                "messages"
            );

        const userObjectId =
            new ObjectId(
                userId
            );

        const conversationObjectId =
            new ObjectId(
                conversationId
            );

        const conversation =
            await conversationsCollection.findOne(
                {
                    _id:
                        conversationObjectId,

                    userId:
                        userObjectId,
                }
            );

        if (
            !conversation
        ) {
            throw createServiceError(
                "Không tìm thấy cuộc trò chuyện hoặc bạn không có quyền xóa.",
                404
            );
        }

        const messageResult =
            await messagesCollection.deleteMany(
                {
                    conversationId:
                        conversationObjectId,

                    userId:
                        userObjectId,
                }
            );

        await conversationsCollection.deleteOne(
            {
                _id:
                    conversationObjectId,

                userId:
                    userObjectId,
            }
        );

        return {
            conversationId,

            deletedMessages:
                messageResult.deletedCount,
        };
    };

// ========================================
// EXPORT
// ========================================

module.exports = {
    chatWithDocument,
    getConversations,
    getConversationMessages,
    deleteConversation,
};
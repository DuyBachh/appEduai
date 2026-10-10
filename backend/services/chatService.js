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

const { normalizeText, selectDocumentContext } = require("../utils/chatContext");
const { validateObjectId } = require("../utils/chatValidation");
const { createServiceError } = require("../utils/serviceError");
const { getConversations, getConversationMessages, deleteConversation } = require("./chatHistoryService");

const MAX_HISTORY_MESSAGES =
    12;

const CHAT_MAX_OUTPUT_TOKENS =
    700;

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
// EXPORT
// ========================================

module.exports = {
    chatWithDocument,
    getConversations,
    getConversationMessages,
    deleteConversation,
};
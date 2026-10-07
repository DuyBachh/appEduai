const {
    ObjectId,
} = require("mongodb");

const {
    client,
} = require("../config/database");

const {
    createSummary,
} = require("../models/summaryModel");

const {
    generateText,
} = require("./aiService");

const {
    getSummaryPrompt,
    getChunkSummaryPrompt,
} = require("../prompts/summaryPrompts");

// ========================================
// CONFIG
// ========================================

const ALLOWED_TYPES =
    new Set([
        "short",
        "medium",
        "detailed",
    ]);

const TOKEN_LIMITS = {
    short: 220,
    medium: 420,
    detailed: 800,
};

// Nếu tài liệu nhỏ hơn mức này
// gửi trực tiếp cho AI.
const DIRECT_SUMMARY_MAX_CHARS =
    28000;

// Nếu tài liệu quá dài,
// chia thành từng phần.
const CHUNK_MAX_CHARS =
    16000;

const CHUNK_OUTPUT_TOKENS =
    260;

const CHUNK_DELAY_MS =
    500;

const MAX_REDUCTION_LEVELS =
    6;

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
// WAIT
// ========================================

const wait = (
    milliseconds
) => {
    return new Promise(
        (resolve) => {
            setTimeout(
                resolve,
                milliseconds
            );
        }
    );
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
// CLEAN SUMMARY
// ========================================

const cleanSummaryText = (
    text = ""
) => {
    let cleaned =
        normalizeText(
            text
        );

    cleaned =
        cleaned

            // Chào hỏi
            .replace(
                /^\s*(?:Chào bạn|Xin chào)[^\n]*\n*/i,
                ""
            )

            // Giới thiệu trợ lý
            .replace(
                /^\s*(?:Tôi là|Mình là) trợ lý[^\n]*\n*/i,
                ""
            )

            // "Dưới đây..."
            .replace(
                /^\s*Dưới đây[^\n]*\n*/i,
                ""
            )

            // Markdown heading
            .replace(
                /^#{1,6}\s*/gm,
                ""
            )

            // **bold**
            .replace(
                /\*\*(.*?)\*\*/g,
                "$1"
            )

            // __bold__
            .replace(
                /__(.*?)__/g,
                "$1"
            )

            // *italic*
            .replace(
                /\*([^*\n]+)\*/g,
                "$1"
            )

            // _italic_
            .replace(
                /_([^_\n]+)_/g,
                "$1"
            )

            // Bullet Markdown
            .replace(
                /^\s*[-*]\s+/gm,
                "• "
            )

            // ```
            .replace(
                /```(?:\w+)?\n?/g,
                ""
            )

            // `code`
            .replace(
                /`([^`]+)`/g,
                "$1"
            )

            // ---
            .replace(
                /^[-_=]{3,}\s*$/gm,
                ""
            )

            // Space cuối dòng
            .replace(
                /[ \t]+$/gm,
                ""
            )

            // Dòng trống thừa
            .replace(
                /\n{3,}/g,
                "\n\n"
            )

            .trim();

    return cleaned;
};

// ========================================
// VALIDATE OBJECT ID
// ========================================

const validateObjectId = (
    value,
    fieldName
) => {
    if (
        !ObjectId.isValid(
            value
        )
    ) {
        throw createServiceError(
            `${fieldName} không hợp lệ.`,
            400
        );
    }
};

// ========================================
// SPLIT DOCUMENT
// ========================================

const splitTextIntoChunks = (
    text,
    maxChars =
        CHUNK_MAX_CHARS
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

    const flushCurrent =
        () => {
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

        // Một paragraph quá dài
        if (
            value.length >
            maxChars
        ) {
            flushCurrent();

            for (
                let start = 0;
                start <
                value.length;
                start +=
                    maxChars
            ) {
                const part =
                    value
                        .slice(
                            start,
                            start +
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
            flushCurrent();

            current =
                value;
        } else {
            current =
                candidate;
        }
    }

    flushCurrent();

    return chunks;
};

// ========================================
// LONG DOCUMENT REDUCTION
// ========================================

const summarizeLongSource =
    async (
        sourceText
    ) => {
        let currentText =
            normalizeText(
                sourceText
            );

        let level =
            1;

        while (
            currentText.length >
                DIRECT_SUMMARY_MAX_CHARS &&
            level <=
                MAX_REDUCTION_LEVELS
        ) {
            const chunks =
                splitTextIntoChunks(
                    currentText,
                    CHUNK_MAX_CHARS
                );

            console.log(
                `SUMMARY REDUCTION LEVEL ${level}: ${chunks.length} chunk(s)`
            );

            const partialSummaries =
                [];

            for (
                let index = 0;
                index <
                chunks.length;
                index += 1
            ) {
                console.log(
                    `SUMMARY CHUNK ${index + 1}/${chunks.length} - LEVEL ${level}`
                );

                const chunkResult =
                    await generateText(
                        {
                            instructions:
                                [
                                    "Bạn đang rút gọn một phần của tài liệu để phục vụ bước tóm tắt cuối.",

                                    "Chỉ dùng dữ liệu trong phần được cung cấp.",

                                    "Viết tiếng Việt có dấu.",

                                    "Không dùng Markdown.",

                                    "Không chào hỏi.",
                                ].join(
                                    " "
                                ),

                            prompt:
                                getChunkSummaryPrompt(
                                    {
                                        text:
                                            chunks[
                                                index
                                            ],

                                        index:
                                            index +
                                            1,

                                        total:
                                            chunks.length,
                                    }
                                ),

                            maxOutputTokens:
                                CHUNK_OUTPUT_TOKENS,
                        }
                    );

                const cleaned =
                    cleanSummaryText(
                        chunkResult
                    );

                if (
                    !cleaned
                ) {
                    throw createServiceError(
                        `AI không thể rút gọn phần ${index + 1}/${chunks.length}.`,
                        502
                    );
                }

                partialSummaries.push(
                    `Phần ${index + 1}:\n${cleaned}`
                );

                // Không spam Gemini
                if (
                    index <
                    chunks.length -
                        1
                ) {
                    await wait(
                        CHUNK_DELAY_MS
                    );
                }
            }

            const nextText =
                partialSummaries
                    .join(
                        "\n\n"
                    )
                    .trim();

            if (!nextText) {
                throw createServiceError(
                    "Không thể chuẩn bị nội dung cho bước tóm tắt cuối.",
                    502
                );
            }

            currentText =
                nextText;

            level += 1;
        }

        return currentText;
    };

// ========================================
// CLEAN OLD CACHE
// ========================================

const cleanStoredSummary =
    async (
        summariesCollection,
        summary
    ) => {
        if (!summary) {
            return summary;
        }

        const cleanedContent =
            cleanSummaryText(
                summary.content
            );

        if (
            !cleanedContent ||
            cleanedContent ===
                summary.content
        ) {
            return summary;
        }

        const updatedAt =
            new Date();

        await summariesCollection.updateOne(
            {
                _id:
                    summary._id,
            },
            {
                $set: {
                    content:
                        cleanedContent,

                    updatedAt,
                },
            }
        );

        return {
            ...summary,

            content:
                cleanedContent,

            updatedAt,
        };
    };

// ========================================
// CREATE SUMMARY
// ========================================

const summarizeDocument =
    async ({
        userId,
        documentId,
        type = "medium",
    }) => {
        // ========================================
        // VALIDATE
        // ========================================

        validateObjectId(
            userId,
            "User ID"
        );

        validateObjectId(
            documentId,
            "Document ID"
        );

        if (
            !ALLOWED_TYPES.has(
                type
            )
        ) {
            throw createServiceError(
                "Loại tóm tắt không hợp lệ.",
                400
            );
        }

        // ========================================
        // DATABASE
        // ========================================

        const db =
            client.db(
                "appEduai"
            );

        const documentsCollection =
            db.collection(
                "documents"
            );

        const summariesCollection =
            db.collection(
                "summaries"
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

        const extractedText =
            normalizeText(
                document.extractedText
            );

        if (
            !extractedText
        ) {
            throw createServiceError(
                "Tài liệu chưa có nội dung để tóm tắt.",
                400
            );
        }

        // ========================================
        // CACHE
        // ========================================

        const cachedSummary =
            await summariesCollection.findOne(
                {
                    userId:
                        userObjectId,

                    documentId:
                        documentObjectId,

                    type,
                },
                {
                    sort: {
                        createdAt:
                            -1,
                    },
                }
            );

        if (
            cachedSummary
        ) {
            console.log(
                `SUMMARY CACHE HIT: ${type}`
            );

            return cleanStoredSummary(
                summariesCollection,
                cachedSummary
            );
        }

        console.log(
            `SUMMARY CACHE MISS: ${type}`
        );

        console.log(
            `SUMMARY SOURCE LENGTH: ${extractedText.length} chars`
        );

        // ========================================
        // PREPARE LONG DOCUMENT
        // ========================================

        const preparedSource =
            await summarizeLongSource(
                extractedText
            );

        console.log(
            `SUMMARY FINAL SOURCE: ${preparedSource.length} chars`
        );

        // ========================================
        // FINAL AI SUMMARY
        // ========================================

        const aiStartedAt =
            Date.now();

        const rawContent =
            await generateText({
                instructions:
                    [
                        "Bạn là trợ lý học tập chuyên tóm tắt tài liệu.",

                        "Chỉ sử dụng thông tin có trong nội dung nguồn.",

                        "Bắt buộc viết bằng tiếng Việt có dấu đầy đủ.",

                        "Không chào hỏi.",

                        "Không giới thiệu bản thân.",

                        "Không dùng Markdown.",

                        "Không dùng ký tự #, **, ``` hoặc đường phân cách ---.",

                        "Có thể dùng ký tự • để liệt kê.",

                        "Ưu tiên rõ ràng, chính xác, dễ học.",
                    ].join(
                        " "
                    ),

                prompt:
                    getSummaryPrompt(
                        {
                            text:
                                preparedSource,

                            type,
                        }
                    ),

                maxOutputTokens:
                    TOKEN_LIMITS[
                        type
                    ],
            });

        console.log(
            "GEMINI SUMMARY TIME:",
            `${(
                (Date.now() -
                    aiStartedAt) /
                1000
            ).toFixed(
                2
            )} giây`
        );

        // ========================================
        // CLEAN RESULT
        // ========================================

        const content =
            cleanSummaryText(
                rawContent
            );

        if (!content) {
            throw createServiceError(
                "AI không trả về nội dung tóm tắt hợp lệ.",
                502
            );
        }

        // ========================================
        // CREATE MODEL
        // ========================================

        const documentName =
            document.name ||
            document.originalName ||
            document.fileName ||
            "Tài liệu";

        const summary =
            createSummary({
                userId,

                documentId,

                title:
                    `Tóm tắt - ${documentName}`,

                type,

                content,
            });

        // ========================================
        // SAVE
        // ========================================

        await summariesCollection.insertOne(
            summary
        );

        console.log(
            `SUMMARY SAVED: ${type}`
        );

        return summary;
    };

// ========================================
// HISTORY
// ========================================

const getDocumentSummaries =
    async ({
        userId,
        documentId,
    }) => {
        validateObjectId(
            userId,
            "User ID"
        );

        validateObjectId(
            documentId,
            "Document ID"
        );

        const db =
            client.db(
                "appEduai"
            );

        const documentsCollection =
            db.collection(
                "documents"
            );

        const summariesCollection =
            db.collection(
                "summaries"
            );

        const userObjectId =
            new ObjectId(
                userId
            );

        const documentObjectId =
            new ObjectId(
                documentId
            );

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

        const summaries =
            await summariesCollection
                .find({
                    userId:
                        userObjectId,

                    documentId:
                        documentObjectId,
                })
                .sort({
                    createdAt:
                        -1,
                })
                .toArray();

        return Promise.all(
            summaries.map(
                (
                    summary
                ) =>
                    cleanStoredSummary(
                        summariesCollection,
                        summary
                    )
            )
        );
    };

// ========================================
// DETAIL
// ========================================

const getSummaryById =
    async ({
        userId,
        summaryId,
    }) => {
        validateObjectId(
            userId,
            "User ID"
        );

        validateObjectId(
            summaryId,
            "Summary ID"
        );

        const db =
            client.db(
                "appEduai"
            );

        const summariesCollection =
            db.collection(
                "summaries"
            );

        const summary =
            await summariesCollection.findOne(
                {
                    _id:
                        new ObjectId(
                            summaryId
                        ),

                    userId:
                        new ObjectId(
                            userId
                        ),
                }
            );

        if (!summary) {
            throw createServiceError(
                "Không tìm thấy bản tóm tắt.",
                404
            );
        }

        return cleanStoredSummary(
            summariesCollection,
            summary
        );
    };

// ========================================
// DELETE
// ========================================

const deleteSummaryById =
    async ({
        userId,
        summaryId,
    }) => {
        validateObjectId(
            userId,
            "User ID"
        );

        validateObjectId(
            summaryId,
            "Summary ID"
        );

        const db =
            client.db(
                "appEduai"
            );

        const summariesCollection =
            db.collection(
                "summaries"
            );

        const result =
            await summariesCollection.deleteOne(
                {
                    _id:
                        new ObjectId(
                            summaryId
                        ),

                    userId:
                        new ObjectId(
                            userId
                        ),
                }
            );

        if (
            result.deletedCount ===
            0
        ) {
            throw createServiceError(
                "Không tìm thấy bản tóm tắt.",
                404
            );
        }

        return {
            deleted: true,
            summaryId,
        };
    };

// ========================================
// EXPORT
// ========================================

module.exports = {
    summarizeDocument,
    getDocumentSummaries,
    getSummaryById,
    deleteSummaryById,
};
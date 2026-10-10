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
} = require("../prompts/summaryPrompts");

const { normalizeText, cleanSummaryText } = require("../utils/summaryText");
const { summarizeLongSource } = require("./summaryReduction");
const { createServiceError } = require("../utils/serviceError");

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
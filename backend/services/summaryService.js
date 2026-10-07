const { ObjectId } = require("mongodb");

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

// ========================================
// CLEAN SUMMARY TEXT
// ========================================

const cleanSummaryText = (text = "") => {
    let cleaned = String(text);

    cleaned = cleaned.replace(
        /^Chào bạn[^\n]*\n*/i,
        ""
    );

    cleaned = cleaned.replace(
        /^Tôi là trợ lý[^\n]*\n*/i,
        ""
    );

    cleaned = cleaned.replace(
        /^Dưới đây[^\n]*\n*/i,
        ""
    );

    cleaned = cleaned.replace(
        /^#{1,6}\s*/gm,
        ""
    );

    cleaned = cleaned.replace(
        /\*\*(.*?)\*\*/g,
        "$1"
    );

    cleaned = cleaned.replace(
        /__(.*?)__/g,
        "$1"
    );

    cleaned = cleaned.replace(
        /\*([^*\n]+)\*/g,
        "$1"
    );

    cleaned = cleaned.replace(
        /_([^_\n]+)_/g,
        "$1"
    );

    cleaned = cleaned.replace(
        /^\s*\*\s+/gm,
        "• "
    );

    cleaned = cleaned.replace(
        /^\s*-\s+/gm,
        "• "
    );

    cleaned = cleaned.replace(
        /```/g,
        ""
    );

    cleaned = cleaned.replace(
        /`/g,
        ""
    );

    cleaned = cleaned.replace(
        /^-{3,}\s*$/gm,
        ""
    );

    cleaned = cleaned.replace(
        /[ \t]+$/gm,
        ""
    );

    cleaned = cleaned.replace(
        /\n{3,}/g,
        "\n\n"
    );

    return cleaned.trim();
};

// ========================================
// SUMMARIZE DOCUMENT
// ========================================

const summarizeDocument = async ({
    userId,
    documentId,
    type = "medium",
}) => {
    if (!ObjectId.isValid(userId)) {
        const error = new Error(
            "User ID không hợp lệ."
        );

        error.statusCode = 400;
        throw error;
    }

    if (!ObjectId.isValid(documentId)) {
        const error = new Error(
            "Document ID không hợp lệ."
        );

        error.statusCode = 400;
        throw error;
    }

    const allowedTypes = [
        "short",
        "medium",
        "detailed",
    ];

    if (!allowedTypes.includes(type)) {
        const error = new Error(
            "Loại tóm tắt không hợp lệ."
        );

        error.statusCode = 400;
        throw error;
    }

    const db =
        client.db("appEduai");

    const documentsCollection =
        db.collection("documents");

    const summariesCollection =
        db.collection("summaries");

    const userObjectId =
        new ObjectId(userId);

    const documentObjectId =
        new ObjectId(documentId);

    const document =
        await documentsCollection.findOne({
            _id: documentObjectId,
            userId: userObjectId,
        });

    if (!document) {
        const error = new Error(
            "Không tìm thấy tài liệu hoặc bạn không có quyền truy cập."
        );

        error.statusCode = 404;
        throw error;
    }

    if (
        !document.extractedText ||
        !document.extractedText.trim()
    ) {
        const error = new Error(
            "Tài liệu chưa có nội dung để tóm tắt."
        );

        error.statusCode = 400;
        throw error;
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
                    createdAt: -1,
                },
            }
        );

    if (cachedSummary) {
        console.log(
            `SUMMARY CACHE HIT: ${type}`
        );

        const cleanedContent =
            cleanSummaryText(
                cachedSummary.content
            );

        if (
            cleanedContent !==
            cachedSummary.content
        ) {
            const updatedAt =
                new Date();

            await summariesCollection.updateOne(
                {
                    _id:
                        cachedSummary._id,
                },
                {
                    $set: {
                        content:
                            cleanedContent,

                        updatedAt,
                    },
                }
            );

            cachedSummary.content =
                cleanedContent;

            cachedSummary.updatedAt =
                updatedAt;
        }

        return cachedSummary;
    }

    console.log(
        `SUMMARY CACHE MISS: ${type}`
    );

    const prompt =
        getSummaryPrompt({
            text:
                document.extractedText,

            type,
        });

    const tokenLimits = {
        short: 350,
        medium: 700,
        detailed: 1200,
    };

    const maxOutputTokens =
        tokenLimits[type];

    const aiStartTime =
        Date.now();

    const rawContent =
        await generateText({
            instructions: [
    "Bạn là trợ lý học tập.",
    "Tóm tắt trực tiếp nội dung tài liệu.",

    "BẮT BUỘC viết bằng tiếng Việt có dấu đầy đủ.",
    "Không được viết tiếng Việt không dấu.",
    "Giữ đúng chính tả tiếng Việt.",
    "Không viết toàn bộ nội dung bằng chữ IN HOA.",

    "Không chào hỏi.",
    "Không giới thiệu bản thân.",
    "Không thêm thông tin ngoài tài liệu.",

    "Chỉ trả về văn bản thuần túy.",
    "Không sử dụng Markdown.",
    "Không sử dụng ký tự #.",
    "Không sử dụng dấu **.",
    "Không sử dụng dấu * để định dạng.",
    "Không sử dụng dấu ```.",
    "Không sử dụng đường phân cách ---.",

    "Có thể sử dụng dấu • để liệt kê.",
    "Tiêu đề và nội dung phải dễ đọc.",
    "Nội dung phải phù hợp cho sinh viên.",

    "Ví dụ cách viết đúng: React Native cho phép xây dựng ứng dụng di động bằng JavaScript.",
    "Ví dụ cách viết sai: React Native cho phep xay dung ung dung di dong bang JavaScript.",
].join(" "),

            prompt,

            maxOutputTokens,
        });

    console.log(
        "GEMINI SUMMARY TIME:",
        `${(
            (Date.now() -
                aiStartTime) /
            1000
        ).toFixed(2)} giây`
    );

    const content =
        cleanSummaryText(
            rawContent
        );

    if (!content) {
        const error = new Error(
            "AI không trả về nội dung tóm tắt hợp lệ."
        );

        error.statusCode = 502;
        throw error;
    }

    const summary =
        createSummary({
            userId,
            documentId,

            title:
                `Tóm tắt - ${document.name}`,

            type,
            content,
        });

    await summariesCollection.insertOne(
        summary
    );

    console.log(
        `SUMMARY SAVED: ${type}`
    );

    return summary;
};

// ========================================
// SUMMARY HISTORY
// ========================================

const getDocumentSummaries = async ({
    userId,
    documentId,
}) => {
    if (!ObjectId.isValid(userId)) {
        const error = new Error(
            "User ID không hợp lệ."
        );

        error.statusCode = 400;
        throw error;
    }

    if (!ObjectId.isValid(documentId)) {
        const error = new Error(
            "Document ID không hợp lệ."
        );

        error.statusCode = 400;
        throw error;
    }

    const db =
        client.db("appEduai");

    const documentsCollection =
        db.collection("documents");

    const summariesCollection =
        db.collection("summaries");

    const userObjectId =
        new ObjectId(userId);

    const documentObjectId =
        new ObjectId(documentId);

    const document =
        await documentsCollection.findOne({
            _id: documentObjectId,
            userId: userObjectId,
        });

    if (!document) {
        const error = new Error(
            "Không tìm thấy tài liệu hoặc bạn không có quyền truy cập."
        );

        error.statusCode = 404;
        throw error;
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
                createdAt: -1,
            })
            .toArray();

    return summaries;
};

// ========================================
// SUMMARY DETAIL
// ========================================

const getSummaryById = async ({
    userId,
    summaryId,
}) => {
    if (!ObjectId.isValid(userId)) {
        const error = new Error(
            "User ID không hợp lệ."
        );

        error.statusCode = 400;
        throw error;
    }

    if (!ObjectId.isValid(summaryId)) {
        const error = new Error(
            "Summary ID không hợp lệ."
        );

        error.statusCode = 400;
        throw error;
    }

    const db =
        client.db("appEduai");

    const summariesCollection =
        db.collection("summaries");

    const summary =
        await summariesCollection.findOne({
            _id:
                new ObjectId(summaryId),

            userId:
                new ObjectId(userId),
        });

    if (!summary) {
        const error = new Error(
            "Không tìm thấy bản tóm tắt."
        );

        error.statusCode = 404;
        throw error;
    }

    // Làm sạch Markdown của dữ liệu cũ
    const cleanedContent =
        cleanSummaryText(
            summary.content
        );

    if (
        cleanedContent !==
        summary.content
    ) {
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

        summary.content =
            cleanedContent;

        summary.updatedAt =
            updatedAt;
    }

    return summary;
};

// ========================================
// DELETE SUMMARY
// ========================================

const deleteSummaryById = async ({
    userId,
    summaryId,
}) => {
    if (!ObjectId.isValid(userId)) {
        const error = new Error(
            "User ID không hợp lệ."
        );

        error.statusCode = 400;
        throw error;
    }

    if (!ObjectId.isValid(summaryId)) {
        const error = new Error(
            "Summary ID không hợp lệ."
        );

        error.statusCode = 400;
        throw error;
    }

    const db =
        client.db("appEduai");

    const summariesCollection =
        db.collection("summaries");

    const result =
        await summariesCollection.deleteOne({
            _id:
                new ObjectId(summaryId),

            userId:
                new ObjectId(userId),
        });

    if (result.deletedCount === 0) {
        const error = new Error(
            "Không tìm thấy bản tóm tắt."
        );

        error.statusCode = 404;
        throw error;
    }

    return true;
};

module.exports = {
    summarizeDocument,
    getDocumentSummaries,
    getSummaryById,
    deleteSummaryById,
};
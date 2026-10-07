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

    const db = client.db("appEduai");

    const documentsCollection =
        db.collection("documents");

    const summariesCollection =
        db.collection("summaries");

    const document =
        await documentsCollection.findOne({
            _id: new ObjectId(documentId),
            userId: new ObjectId(userId),
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

    const prompt = getSummaryPrompt({
        text: document.extractedText,
        type,
    });

    const content =
        await generateText({
            instructions:
                "Bạn là trợ lý học tập chuyên tóm tắt tài liệu.",
            prompt,
        });

    const summary = createSummary({
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

    return summary;
};

module.exports = {
    summarizeDocument,
};
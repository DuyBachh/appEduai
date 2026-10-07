const {
    ObjectId,
} = require("mongodb");

const createSummary = ({
    userId,
    documentId,
    title = "",
    type = "medium",
    content = "",
}) => {
    const now =
        new Date();

    return {
        _id:
            new ObjectId(),

        userId:
            new ObjectId(
                userId
            ),

        documentId:
            new ObjectId(
                documentId
            ),

        title:
            String(
                title || ""
            ).trim(),

        type,

        content:
            String(
                content ||
                    ""
            ).trim(),

        createdAt:
            now,

        updatedAt:
            now,
    };
};

module.exports = {
    createSummary,
};
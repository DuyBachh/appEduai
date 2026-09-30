const { ObjectId } = require("mongodb");

const createSummary = ({
    userId,
    documentId,
    title = "",
    type = "medium",
    content = "",
}) => {
    return {
        _id: new ObjectId(),

        userId: new ObjectId(userId),
        documentId: new ObjectId(documentId),

        title,
        type,
        content,

        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

module.exports = {
    createSummary,
};
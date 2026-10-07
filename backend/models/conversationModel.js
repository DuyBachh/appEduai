const {
    ObjectId,
} = require("mongodb");

const createConversation = ({
    userId,
    documentId,
    title = "Cuộc trò chuyện mới",
}) => {
    const now =
        new Date();

    const normalizedTitle =
        String(
            title || ""
        ).trim() ||
        "Cuộc trò chuyện mới";

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
            normalizedTitle,

        createdAt:
            now,

        updatedAt:
            now,
    };
};

module.exports = {
    createConversation,
};
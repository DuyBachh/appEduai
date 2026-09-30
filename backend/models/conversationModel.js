const { ObjectId } = require("mongodb");

const createConversation = ({
    userId,
    title = "Cuộc trò chuyện mới",
}) => {
    return {
        _id: new ObjectId(),

        userId: new ObjectId(userId),

        title,

        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

module.exports = {
    createConversation,
};
const { ObjectId } = require("mongodb");

const createMessage = ({
    conversationId,
    userId,
    role,
    content,
}) => {
    return {
        _id: new ObjectId(),

        conversationId: new ObjectId(conversationId),
        userId: new ObjectId(userId),

        role,
        content,

        createdAt: new Date(),
    };
};

module.exports = {
    createMessage,
};
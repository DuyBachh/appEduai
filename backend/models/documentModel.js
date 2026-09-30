const { ObjectId } = require("mongodb");

const createDocument = ({
    userId,
    name,
    fileType,
    size = 0,
    uri = "",
    subject = "",
    topic = "",
}) => {
    return {
        _id: new ObjectId(),

        userId: new ObjectId(userId),

        name,
        fileType,
        size,
        uri,

        subject,
        topic,

        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

module.exports = {
    createDocument,
};
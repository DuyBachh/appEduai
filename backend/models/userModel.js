const { ObjectId } = require("mongodb");

const createUser = ({
    name,
    email,
    password,
}) => {
    return {
        _id: new ObjectId(),
        name,
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

module.exports = {
    createUser,
};
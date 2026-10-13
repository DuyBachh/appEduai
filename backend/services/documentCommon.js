const { ObjectId } = require("mongodb");
const { client } = require("../config/database");

const getDocumentsCollection = () => {
    const db = client.db("appEduai");

    return db.collection("documents");
};

const validateObjectId = (
    id,
    message = "ID không hợp lệ."
) => {
    if (!ObjectId.isValid(id)) {
        const error = new Error(message);

        error.statusCode = 400;

        throw error;
    }
};

module.exports = { getDocumentsCollection, validateObjectId };

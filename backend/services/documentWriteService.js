const { createDocument } = require("../models/documentModel");
const { extractTextFromFile } = require("./extractTextService");
const { getDocumentsCollection, validateObjectId } = require("./documentCommon");

const createDocumentService = async ({
    userId,
    name,
    fileType,
    size = 0,
    uri = "",
    subject = "",
    topic = "",
    extractedText = "",
}) => {
    validateObjectId(
        userId,
        "User ID không hợp lệ."
    );

    const documentsCollection =
        getDocumentsCollection();

    const document = createDocument({
        userId,
        name,
        fileType,
        size,
        uri,
        subject,
        topic,
        extractedText,
    });

    await documentsCollection.insertOne(
        document
    );

    return document;
};

const uploadDocumentService = async ({
    userId,
    file,
    subject = "",
    topic = "",
}) => {
    validateObjectId(
        userId,
        "User ID không hợp lệ."
    );

    if (!file) {
        const error = new Error(
            "Vui lòng chọn file để upload."
        );

        error.statusCode = 400;

        throw error;
    }

    const extension = file.originalname
        .split(".")
        .pop()
        .toLowerCase();

    const extractedText =
        await extractTextFromFile({
            filePath: file.path,
            fileType: extension,
        });

    const document = createDocument({
        userId,
        name: file.originalname,
        fileType: extension,
        size: file.size,
        uri: `/uploads/${file.filename}`,
        subject,
        topic,
        extractedText,
    });

    const documentsCollection =
        getDocumentsCollection();

    await documentsCollection.insertOne(
        document
    );

    return document;
};

module.exports = { createDocumentService, uploadDocumentService };

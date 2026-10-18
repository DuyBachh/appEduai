const fs = require("node:fs/promises");
const path = require("node:path");
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

    let stored = false;

    try {
        const extension = path.extname(file.originalname).toLowerCase();
        const uploadedExtension = path.extname(file.filename).toLowerCase();

        if (
            ![".pdf", ".docx", ".txt"].includes(extension) ||
            extension !== uploadedExtension
        ) {
            const error = new Error("Tên file hoặc loại tài liệu không hợp lệ.");
            error.statusCode = 400;
            throw error;
        }

        const extractedText = await extractTextFromFile({
            filePath: file.path,
            fileType: extension.slice(1),
        });

        const document = createDocument({
            userId,
            name: path.basename(file.originalname),
            fileType: extension.slice(1),
            size: file.size,
            uri: `/uploads/${file.filename}`,
            subject,
            topic,
            extractedText,
        });

        const documentsCollection = getDocumentsCollection();
        await documentsCollection.insertOne(document);
        stored = true;
        return document;
    } finally {
        // Multer has already stored the file before parsing/DB insertion.
        // On any failure do not leave an orphaned private PDF/DOCX/TXT.
        if (!stored && file.path) {
            try {
                await fs.unlink(file.path);
            } catch (cleanupError) {
                if (cleanupError.code !== "ENOENT") {
                    console.error("UPLOAD CLEANUP FAILED:", cleanupError);
                }
            }
        }
    }
};

module.exports = { createDocumentService, uploadDocumentService };

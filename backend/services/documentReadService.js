const { ObjectId } = require("mongodb");
const { getDocumentsCollection, validateObjectId } = require("./documentCommon");

const getDocuments = async (userId) => {
    validateObjectId(
        userId,
        "User ID không hợp lệ."
    );

    const documentsCollection =
        getDocumentsCollection();

    return documentsCollection
        .find({
            userId: new ObjectId(userId),
        })
        .sort({
            createdAt: -1,
        })
        .toArray();
};

const getDocumentById = async ({
    userId,
    documentId,
}) => {
    validateObjectId(
        userId,
        "User ID không hợp lệ."
    );

    validateObjectId(
        documentId,
        "Document ID không hợp lệ."
    );

    const documentsCollection =
        getDocumentsCollection();

    const document =
        await documentsCollection.findOne({
            _id: new ObjectId(documentId),
            userId: new ObjectId(userId),
        });

    if (!document) {
        const error = new Error(
            "Không tìm thấy tài liệu hoặc bạn không có quyền truy cập."
        );

        error.statusCode = 404;

        throw error;
    }

    return document;
};

const updateDocument = async ({
    userId,
    documentId,
    name,
    subject,
    topic,
}) => {
    validateObjectId(
        userId,
        "User ID không hợp lệ."
    );

    validateObjectId(
        documentId,
        "Document ID không hợp lệ."
    );

    const documentsCollection =
        getDocumentsCollection();

    const updateData = {
        updatedAt: new Date(),
    };

    if (name !== undefined) {
        updateData.name = name;
    }

    if (subject !== undefined) {
        updateData.subject = subject;
    }

    if (topic !== undefined) {
        updateData.topic = topic;
    }

    const result =
        await documentsCollection.updateOne(
            {
                _id: new ObjectId(documentId),
                userId: new ObjectId(userId),
            },
            {
                $set: updateData,
            }
        );

    if (result.matchedCount === 0) {
        const error = new Error(
            "Không tìm thấy tài liệu hoặc bạn không có quyền chỉnh sửa."
        );

        error.statusCode = 404;

        throw error;
    }

    return getDocumentById({
        userId,
        documentId,
    });
};

const deleteDocument = async ({
    userId,
    documentId,
}) => {
    validateObjectId(
        userId,
        "User ID không hợp lệ."
    );

    validateObjectId(
        documentId,
        "Document ID không hợp lệ."
    );

    const documentsCollection =
        getDocumentsCollection();

    const result =
        await documentsCollection.deleteOne({
            _id: new ObjectId(documentId),
            userId: new ObjectId(userId),
        });

    if (result.deletedCount === 0) {
        const error = new Error(
            "Không tìm thấy tài liệu hoặc bạn không có quyền xóa."
        );

        error.statusCode = 404;

        throw error;
    }

    return {
        id: documentId,
    };
};

module.exports = { getDocuments, getDocumentById, updateDocument, deleteDocument };

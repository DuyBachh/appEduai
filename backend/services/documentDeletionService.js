const { ObjectId } = require("mongodb");
const { createServiceError } = require("../utils/serviceError");

const validateObjectId = (value, message) => {
    if (!ObjectId.isValid(value)) {
        throw createServiceError(message, 400);
    }
};
const { resolveManagedUploadPath, removeManagedUpload } = require("../utils/managedUpload");

// Keep this helper isolated so its safety and cascading behavior can be tested
// with fake collections, without touching the user's MongoDB or uploaded files.
const deleteDocumentWithDependencies = async (
    { userId, documentId },
    { db, cleanupFile = removeManagedUpload }
) => {
    validateObjectId(userId, "User ID không hợp lệ.");
    validateObjectId(documentId, "Document ID không hợp lệ.");

    const userObjectId = new ObjectId(userId);
    const documentObjectId = new ObjectId(documentId);

    const documents = db.collection("documents");
    const summaries = db.collection("summaries");
    const conversations = db.collection("conversations");
    const messages = db.collection("messages");

    const ownerFilter = { _id: documentObjectId, userId: userObjectId };
    const document = await documents.findOne(ownerFilter);

    if (!document) {
        throw createServiceError(
            "Không tìm thấy tài liệu hoặc bạn không có quyền xóa.",
            404
        );
    }

    // Delete dependent records first. On a database error, the document
    // remains available so the user can retry cleanup without orphaning data.
    const relatedConversationFilter = {
        userId: userObjectId,
        documentId: documentObjectId,
    };

    const relatedConversations = await conversations
        .find(relatedConversationFilter)
        .project({ _id: 1 })
        .toArray();

    const conversationIds = relatedConversations.map((item) => item._id);

    const messageDeleteResult = conversationIds.length > 0
        ? await messages.deleteMany({
              userId: userObjectId,
              conversationId: { $in: conversationIds },
          })
        : { deletedCount: 0 };

    const conversationDeleteResult = await conversations.deleteMany(
        relatedConversationFilter
    );

    const summaryDeleteResult = await summaries.deleteMany({
        userId: userObjectId,
        documentId: documentObjectId,
    });

    const deletedDocument = await documents.deleteOne(ownerFilter);
    if (deletedDocument.deletedCount !== 1) {
        throw createServiceError(
            "Tài liệu đã bị xóa hoặc không còn quyền truy cập.",
            404
        );
    }

    // Disk uploads and MongoDB are different storage systems. Do not let a
    // file-system error pretend the deleted database record still exists.
    let fileStatus = "not-managed";

    if (resolveManagedUploadPath(document.uri)) {
        try {
            const otherReferences = await documents.countDocuments({
                uri: document.uri,
            });

            fileStatus = otherReferences > 0
                ? "shared"
                : await cleanupFile(document.uri);
        } catch (error) {
            console.error("DOCUMENT FILE CLEANUP ERROR:", error);
            fileStatus = "failed";
        }
    }

    return {
        id: documentId,
        deletedSummaries: summaryDeleteResult.deletedCount,
        deletedConversations: conversationDeleteResult.deletedCount,
        deletedMessages: messageDeleteResult.deletedCount,
        fileStatus,
    };
};

const deleteDocument = async ({ userId, documentId }) => {
    // Delay loading the real database client so isolated tests never require
    // production MongoDB configuration or an active connection.
    const { client } = require("../config/database");
    return deleteDocumentWithDependencies(
        { userId, documentId },
        { db: client.db("appEduai") }
    );
};

module.exports = { deleteDocument, deleteDocumentWithDependencies };

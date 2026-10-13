const { createDocumentService, uploadDocumentService } = require("./documentWriteService");
const { getDocuments, getDocumentById, updateDocument, deleteDocument } = require("./documentReadService");

module.exports = {
    createDocumentService,
    uploadDocumentService,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
};
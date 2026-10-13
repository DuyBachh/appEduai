const express = require("express");

const {
    createDocument,
    uploadDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} = require("../controllers/documentController");

const {
    authMiddleware,
} = require("../middleware/authMiddleware");

const {
    upload,
} = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    createDocument
);

router.post(
    "/upload",
    upload.any(),
    uploadDocument
);

router.get(
    "/",
    getDocuments
);

router.get(
    "/:id",
    getDocumentById
);

router.put(
    "/:id",
    updateDocument
);

router.delete(
    "/:id",
    deleteDocument
);

module.exports = router;
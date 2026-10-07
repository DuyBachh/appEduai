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

// Tạo document metadata
router.post(
    "/",
    createDocument
);

// Upload một file
router.post(
    "/upload",
    upload.single("file"),
    uploadDocument
);

// Lấy danh sách document
router.get(
    "/",
    getDocuments
);

// Lấy chi tiết document
router.get(
    "/:id",
    getDocumentById
);

// Cập nhật document
router.put(
    "/:id",
    updateDocument
);

// Xóa document
router.delete(
    "/:id",
    deleteDocument
);

module.exports = router;
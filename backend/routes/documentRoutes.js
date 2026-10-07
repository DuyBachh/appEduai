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

    // Debug request trước Multer
    (req, res, next) => {
        console.log(
            "\n===== UPLOAD REQUEST ====="
        );

        console.log(
            "CONTENT-TYPE:",
            req.headers["content-type"]
        );

        console.log(
            "CONTENT-LENGTH:",
            req.headers["content-length"]
        );

        next();
    },

    // Nhận mọi field file
    upload.any(),

    // Debug sau Multer
    (req, res, next) => {
        console.log(
            "FILES SAU MULTER:",
            req.files
        );

        console.log(
            "BODY SAU MULTER:",
            req.body
        );

        next();
    },

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
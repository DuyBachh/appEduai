const express =
    require("express");

const ocrController =
    require(
        "../controllers/ocrController"
    );

const authModule =
    require(
        "../middleware/authMiddleware"
    );

const uploadModule =
    require(
        "../middleware/ocrUploadMiddleware"
    );

// ========================================
// AUTH
// ========================================

const authMiddleware =
    typeof authModule ===
    "function"
        ? authModule
        : authModule.authMiddleware ||
          authModule.protect ||
          authModule.authenticate ||
          authModule.authenticateToken ||
          authModule.verifyToken;

if (
    typeof authMiddleware !==
    "function"
) {
    throw new TypeError(
        "authMiddleware không phải function."
    );
}

// ========================================
// UPLOAD
// ========================================

const ocrUpload =
    uploadModule.ocrUpload;

if (
    !ocrUpload ||
    typeof ocrUpload.single !==
        "function"
) {
    throw new TypeError(
        "ocrUpload không phải Multer middleware hợp lệ."
    );
}

// ========================================
// CONTROLLER
// ========================================

if (
    typeof ocrController
        .extractText !==
    "function"
) {
    throw new TypeError(
        "ocrController.extractText không phải function."
    );
}

// ========================================
// ROUTER
// ========================================

const router =
    express.Router();

router.use(
    authMiddleware
);

// POST /api/ocr
router.post(
    "/",
    ocrUpload.single(
        "image"
    ),
    ocrController.extractText
);

// ========================================
// EXPORT
// ========================================

module.exports =
    router;

module.exports.ocrRoutes =
    router;
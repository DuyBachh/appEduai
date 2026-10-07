const multer =
    require("multer");

// ========================================
// STORAGE
// ========================================

const storage =
    multer.memoryStorage();

// ========================================
// CONFIG
// ========================================

const MAX_FILE_SIZE =
    10 * 1024 * 1024;

const allowedMimeTypes =
    new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif",
    ]);

// ========================================
// FILE FILTER
// ========================================

const fileFilter = (
    req,
    file,
    cb
) => {
    const mimeType =
        String(
            file?.mimetype || ""
        ).toLowerCase();

    if (
        !allowedMimeTypes.has(
            mimeType
        )
    ) {
        const error =
            new Error(
                "Chỉ hỗ trợ ảnh JPG, JPEG, PNG, WEBP, HEIC và HEIF."
            );

        error.statusCode =
            400;

        return cb(
            error,
            false
        );
    }

    return cb(
        null,
        true
    );
};

// ========================================
// MULTER
// ========================================

const ocrUpload =
    multer({
        storage,

        fileFilter,

        limits: {
            fileSize:
                MAX_FILE_SIZE,

            files: 1,
        },
    });

// ========================================
// EXPORT
// ========================================

module.exports = {
    ocrUpload,
};
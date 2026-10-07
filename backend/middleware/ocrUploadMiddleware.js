const multer = require("multer");

const storage =
    multer.memoryStorage();

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const fileFilter = (
    req,
    file,
    cb
) => {
    if (
        !allowedMimeTypes.includes(
            file.mimetype
        )
    ) {
        const error = new Error(
            "Chỉ hỗ trợ ảnh JPG, JPEG, PNG và WEBP."
        );

        error.statusCode = 400;

        return cb(
            error,
            false
        );
    }

    cb(null, true);
};

const ocrUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize:
            10 * 1024 * 1024,
    },
});

module.exports = {
    ocrUpload,
};
const express = require("express");

const {
    extractText,
} = require("../controllers/ocrController");

const {
    authMiddleware,
} = require("../middleware/authMiddleware");

const {
    ocrUpload,
} = require("../middleware/ocrUploadMiddleware");

const router =
    express.Router();

router.use(
    authMiddleware
);

router.post(
    "/",
    ocrUpload.single("image"),
    extractText
);

module.exports = router;
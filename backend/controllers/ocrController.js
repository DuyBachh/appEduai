const {
    extractTextFromImage,
} = require("../services/ocrService");

const extractText = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await extractTextFromImage({
                file: req.file,
            });

        res.status(200).json({
            success: true,
            message:
                "OCR ảnh thành công.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    extractText,
};
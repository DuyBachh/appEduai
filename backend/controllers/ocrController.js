const ocrService =
    require(
        "../services/ocrService"
    );

// ========================================
// VERIFY SERVICE
// ========================================

if (
    typeof ocrService
        .extractTextFromImage !==
    "function"
) {
    throw new TypeError(
        "ocrService.extractTextFromImage không phải function."
    );
}

const {
    extractTextFromImage,
} = ocrService;

// ========================================
// OCR
// ========================================

const extractText =
    async (
        req,
        res,
        next
    ) => {
        try {
            const result =
                await extractTextFromImage(
                    {
                        file:
                            req.file,
                    }
                );

            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "OCR ảnh thành công.",

                    data:
                        result,
                });
        } catch (error) {
            return next(
                error
            );
        }
    };

// ========================================
// EXPORT
// ========================================

module.exports = {
    extractText,
};
const {
    getOcrPrompt,
    NO_TEXT_MARKER,
} = require("../prompts/ocrPrompts");

const { runModelWithRetry, isRetryableError, createFinalAiError } = require("./ocrAiService");
const { createServiceError } = require("../utils/serviceError");

// ========================================
// CONFIG
// ========================================

const PRIMARY_MODEL =
    process.env
        .GEMINI_OCR_MODEL ||
    "gemini-3.5-flash-lite";

const FALLBACK_MODEL =
    process.env
        .GEMINI_OCR_FALLBACK_MODEL ||
    "gemini-3.8-flash";

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
// OCR IMAGE
// ========================================

const extractTextFromImage =
    async ({
        file,
    }) => {
        // ========================================
        // VALIDATE
        // ========================================

        if (!file) {
            throw createServiceError(
                "Vui lòng chọn ảnh để OCR.",
                400
            );
        }

        if (
            !file.buffer ||
            !Buffer.isBuffer(
                file.buffer
            )
        ) {
            throw createServiceError(
                "Dữ liệu ảnh không hợp lệ.",
                400
            );
        }

        if (
            file.size >
            MAX_FILE_SIZE
        ) {
            throw createServiceError(
                "Ảnh không được vượt quá 10 MB.",
                413
            );
        }

        const mimeType =
            String(
                file.mimetype ||
                    ""
            ).toLowerCase();

        if (
            !allowedMimeTypes.has(
                mimeType
            )
        ) {
            throw createServiceError(
                "Định dạng ảnh không được hỗ trợ.",
                400
            );
        }

        // ========================================
        // BASE64
        // ========================================

        const base64Image =
            file.buffer.toString(
                "base64"
            );

        const prompt =
            getOcrPrompt();

        const models =
            [
                ...new Set(
                    [
                        PRIMARY_MODEL,
                        FALLBACK_MODEL,
                    ].filter(
                        Boolean
                    )
                ),
            ];

        let lastError =
            null;

        let extractedText =
            "";

        let modelUsed =
            null;

        // ========================================
        // AI
        // ========================================

        for (
            let index = 0;
            index <
            models.length;
            index += 1
        ) {
            const model =
                models[index];

            if (index > 0) {
                console.log(
                    `OCR FALLBACK MODEL: ${model}`
                );
            }

            try {
                extractedText =
                    await runModelWithRetry(
                        {
                            model,

                            base64Image,

                            mimeType,

                            prompt,
                        }
                    );

                modelUsed =
                    model;

                break;
            } catch (error) {
                lastError =
                    error;

                if (
                    !isRetryableError(
                        error
                    )
                ) {
                    throw error;
                }
            }
        }

        if (
            !extractedText
        ) {
            throw createFinalAiError(
                lastError
            );
        }

        // ========================================
        // NO TEXT
        // ========================================

        if (
            extractedText
                .trim()
                .toUpperCase() ===
            NO_TEXT_MARKER
        ) {
            throw createServiceError(
                "Không nhận diện được văn bản trong ảnh.",
                422
            );
        }

        // ========================================
        // SUCCESS
        // ========================================

        console.log(
            "OCR SUCCESS:",
            `${extractedText.length} ký tự`
        );

        return {
            originalName:
                file.originalname ||
                "image",

            mimeType,

            size:
                file.size,

            extractedText,

            model:
                modelUsed,
        };
    };

// ========================================
// EXPORT
// ========================================

module.exports = {
    extractTextFromImage,
};
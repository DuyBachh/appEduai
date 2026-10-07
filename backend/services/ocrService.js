const {
    ai,
} = require("../config/ai");

const {
    getOcrPrompt,
    NO_TEXT_MARKER,
} = require("../prompts/ocrPrompts");

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

const MAX_ATTEMPTS_PER_MODEL =
    2;

const MAX_OUTPUT_TOKENS =
    4096;

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

const retryableStatusCodes =
    new Set([
        408,
        429,
        500,
        502,
        503,
        504,
    ]);

// ========================================
// ERROR
// ========================================

const createServiceError = (
    message,
    statusCode
) => {
    const error =
        new Error(
            message
        );

    error.statusCode =
        statusCode;

    return error;
};

// ========================================
// WAIT
// ========================================

const wait = (
    milliseconds
) => {
    return new Promise(
        (resolve) => {
            setTimeout(
                resolve,
                milliseconds
            );
        }
    );
};

// ========================================
// ERROR STATUS
// ========================================

const getErrorStatus = (
    error
) => {
    const directStatus =
        error?.statusCode ||
        error?.status ||
        error?.code ||
        error?.error?.code ||
        error?.response?.status;

    if (
        directStatus &&
        Number.isFinite(
            Number(
                directStatus
            )
        )
    ) {
        return Number(
            directStatus
        );
    }

    const message =
        String(
            error?.message ||
                ""
        );

    const match =
        message.match(
            /"code"\s*:\s*(\d{3})/
        );

    if (match) {
        return Number(
            match[1]
        );
    }

    return null;
};

// ========================================
// RETRYABLE
// ========================================

const isRetryableError = (
    error
) => {
    const status =
        getErrorStatus(
            error
        );

    const message =
        String(
            error?.message ||
                ""
        ).toLowerCase();

    return (
        retryableStatusCodes.has(
            status
        ) ||
        message.includes(
            "deadline"
        ) ||
        message.includes(
            "timeout"
        ) ||
        message.includes(
            "timed out"
        ) ||
        message.includes(
            "unavailable"
        ) ||
        message.includes(
            "high demand"
        )
    );
};

// ========================================
// CLEAN OCR
// ========================================

const cleanOcrText = (
    value = ""
) => {
    let text =
        String(
            value
        ).trim();

    // Gemini đôi khi tự bọc code fence.
    text =
        text.replace(
            /^```(?:text|plaintext)?\s*/i,
            ""
        );

    text =
        text.replace(
            /\s*```$/i,
            ""
        );

    text =
        text.replace(
            /\r\n/g,
            "\n"
        );

    text =
        text.replace(
            /[ \t]+$/gm,
            ""
        );

    text =
        text.replace(
            /\n{4,}/g,
            "\n\n\n"
        );

    return text.trim();
};

// ========================================
// CALL MODEL
// ========================================

const callOcrModel =
    async ({
        model,
        base64Image,
        mimeType,
        prompt,
    }) => {
        console.log(
            `OCR GEMINI MODEL: ${model}`
        );

        const startedAt =
            Date.now();

        const response =
            await ai.models.generateContent(
                {
                    model,

                    contents: [
                        {
                            inlineData:
                                {
                                    mimeType,

                                    data:
                                        base64Image,
                                },
                        },

                        {
                            text:
                                prompt,
                        },
                    ],

                    config: {
                        maxOutputTokens:
                            MAX_OUTPUT_TOKENS,
                    },
                }
            );

        console.log(
            `OCR GEMINI TIME (${model}):`,
            `${(
                (Date.now() -
                    startedAt) /
                1000
            ).toFixed(
                2
            )} giây`
        );

        const text =
            cleanOcrText(
                response?.text ||
                    ""
            );

        if (!text) {
            throw createServiceError(
                "AI không trả về kết quả OCR.",
                502
            );
        }

        return text;
    };

// ========================================
// MODEL WITH RETRY
// ========================================

const runModelWithRetry =
    async ({
        model,
        base64Image,
        mimeType,
        prompt,
    }) => {
        let lastError =
            null;

        for (
            let attempt = 1;
            attempt <=
            MAX_ATTEMPTS_PER_MODEL;
            attempt += 1
        ) {
            try {
                console.log(
                    `OCR ATTEMPT: ${attempt}/${MAX_ATTEMPTS_PER_MODEL}`
                );

                return await callOcrModel(
                    {
                        model,

                        base64Image,

                        mimeType,

                        prompt,
                    }
                );
            } catch (error) {
                lastError =
                    error;

                console.log(
                    `OCR ERROR (${model}):`,
                    error.message
                );

                if (
                    !isRetryableError(
                        error
                    )
                ) {
                    throw error;
                }

                if (
                    attempt <
                    MAX_ATTEMPTS_PER_MODEL
                ) {
                    const delay =
                        1500 *
                        2 **
                            (attempt -
                                1);

                    console.log(
                        "OCR RETRY AFTER:",
                        `${delay / 1000} giây`
                    );

                    await wait(
                        delay
                    );
                }
            }
        }

        throw lastError;
    };

// ========================================
// FINAL ERROR
// ========================================

const createFinalAiError = (
    error
) => {
    const status =
        getErrorStatus(
            error
        );

    if (status === 429) {
        return createServiceError(
            "Dịch vụ OCR AI đang bị giới hạn lượt gọi. Vui lòng thử lại sau.",
            429
        );
    }

    if (status === 503) {
        return createServiceError(
            "Dịch vụ OCR AI đang quá tải. Vui lòng thử lại sau.",
            503
        );
    }

    if (status === 504) {
        return createServiceError(
            "OCR AI phản hồi quá lâu. Vui lòng thử lại.",
            504
        );
    }

    return createServiceError(
        "Không thể xử lý OCR bằng AI. Vui lòng thử lại.",
        502
    );
};

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
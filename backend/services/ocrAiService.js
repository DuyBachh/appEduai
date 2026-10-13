const { ai } = require("../config/ai");
const { cleanOcrText } = require("../utils/ocrText");
const { createServiceError } = require("../utils/serviceError");

const MAX_ATTEMPTS_PER_MODEL =
    2;

const MAX_OUTPUT_TOKENS =
    4096;

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


module.exports = { runModelWithRetry, isRetryableError, createFinalAiError };

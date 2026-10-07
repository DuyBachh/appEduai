const {
    ai,
} = require("../config/ai");

// ========================================
// MODEL CONFIG
// ========================================

const PRIMARY_MODEL =
    process.env.GEMINI_PRIMARY_MODEL ||
    "gemini-3.5-flash-lite";

const FALLBACK_MODEL =
    process.env.GEMINI_FALLBACK_MODEL ||
    "gemini-3.8-flash";

const MAX_ATTEMPTS_PER_MODEL =
    2;

const RETRYABLE_STATUS_CODES =
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
// GET ERROR STATUS
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
// THINKING LEVEL
// ========================================

const getThinkingLevel = (
    model
) => {
    // Gemini 3.8 / 3.7
    // không hỗ trợ minimal
    if (
        /gemini-3\.(8|7)-flash/i.test(
            model
        )
    ) {
        return "low";
    }

    // Gemini 3.5 Flash-Lite
    return "minimal";
};

// ========================================
// RETRYABLE ERROR
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
        RETRYABLE_STATUS_CODES.has(
            status
        ) ||
        error?.name ===
            "AbortError" ||
        error?.name ===
            "TimeoutError" ||
        message.includes(
            "deadline_exceeded"
        ) ||
        message.includes(
            "deadline exceeded"
        ) ||
        message.includes(
            "deadline expired"
        ) ||
        message.includes(
            "timeout"
        ) ||
        message.includes(
            "timed out"
        ) ||
        message.includes(
            "high demand"
        ) ||
        message.includes(
            "unavailable"
        )
    );
};

// ========================================
// CALL GEMINI MODEL
// ========================================

const callModel = async ({
    model,
    prompt,
    instructions,
    maxOutputTokens,
}) => {
    const startedAt =
        Date.now();

    console.log(
        `GEMINI MODEL: ${model}`
    );

    const response =
        await ai.models.generateContent({
            model,

            contents:
                prompt.trim(),

            config: {
                maxOutputTokens,

                thinkingConfig: {
                    thinkingLevel:
                        getThinkingLevel(
                            model
                        ),
                },

                httpOptions: {
                    // Không cho SDK
                    // tự retry ngầm.
                    // Service sẽ tự retry.
                    retryOptions: {
                        attempts: 1,
                    },

                    // KHÔNG đặt timeout.
                    // Cho phép AI chạy lâu.
                },

                ...(instructions
                    ? {
                          systemInstruction:
                              instructions,
                      }
                    : {}),
            },
        });

    const duration =
        (
            (Date.now() -
                startedAt) /
            1000
        ).toFixed(2);

    console.log(
        `GEMINI API TIME (${model}):`,
        `${duration} giây`
    );

    const text =
        response?.text
            ? response.text.trim()
            : "";

    if (!text) {
        const error =
            new Error(
                "AI không trả về nội dung."
            );

        error.statusCode =
            502;

        throw error;
    }

    return text;
};

// ========================================
// CREATE FINAL ERROR
// ========================================

const createFinalError = (
    error
) => {
    const status =
        getErrorStatus(
            error
        );

    if (status === 429) {
        const finalError =
            new Error(
                "Dịch vụ AI đang bị giới hạn lượt gọi. Vui lòng thử lại sau."
            );

        finalError.statusCode =
            429;

        return finalError;
    }

    if (status === 503) {
        const finalError =
            new Error(
                "Dịch vụ AI đang quá tải. Vui lòng thử lại sau."
            );

        finalError.statusCode =
            503;

        return finalError;
    }

    if (status === 504) {
        const finalError =
            new Error(
                "AI phản hồi quá lâu. Vui lòng thử lại."
            );

        finalError.statusCode =
            504;

        return finalError;
    }

    if (
        status === 400 ||
        status === 401 ||
        status === 403 ||
        status === 404
    ) {
        const finalError =
            new Error(
                "Yêu cầu tới dịch vụ AI không hợp lệ hoặc không được phép."
            );

        finalError.statusCode =
            502;

        return finalError;
    }

    const finalError =
        new Error(
            "Không thể kết nối dịch vụ AI. Vui lòng thử lại sau."
        );

    finalError.statusCode =
        502;

    return finalError;
};

// ========================================
// RUN MODEL WITH RETRY
// ========================================

const runWithRetry = async ({
    model,
    prompt,
    instructions,
    maxOutputTokens,
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
                `GEMINI ATTEMPT: ${attempt}/${MAX_ATTEMPTS_PER_MODEL}`
            );

            return await callModel({
                model,
                prompt,
                instructions,
                maxOutputTokens,
            });
        } catch (error) {
            lastError =
                error;

            const status =
                getErrorStatus(
                    error
                );

            console.log(
                `GEMINI ERROR (${model}) [${status || "unknown"}]:`,
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
                    "GEMINI RETRY AFTER:",
                    `${(
                        delay /
                        1000
                    ).toFixed(
                        1
                    )} giây`
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
// GENERATE TEXT
// ========================================

const generateText = async ({
    prompt,
    instructions = "",
    maxOutputTokens = 1024,
}) => {
    if (
        !prompt ||
        !String(
            prompt
        ).trim()
    ) {
        const error =
            new Error(
                "Prompt không được để trống."
            );

        error.statusCode =
            400;

        throw error;
    }

    const models = [
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
                `GEMINI FALLBACK MODEL: ${model}`
            );
        }

        try {
            return await runWithRetry(
                {
                    model,

                    prompt:
                        String(
                            prompt
                        ),

                    instructions,

                    maxOutputTokens,
                }
            );
        } catch (error) {
            lastError =
                error;

            const status =
                getErrorStatus(
                    error
                );

            // Nếu quota project bị giới hạn
            // thì đổi model thường
            // không giúp được.
            if (
                status === 429
            ) {
                break;
            }

            if (
                !isRetryableError(
                    error
                )
            ) {
                break;
            }
        }
    }

    throw createFinalError(
        lastError ||
            new Error(
                "AI request failed."
            )
    );
};

module.exports = {
    generateText,
};
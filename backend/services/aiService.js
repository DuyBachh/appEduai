const {
    ai,
} = require("../config/ai");

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
    return (
        error?.status ||
        error?.code ||
        error?.error?.code ||
        error?.response?.status
    );
};

// ========================================
// GENERATE TEXT
// ========================================

const generateText =
    async ({
        prompt,
        instructions = "",
        maxOutputTokens = 1024,
    }) => {
        // ========================================
        // VALIDATE
        // ========================================

        if (
            !prompt ||
            !prompt.trim()
        ) {
            const error =
                new Error(
                    "Prompt không được để trống."
                );

            error.statusCode =
                400;

            throw error;
        }

        // Chỉ retry 1 lần khi Gemini 503
        const maxRetries =
            1;

        for (
            let attempt = 0;
            attempt <= maxRetries;
            attempt++
        ) {
            try {
                const startTime =
                    Date.now();

                // ========================================
                // CALL GEMINI
                // ========================================

                const response =
                    await ai.models.generateContent({
                        model:
                            "gemini-3.5-flash-lite",

                        contents:
                            prompt.trim(),

                        config: {
                            maxOutputTokens,

                            // Ưu tiên phản hồi nhanh
                            thinkingConfig: {
                                thinkingLevel:
                                    "minimal",
                            },

                            // Tối đa 20 giây
                            httpOptions: {
                                timeout:
                                    20000,
                            },

                            ...(instructions
                                ? {
                                      systemInstruction:
                                          instructions,
                                  }
                                : {}),
                        },
                    });

                console.log(
                    "GEMINI API TIME:",
                    `${(
                        (Date.now() -
                            startTime) /
                        1000
                    ).toFixed(2)} giây`
                );

                // ========================================
                // RESPONSE TEXT
                // ========================================

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
            } catch (error) {
                // ========================================
                // ERROR INFO
                // ========================================

                const status =
                    getErrorStatus(
                        error
                    );

                const message =
                    String(
                        error?.message ||
                            ""
                    ).toLowerCase();

                console.log(
                    "GEMINI ERROR:",
                    error.message
                );

                // ========================================
                // RATE LIMIT - 429
                // ========================================

                if (
                    Number(status) ===
                        429 ||
                    message.includes(
                        '"code":429'
                    )
                ) {
                    const quotaError =
                        new Error(
                            "Đã đạt giới hạn sử dụng AI. Vui lòng thử lại sau."
                        );

                    quotaError.statusCode =
                        429;

                    throw quotaError;
                }

                // ========================================
                // DEADLINE / TIMEOUT - 504
                // ========================================

                if (
                    Number(status) ===
                        504 ||
                    message.includes(
                        '"code":504'
                    ) ||
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
                    error.name ===
                        "AbortError" ||
                    error.name ===
                        "TimeoutError"
                ) {
                    const timeoutError =
                        new Error(
                            "AI phản hồi quá lâu. Vui lòng thử lại."
                        );

                    timeoutError.statusCode =
                        504;

                    throw timeoutError;
                }

                // ========================================
                // GEMINI OVERLOAD - 503
                // ========================================

                if (
                    Number(status) ===
                        503 ||
                    message.includes(
                        '"code":503'
                    )
                ) {
                    if (
                        attempt <
                        maxRetries
                    ) {
                        const delay =
                            1000;

                        console.log(
                            `Gemini 503 - thử lại sau ${delay}ms`
                        );

                        await wait(
                            delay
                        );

                        continue;
                    }

                    const unavailableError =
                        new Error(
                            "Dịch vụ AI đang quá tải. Vui lòng thử lại sau."
                        );

                    unavailableError.statusCode =
                        503;

                    throw unavailableError;
                }

                // ========================================
                // INTERNAL ERROR ALREADY HANDLED
                // ========================================

                if (
                    error.statusCode
                ) {
                    throw error;
                }

                // ========================================
                // OTHER ERROR
                // ========================================

                const aiError =
                    new Error(
                        "Không thể kết nối dịch vụ AI."
                    );

                aiError.statusCode =
                    502;

                throw aiError;
            }
        }
    };

module.exports = {
    generateText,
};
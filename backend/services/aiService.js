const {
    ai,
} = require("../config/ai");

const wait = (milliseconds) => {
    return new Promise((resolve) => {
        setTimeout(
            resolve,
            milliseconds
        );
    });
};

const getErrorStatus = (error) => {
    return (
        error?.status ||
        error?.code ||
        error?.error?.code ||
        error?.response?.status
    );
};

const generateText = async ({
    prompt,
    instructions = "",
}) => {
    if (!prompt || !prompt.trim()) {
        const error = new Error(
            "Prompt không được để trống."
        );

        error.statusCode = 400;

        throw error;
    }

    const maxRetries = 2;

    for (
        let attempt = 0;
        attempt <= maxRetries;
        attempt++
    ) {
        try {
            const response =
                await ai.models.generateContent({
                    model:
                        "gemini-3.5-flash-lite",

                    contents:
                        prompt.trim(),

                    config: instructions
                        ? {
                              systemInstruction:
                                  instructions,
                          }
                        : undefined,
                });

            const text =
                response.text
                    ? response.text.trim()
                    : "";

            if (!text) {
                const error =
                    new Error(
                        "AI không trả về nội dung."
                    );

                error.statusCode = 502;

                throw error;
            }

            return text;
        } catch (error) {
            const status =
                getErrorStatus(error);

            // Quota / Rate limit
            if (Number(status) === 429) {
                const quotaError =
                    new Error(
                        "Đã đạt giới hạn sử dụng AI. Vui lòng thử lại sau."
                    );

                quotaError.statusCode = 429;

                throw quotaError;
            }

            // Gemini tạm thời quá tải
            if (Number(status) === 503) {
                if (
                    attempt <
                    maxRetries
                ) {
                    const delay =
                        1000 *
                        Math.pow(
                            2,
                            attempt
                        );

                    await wait(delay);

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

            // Timeout
            if (
                error.name ===
                "AbortError"
            ) {
                const timeoutError =
                    new Error(
                        "AI phản hồi quá lâu. Vui lòng thử lại."
                    );

                timeoutError.statusCode =
                    504;

                throw timeoutError;
            }

            if (error.statusCode) {
                throw error;
            }

            console.error(
                "Gemini Error:",
                error.message
            );

            const aiError =
                new Error(
                    "Không thể kết nối dịch vụ AI."
                );

            aiError.statusCode = 502;

            throw aiError;
        }
    }
};

module.exports = {
    generateText,
};
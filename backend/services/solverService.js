const {
    generateText,
} = require("./aiService");

const {
    getSolverPrompt,
} = require("../prompts/solverPrompts");

const { normalizeString, parseSolverResult } = require("../utils/solverResult");
const { createServiceError } = require("../utils/serviceError");

// ========================================
// CONFIG
// ========================================

const MAX_QUESTION_LENGTH =
    6000;

const MAX_FORMAT_ATTEMPTS =
    2;

const MAX_OUTPUT_TOKENS =
    1600;

// ========================================
// SOLVE QUESTION
// ========================================

const solveQuestion =
    async ({
        question,
    }) => {
        const normalizedQuestion =
            normalizeString(
                question
            );

        if (
            !normalizedQuestion
        ) {
            throw createServiceError(
                "Vui lòng nhập câu hỏi hoặc bài tập.",
                400
            );
        }

        if (
            normalizedQuestion.length >
            MAX_QUESTION_LENGTH
        ) {
            throw createServiceError(
                "Câu hỏi quá dài. Vui lòng rút gọn nội dung.",
                400
            );
        }

        const prompt =
            getSolverPrompt({
                question:
                    normalizedQuestion,
            });

        let lastError =
            null;

        // ========================================
        // FORMAT ATTEMPTS
        // ========================================

        for (
            let attempt = 1;
            attempt <=
            MAX_FORMAT_ATTEMPTS;
            attempt += 1
        ) {
            try {
                console.log(
                    `SOLVER FORMAT ATTEMPT: ${attempt}/${MAX_FORMAT_ATTEMPTS}`
                );

                const startedAt =
                    Date.now();

                const aiResponse =
                    await generateText(
                        {
                            instructions:
                                [
                                    "Bạn là trợ lý học tập chuyên giải bài tập từng bước.",

                                    "Luôn trả về JSON hợp lệ theo đúng schema được yêu cầu.",

                                    "Không thêm Markdown hoặc nội dung bên ngoài JSON.",

                                    "Trả lời bằng tiếng Việt.",
                                ].join(
                                    " "
                                ),

                            prompt,

                            maxOutputTokens:
                                MAX_OUTPUT_TOKENS,
                        }
                    );

                console.log(
                    "SOLVER AI TIME:",
                    `${(
                        (Date.now() -
                            startedAt) /
                        1000
                    ).toFixed(
                        2
                    )} giây`
                );

                const result =
                    parseSolverResult(
                        aiResponse
                    );

                console.log(
                    "SOLVER SUCCESS:",
                    result.type,
                    "-",
                    result.topic
                );

                return {
                    question:
                        normalizedQuestion,

                    ...result,
                };
            } catch (error) {
                lastError =
                    error;

                console.log(
                    "SOLVER FORMAT ERROR:",
                    error.message
                );

                if (
                    attempt <
                    MAX_FORMAT_ATTEMPTS
                ) {
                    console.log(
                        "SOLVER RETRY FORMAT..."
                    );
                }
            }
        }

        throw createServiceError(
            lastError?.message
                ? `AI trả về dữ liệu không đúng định dạng: ${lastError.message}`
                : "AI trả về dữ liệu không đúng định dạng.",
            502
        );
    };

// ========================================
// EXPORT
// ========================================

module.exports = {
    solveQuestion,
};
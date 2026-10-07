const {
    generateText,
} = require("./aiService");

const {
    getSolverPrompt,
} = require("../prompts/solverPrompts");

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
// CLEAN AI RESPONSE
// ========================================

const cleanJsonResponse = (
    response = ""
) => {
    let text =
        String(
            response
        ).trim();

    text =
        text.replace(
            /^```json\s*/i,
            ""
        );

    text =
        text.replace(
            /^```\s*/i,
            ""
        );

    text =
        text.replace(
            /\s*```$/i,
            ""
        );

    const firstBrace =
        text.indexOf(
            "{"
        );

    const lastBrace =
        text.lastIndexOf(
            "}"
        );

    if (
        firstBrace !== -1 &&
        lastBrace !== -1 &&
        lastBrace >
            firstBrace
    ) {
        text =
            text.slice(
                firstBrace,
                lastBrace + 1
            );
    }

    return text.trim();
};

// ========================================
// NORMALIZE STRING
// ========================================

const normalizeString = (
    value
) => {
    if (
        typeof value !==
        "string"
    ) {
        return "";
    }

    return value
        .replace(
            /\r\n/g,
            "\n"
        )
        .trim();
};

// ========================================
// NORMALIZE ARRAY
// ========================================

const normalizeStringArray = (
    value
) => {
    if (
        !Array.isArray(
            value
        )
    ) {
        return [];
    }

    return value
        .map(
            normalizeString
        )
        .filter(
            Boolean
        );
};

// ========================================
// PARSE RESULT
// ========================================

const parseSolverResult = (
    aiResponse
) => {
    const cleanedResponse =
        cleanJsonResponse(
            aiResponse
        );

    if (
        !cleanedResponse
    ) {
        throw new Error(
            "AI không trả về dữ liệu."
        );
    }

    const parsed =
        JSON.parse(
            cleanedResponse
        );

    if (
        !parsed ||
        typeof parsed !==
            "object" ||
        Array.isArray(
            parsed
        )
    ) {
        throw new Error(
            "Kết quả không phải object JSON."
        );
    }

    const type =
        normalizeString(
            parsed.type
        );

    const topic =
        normalizeString(
            parsed.topic
        );

    const hints =
        normalizeStringArray(
            parsed.hints
        );

    const explanation =
        normalizeString(
            parsed.explanation
        );

    const steps =
        normalizeStringArray(
            parsed.steps
        );

    // Hỗ trợ cả key cũ "answer"
    const finalAnswer =
        normalizeString(
            parsed.finalAnswer ||
                parsed.answer
        );

    if (
        !type ||
        !topic ||
        hints.length === 0 ||
        !explanation ||
        steps.length === 0 ||
        !finalAnswer
    ) {
        throw new Error(
            "AI trả về thiếu trường bắt buộc."
        );
    }

    return {
        type,

        topic,

        hints:
            hints.slice(
                0,
                3
            ),

        explanation,

        steps,

        finalAnswer,
    };
};

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
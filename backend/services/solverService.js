const {
    generateText,
} = require("./aiService");

const {
    getSolverPrompt,
} = require("../prompts/solverPrompts");

const cleanJsonResponse = (
    response
) => {
    return response
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
};

const solveQuestion = async ({
    question,
}) => {
    if (
        !question ||
        !question.trim()
    ) {
        const error = new Error(
            "Vui lòng nhập câu hỏi hoặc bài tập."
        );

        error.statusCode = 400;

        throw error;
    }

    const prompt = getSolverPrompt({
        question: question.trim(),
    });

    const aiResponse =
        await generateText({
            instructions:
                "Bạn là trợ lý học tập chuyên giải bài tập từng bước.",
            prompt,
        });

    try {
        const cleanedResponse =
            cleanJsonResponse(
                aiResponse
            );

        const result =
            JSON.parse(
                cleanedResponse
            );

        return {
            question:
                question.trim(),

            type:
                result.type ||
                "Không xác định",

            topic:
                result.topic ||
                "Không xác định",

            hints:
                Array.isArray(
                    result.hints
                )
                    ? result.hints
                    : [],

            explanation:
                result.explanation ||
                "",

            steps:
                Array.isArray(
                    result.steps
                )
                    ? result.steps
                    : [],

            answer:
                result.answer ||
                "",
        };
    } catch (error) {
        const parseError =
            new Error(
                "AI trả về dữ liệu không đúng định dạng."
            );

        parseError.statusCode = 500;

        throw parseError;
    }
};

module.exports = {
    solveQuestion,
};
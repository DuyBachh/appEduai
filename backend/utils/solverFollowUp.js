const { createServiceError } = require("./serviceError");
const { normalizeString } = require("./solverResult");

const ensureString = (value, maxLength, label) => {
    if (typeof value !== "string") {
        throw createServiceError(`${label} phải là văn bản.`, 400);
    }
    const normalized = normalizeString(value);
    if (!normalized || normalized.length > maxLength) {
        throw createServiceError(`${label} không hợp lệ hoặc quá dài.`, 400);
    }
    return normalized;
};

const prepareSolverFollowUp = ({
    question,
    originalQuestion,
    result,
    history = [],
}) => {
    const followUpQuestion = ensureString(question, 1000, "Câu hỏi tiếp theo");
    const sourceQuestion = ensureString(originalQuestion, 6000, "Đề bài gốc");

    if (!result || typeof result !== "object" || Array.isArray(result)) {
        throw createServiceError("Thiếu kết quả giải bài tập.", 400);
    }
    const explanation = ensureString(result.explanation, 4500, "Giải thích");
    const finalAnswer = ensureString(result.finalAnswer, 2000, "Đáp án");
    const steps = result.steps;
    if (!Array.isArray(steps) || steps.length < 1 || steps.length > 20) {
        throw createServiceError("Các bước giải không hợp lệ.", 400);
    }
    const safeSteps = steps.map((step) => ensureString(step, 1200, "Bước giải"));

    if (!Array.isArray(history) || history.length > 6) {
        throw createServiceError("Lịch sử hỏi tiếp không hợp lệ.", 400);
    }
    const safeHistory = history.map((turn) => {
        if (
            !turn || typeof turn !== "object" ||
            (turn.role !== "user" && turn.role !== "assistant")
        ) {
            throw createServiceError("Vai trò hội thoại không hợp lệ.", 400);
        }
        return {
            role: turn.role,
            content: ensureString(turn.content, 1200, "Nội dung hội thoại"),
        };
    });

    return {
        question: followUpQuestion,
        originalQuestion: sourceQuestion,
        result: {
            type: typeof result.type === "string" ? result.type.slice(0, 100) : "",
            topic: typeof result.topic === "string" ? result.topic.slice(0, 100) : "",
            explanation,
            steps: safeSteps,
            finalAnswer,
        },
        history: safeHistory,
    };
};

module.exports = { prepareSolverFollowUp };

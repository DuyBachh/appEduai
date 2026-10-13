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


module.exports = { normalizeString, parseSolverResult };

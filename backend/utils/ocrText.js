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


module.exports = { cleanOcrText };

// ========================================
// NORMALIZE TEXT
// ========================================

const normalizeText = (
    text = ""
) => {
    return String(
        text
    )
        .replace(
            /\r\n/g,
            "\n"
        )

        .replace(
            /\u0000/g,
            ""
        )

        .replace(
            /[ \t]+\n/g,
            "\n"
        )

        .replace(
            /\n{3,}/g,
            "\n\n"
        )

        .trim();
};

// ========================================
// CLEAN SUMMARY
// ========================================

const cleanSummaryText = (
    text = ""
) => {
    let cleaned =
        normalizeText(
            text
        );

    cleaned =
        cleaned

            // Chào hỏi
            .replace(
                /^\s*(?:Chào bạn|Xin chào)[^\n]*\n*/i,
                ""
            )

            // Giới thiệu trợ lý
            .replace(
                /^\s*(?:Tôi là|Mình là) trợ lý[^\n]*\n*/i,
                ""
            )

            // "Dưới đây..."
            .replace(
                /^\s*Dưới đây[^\n]*\n*/i,
                ""
            )

            // Markdown heading
            .replace(
                /^#{1,6}\s*/gm,
                ""
            )

            // **bold**
            .replace(
                /\*\*(.*?)\*\*/g,
                "$1"
            )

            // __bold__
            .replace(
                /__(.*?)__/g,
                "$1"
            )

            // *italic*
            .replace(
                /\*([^*\n]+)\*/g,
                "$1"
            )

            // _italic_
            .replace(
                /_([^_\n]+)_/g,
                "$1"
            )

            // Bullet Markdown
            .replace(
                /^\s*[-*]\s+/gm,
                "• "
            )

            // ```
            .replace(
                /```(?:\w+)?\n?/g,
                ""
            )

            // `code`
            .replace(
                /`([^`]+)`/g,
                "$1"
            )

            // ---
            .replace(
                /^[-_=]{3,}\s*$/gm,
                ""
            )

            // Space cuối dòng
            .replace(
                /[ \t]+$/gm,
                ""
            )

            // Dòng trống thừa
            .replace(
                /\n{3,}/g,
                "\n\n"
            )

            .trim();

    return cleaned;
};


module.exports = { normalizeText, cleanSummaryText };

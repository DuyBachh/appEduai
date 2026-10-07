const SUMMARY_CONFIG = {
    short: {
        label: "ngắn",

        guidance:
            "Tóm tắt rất ngắn gọn. Giữ các ý quan trọng nhất, ưu tiên 4 đến 7 ý chính.",
    },

    medium: {
        label: "vừa",

        guidance:
            "Tóm tắt ở mức vừa. Trình bày nội dung chính, khái niệm quan trọng và mối liên hệ cần nhớ.",
    },

    detailed: {
        label: "chi tiết",

        guidance:
            "Tóm tắt chi tiết nhưng không lan man. Giữ các khái niệm, bước, ví dụ và kết luận quan trọng có trong tài liệu.",
    },
};

// ========================================
// FINAL SUMMARY
// ========================================

const getSummaryPrompt = ({
    text,
    type = "medium",
}) => {
    const config =
        SUMMARY_CONFIG[
            type
        ] ||
        SUMMARY_CONFIG.medium;

    return [
        `Hãy tạo bản tóm tắt ${config.label} cho nội dung bên dưới.`,

        config.guidance,

        "Chỉ sử dụng thông tin có trong nội dung nguồn.",

        "Viết bằng tiếng Việt có dấu đầy đủ.",

        "Không chào hỏi, không giới thiệu bản thân.",

        "Không dùng Markdown. Có thể dùng ký tự • để liệt kê.",

        "Nếu nội dung nguồn là các bản tóm tắt từng phần, hãy hợp nhất chúng thành một bản tóm tắt thống nhất, không lặp ý.",

        "",

        "NỘI DUNG NGUỒN:",

        String(
            text || ""
        ).trim(),
    ].join("\n");
};

// ========================================
// CHUNK SUMMARY
// ========================================

const getChunkSummaryPrompt = ({
    text,
    index,
    total,
}) => {
    return [
        `Đây là phần ${index}/${total} của một tài liệu dài.`,

        "Hãy rút ra các thông tin quan trọng của riêng phần này để dùng cho bước tổng hợp cuối cùng.",

        "Giữ tên khái niệm, số liệu, quy trình, điều kiện và kết luận quan trọng nếu có.",

        "Không thêm kiến thức bên ngoài tài liệu.",

        "Viết bằng tiếng Việt có dấu.",

        "Không dùng Markdown. Có thể dùng ký tự • để liệt kê.",

        "Viết cô đọng để giảm kích thước nhưng không bỏ các ý cốt lõi.",

        "",

        "NỘI DUNG PHẦN:",

        String(
            text || ""
        ).trim(),
    ].join("\n");
};

module.exports = {
    getSummaryPrompt,
    getChunkSummaryPrompt,
};
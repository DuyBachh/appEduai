const getSummaryPrompt = ({
    text,
    type = "medium",
}) => {
    const instructions = {
        short:
            "Tóm tắt tài liệu thật ngắn gọn, khoảng 3-5 ý chính.",
        medium:
            "Tóm tắt tài liệu ở mức vừa phải, có tiêu đề và các ý chính rõ ràng.",
        detailed:
            "Tóm tắt tài liệu chi tiết, có cấu trúc, tiêu đề, các ý chính và giải thích ngắn cho từng ý.",
    };

    const selectedInstruction =
        instructions[type] ||
        instructions.medium;

    return `
Bạn là trợ lý học tập trong ứng dụng appEduai.

Yêu cầu:
${selectedInstruction}

Quy tắc:
- Chỉ sử dụng thông tin có trong tài liệu.
- Không tự thêm kiến thức ngoài tài liệu.
- Trả lời bằng tiếng Việt.
- Trình bày dễ đọc cho sinh viên.

Nội dung tài liệu:

${text}
`;
};

module.exports = {
    getSummaryPrompt,
};
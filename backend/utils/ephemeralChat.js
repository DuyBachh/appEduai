const { createServiceError } = require("./serviceError");

const MAX_HISTORY_MESSAGES = 12;
const MAX_TEMP_HISTORY_CHARS = 24000;

const validateEphemeralHistory = (history) => {
    if (!Array.isArray(history) || history.length > MAX_HISTORY_MESSAGES) {
        throw createServiceError("Lịch sử tạm thời không hợp lệ.", 400);
    }

    let totalChars = 0;
    return history.map((message) => {
        if (
            !message ||
            typeof message !== "object" ||
            (message.role !== "user" && message.role !== "assistant") ||
            typeof message.content !== "string"
        ) {
            throw createServiceError("Tin nhắn tạm thời không hợp lệ.", 400);
        }

        const content = message.content.trim();
        totalChars += content.length;
        if (!content || content.length > 4000 || totalChars > MAX_TEMP_HISTORY_CHARS) {
            throw createServiceError("Lịch sử tạm thời quá dài hoặc rỗng.", 400);
        }

        // Only accept role/content; IDs or user details are never trusted.
        return { role: message.role, content };
    });
};

module.exports = { MAX_HISTORY_MESSAGES, validateEphemeralHistory };

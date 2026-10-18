export function getChatDocumentId(document) {
    return document?._id || document?.id || null;
}

export function getChatDocumentName(document) {
    return (
        document?.name ||
        document?.originalName ||
        document?.fileName ||
        "Tài liệu không tên"
    );
}

export function getConversationId(conversation) {
    const id =
        conversation?._id ||
        conversation?.id;

    return id ? String(id) : null;
}

export function formatConversationDate(value) {
    if (!value) {
        return "Không rõ thời gian";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Không rõ thời gian";
    }

    return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * Display legacy Gemini replies without visible Markdown markers.
 * User messages stay unchanged. New AI replies are also cleaned by Backend.
 */
export function formatAssistantMessage(value) {
    return String(value || "")
        .replace(/\r\n/g, "\n")
        .replace(/^[ \t]*`{3,}[^\n]*$/gm, "")
        .replace(/^[ \t]*(?:[-_*][ \t]*){3,}$/gm, "")
        .replace(/^[ \t]*#{1,6}[ \t]+/gm, "")
        .replace(/^[ \t]*[-*+][ \t]+/gm, "• ")
        .replace(/\*\*\*([^*\n]+)\*\*\*/g, "$1")
        .replace(/\*\*([^*\n]+)\*\*/g, "$1")
        .replace(/__([^_\n]+)__/g, "$1")
        .replace(/(^|[\s([{])\*([^\s*\n](?:[^*\n]*?[^\s*\n])?)\*(?=$|[\s)\]},.!?:;])/gm, "$1$2")
        .replace(/(^|[\s([{])_([^\s_\n](?:[^_\n]*?[^\s_\n])?)_(?=$|[\s)\]},.!?:;])/gm, "$1$2")
        .replace(/`([^`\n]+)`/g, "$1")
        .replace(/[ \t]+$/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

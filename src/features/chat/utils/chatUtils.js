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

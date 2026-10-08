export function getDocumentId(document) {
    return document?.id || document?._id || null;
}

export function getDocumentName(document) {
    return (
        document?.name ||
        document?.originalName ||
        document?.fileName ||
        "Tài liệu"
    );
}

export function getDocumentsFromResponse(result) {
    if (Array.isArray(result?.data)) {
        return result.data;
    }

    if (Array.isArray(result?.data?.documents)) {
        return result.data.documents;
    }

    return [];
}

export function formatFileSize(size) {
    const number = Number(size);

    if (!number || Number.isNaN(number)) {
        return "Không xác định";
    }

    if (number < 1024) {
        return `${number} B`;
    }

    if (number < 1024 * 1024) {
        return `${(number / 1024).toFixed(1)} KB`;
    }

    return `${(
        number /
        (1024 * 1024)
    ).toFixed(1)} MB`;
}

export function formatDate(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("vi-VN");
}

export function getFileType(document) {
    const name = getDocumentName(document);
    const extension = name
        .split(".")
        .pop()
        ?.toUpperCase();

    return (
        extension ||
        document?.fileType ||
        "FILE"
    );
}

export function getDocumentMimeType(file) {
    if (file?.mimeType) {
        return file.mimeType;
    }

    const extension = file?.name
        ?.split(".")
        .pop()
        ?.toLowerCase();

    switch (extension) {
        case "pdf":
            return "application/pdf";
        case "docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        case "txt":
            return "text/plain";
        default:
            return "application/octet-stream";
    }
}

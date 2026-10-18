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
    // File type is stored separately from the editable display name.
    // A rename without ".pdf"/".docx"/".txt" must not turn the label
    // into the entire (uppercased) document title.
    const storedType = String(document?.fileType || "")
        .trim()
        .replace(/^\./, "")
        .toUpperCase();

    if (["PDF", "DOCX", "TXT"].includes(storedType)) {
        return storedType;
    }

    const name = getDocumentName(document);
    const match = name.match(/\.([^.]+)$/);

    return match ? match[1].toUpperCase() : "FILE";
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

/**
 * Group uploaded documents by their manually assigned subject and topic.
 * Grouping is presentation-only: no new database collections are required.
 */
const cleanClassification = (value) =>
    typeof value === "string" ? value.trim() : "";

export function getDocumentSubjects(documents) {
    const subjects = new Map();

    for (const document of documents) {
        const subject = cleanClassification(document?.subject);
        if (subject) {
            const key = subject.toLocaleLowerCase("vi");
            if (!subjects.has(key)) {
                subjects.set(key, subject);
            }
        }
    }

    return [...subjects.values()].sort((a, b) =>
        a.localeCompare(b, "vi", { sensitivity: "base" })
    );
}

export function groupDocumentsByClassification(documents) {
    const groups = new Map();

    for (const document of documents) {
        const subject = cleanClassification(document?.subject);
        const topic = cleanClassification(document?.topic);
        const key = [
            subject.toLocaleLowerCase("vi"),
            topic.toLocaleLowerCase("vi"),
        ].join("\u0000");

        if (!groups.has(key)) {
            groups.set(key, {
                key,
                subject: subject || "Chưa phân loại",
                topic: topic || "Chưa có chủ đề",
                subjectMissing: !subject,
                topicMissing: !topic,
                data: [],
            });
        }

        groups.get(key).data.push(document);
    }

    return [...groups.values()]
        .sort((a, b) => {
            if (a.subjectMissing !== b.subjectMissing) {
                return a.subjectMissing ? 1 : -1;
            }
            const subjectOrder = a.subject.localeCompare(
                b.subject, "vi", { sensitivity: "base" }
            );
            if (subjectOrder !== 0) {
                return subjectOrder;
            }
            if (a.topicMissing !== b.topicMissing) {
                return a.topicMissing ? 1 : -1;
            }
            return a.topic.localeCompare(
                b.topic, "vi", { sensitivity: "base" }
            );
        })
        .map((group) => ({
            ...group,
            data: group.data.sort((a, b) =>
                (new Date(b?.createdAt || 0).getTime() || 0) -
                (new Date(a?.createdAt || 0).getTime() || 0)
            ),
        }));
}

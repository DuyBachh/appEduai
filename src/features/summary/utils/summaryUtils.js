export const SUMMARY_TYPES = [
    {
        value: "short",
        label: "Ngắn",
    },
    {
        value: "medium",
        label: "Vừa",
    },
    {
        value: "detailed",
        label: "Chi tiết",
    },
];

export function getSummaryTypeLabel(type) {
    return (
        SUMMARY_TYPES.find(
            (item) => item.value === type
        )?.label ||
        "Không xác định"
    );
}

export function formatSummaryDate(
    value
) {
    if (!value) {
        return "Không rõ thời gian";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Không rõ thời gian";
    }

    return date.toLocaleString("vi-VN");
}

export function getSummaryDocumentName(
    document
) {
    return (
        document?.name ||
        document?.originalName ||
        document?.fileName ||
        "Tài liệu"
    );
}

export function getSummaryDocumentId(
    document
) {
    return (
        document?._id ||
        document?.id ||
        null
    );
}

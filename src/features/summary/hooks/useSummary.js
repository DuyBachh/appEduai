import {
    useMemo,
    useState,
} from "react";

import SummaryService from "../services/summaryService";
import {
    getSummaryDocumentId,
    getSummaryDocumentName,
    getSummaryTypeLabel,
} from "../utils/summaryUtils";

export default function useSummary(
    document
) {
    const documentId =
        getSummaryDocumentId(
            document
        );

    const documentName =
        getSummaryDocumentName(
            document
        );

    const [
        summaryLength,
        setSummaryLength,
    ] = useState("medium");

    const [summary, setSummary] =
        useState("");

    const [
        summaryRecord,
        setSummaryRecord,
    ] = useState(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    const [error, setError] =
        useState("");

    const typeLabel =
        useMemo(
            () =>
                getSummaryTypeLabel(
                    summaryLength
                ),
            [summaryLength]
        );

    const createSummary =
        async () => {
            if (!documentId) {
                setError(
                    "Không tìm thấy Document ID."
                );
                return;
            }

            if (isLoading) {
                return;
            }

            try {
                setIsLoading(true);
                setError("");

                const result =
                    await SummaryService.createSummary(
                        documentId,
                        summaryLength
                    );

                setSummary(
                    result.content
                );
                setSummaryRecord(
                    result
                );
            } catch (requestError) {
                setError(
                    requestError.message ||
                        "Không thể tạo bản tóm tắt. Vui lòng thử lại."
                );
            } finally {
                setIsLoading(false);
            }
        };

    const changeType = (value) => {
        if (isLoading) {
            return;
        }

        setSummaryLength(value);
        setSummary("");
        setSummaryRecord(null);
        setError("");
    };

    return {
        documentId,
        documentName,
        summaryLength,
        summary,
        summaryRecord,
        isLoading,
        error,
        typeLabel,
        createSummary,
        changeType,
    };
}

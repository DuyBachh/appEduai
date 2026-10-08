import {
    useCallback,
    useState,
} from "react";

import {
    useFocusEffect,
} from "@react-navigation/native";

import SummaryService from "../services/summaryService";

export default function useSummaryDetail(
    summaryId
) {
    const [summary, setSummary] =
        useState(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [error, setError] =
        useState("");

    const loadSummary =
        useCallback(async () => {
            if (!summaryId) {
                setError(
                    "Không tìm thấy Summary ID."
                );
                setSummary(null);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError("");

                const data =
                    await SummaryService.getSummaryById(
                        summaryId
                    );

                setSummary(data);
            } catch (requestError) {
                setError(
                    requestError.message ||
                        "Không thể tải chi tiết tóm tắt."
                );
                setSummary(null);
            } finally {
                setIsLoading(false);
            }
        }, [summaryId]);

    useFocusEffect(
        useCallback(() => {
            loadSummary();

            return undefined;
        }, [loadSummary])
    );

    return {
        summary,
        isLoading,
        error,
        loadSummary,
    };
}

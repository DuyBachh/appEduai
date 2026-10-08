import {
    useCallback,
    useState,
} from "react";

import { Alert } from "react-native";
import {
    useFocusEffect,
} from "@react-navigation/native";

import SummaryService from "../services/summaryService";

export default function useSummaryHistory(
    documentId
) {
    const [history, setHistory] =
        useState([]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [error, setError] =
        useState("");

    const loadHistory =
        useCallback(
            async (
                showLoading = true
            ) => {
                if (!documentId) {
                    setHistory([]);
                    setError(
                        "Không tìm thấy Document ID."
                    );
                    setIsLoading(false);
                    return;
                }

                try {
                    if (showLoading) {
                        setIsLoading(true);
                    }

                    setError("");

                    const list =
                        await SummaryService.getHistory(
                            documentId
                        );

                    setHistory(list);
                } catch (requestError) {
                    setError(
                        requestError.message ||
                            "Không thể tải lịch sử tóm tắt."
                    );
                    setHistory([]);
                } finally {
                    if (showLoading) {
                        setIsLoading(false);
                    }

                    setRefreshing(false);
                }
            },
            [documentId]
        );

    useFocusEffect(
        useCallback(() => {
            loadHistory();

            return undefined;
        }, [loadHistory])
    );

    const refresh = async () => {
        setRefreshing(true);
        await loadHistory(false);
    };

    const deleteSummary = (
        summaryId
    ) => {
        Alert.alert(
            "Xóa bản tóm tắt",
            "Bạn có chắc muốn xóa bản tóm tắt này?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await SummaryService.deleteSummary(
                                summaryId
                            );

                            setHistory(
                                (current) =>
                                    current.filter(
                                        (item) =>
                                            item._id !==
                                            summaryId
                                    )
                            );
                        } catch (
                            requestError
                        ) {
                            Alert.alert(
                                "Lỗi",
                                requestError.message ||
                                    "Không thể xóa bản tóm tắt."
                            );
                        }
                    },
                },
            ]
        );
    };

    return {
        history,
        isLoading,
        refreshing,
        error,
        loadHistory,
        refresh,
        deleteSummary,
    };
}

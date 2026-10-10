import {
    useCallback,
    useState,
} from "react";

import { Alert } from "react-native";
import {
    useFocusEffect,
} from "@react-navigation/native";

import ChatService from "../services/chatService";
import {
    getConversationId,
} from "../utils/chatUtils";

export default function useChatHistory(
    documentId
) {
    const [
        conversations,
        setConversations,
    ] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadHistory =
        useCallback(async () => {
            if (!documentId) {
                setConversations([]);
                setError(
                    "Không tìm thấy Document ID."
                );
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data =
                    await ChatService.getConversations(
                        documentId
                    );

                setConversations(data);
            } catch (requestError) {
                setConversations([]);
                setError(
                    requestError.message ||
                        "Không thể tải lịch sử trò chuyện."
                );
            } finally {
                setLoading(false);
            }
        }, [documentId]);

    useFocusEffect(
        useCallback(() => {
            loadHistory();

            return undefined;
        }, [loadHistory])
    );

    const removeConversation =
        async (conversationId) => {
            try {
                await ChatService.deleteConversation(
                    conversationId
                );

                setConversations(
                    (current) =>
                        current.filter(
                            (item) =>
                                getConversationId(
                                    item
                                ) !==
                                String(
                                    conversationId
                                )
                        )
                );
            } catch (requestError) {
                Alert.alert(
                    "Lỗi",
                    requestError.message ||
                        "Không thể xóa cuộc trò chuyện."
                );
            }
        };

    const confirmDelete = (
        conversationId
    ) => {
        Alert.alert(
            "Xóa cuộc trò chuyện",
            "Bạn có chắc muốn xóa cuộc trò chuyện này?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: () =>
                        removeConversation(
                            conversationId
                        ),
                },
            ]
        );
    };

    return {
        conversations,
        loading,
        error,
        loadHistory,
        confirmDelete,
    };
}

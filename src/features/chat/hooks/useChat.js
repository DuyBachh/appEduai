import {
    useEffect,
    useState,
} from "react";

import ChatService from "../services/chatService";

export default function useChat({
    documentId,
    routeConversationId,
}) {
    const [
        activeConversationId,
        setActiveConversationId,
    ] = useState(
        routeConversationId
    );

    // Preserve the existing behavior until the user opts out.
    const [saveHistory, setSaveHistory] = useState(true);

    const [message, setMessage] =
        useState("");

    const [messages, setMessages] =
        useState([]);

    const [
        loadingMessages,
        setLoadingMessages,
    ] = useState(
        Boolean(routeConversationId)
    );

    const [sending, setSending] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        let mounted = true;

        const loadConversation =
            async () => {
                setMessage("");
                setError("");
                setActiveConversationId(
                    routeConversationId
                );

                if (!routeConversationId) {
                    setMessages([]);
                    setLoadingMessages(false);
                    return;
                }

                try {
                    setLoadingMessages(true);

                    const loadedMessages =
                        await ChatService.getMessages(
                            routeConversationId
                        );

                    if (mounted) {
                        setMessages(
                            loadedMessages
                        );
                    }
                } catch (requestError) {
                    if (!mounted) {
                        return;
                    }

                    setMessages([]);
                    setError(
                        requestError.message ||
                            "Không thể tải cuộc trò chuyện."
                    );
                } finally {
                    if (mounted) {
                        setLoadingMessages(
                            false
                        );
                    }
                }
            };

        loadConversation();

        return () => {
            mounted = false;
        };
    }, [
        routeConversationId,
        documentId,
    ]);

    const changeMessage = (value) => {
        setMessage(value);

        if (error) {
            setError("");
        }
    };

    const sendMessage = async () => {
        const question =
            message.trim();

        if (!question || sending) {
            return;
        }

        if (!documentId) {
            setError(
                "Không tìm thấy Document ID."
            );
            return;
        }

        const tempId =
            `temp-${Date.now()}`;

        // Send recent local messages as context only in non-saving mode.
        const ephemeralHistory = !saveHistory
            ? messages
                  .filter(
                      (item) =>
                          !item.pending &&
                          (item.role === "user" || item.role === "assistant")
                  )
                  .slice(-12)
                  .map((item) => ({
                      role: item.role,
                      content: String(item.content || ""),
                  }))
            : [];

        const temporaryMessage = {
            _id: tempId,
            role: "user",
            content: question,
            createdAt:
                new Date().toISOString(),
            pending: true,
        };

        setMessages((current) => [
            ...current,
            temporaryMessage,
        ]);

        setMessage("");
        setError("");
        setSending(true);

        try {
            const data =
                await ChatService.sendMessage({
                    documentId,
                    conversationId:
                        activeConversationId,
                    question,
                    saveHistory,
                    ephemeralHistory,
                });

            const newConversationId =
                data.conversationId
                    ? String(
                          data.conversationId
                      )
                    : activeConversationId;

            if (saveHistory && newConversationId) {
                setActiveConversationId(
                    newConversationId
                );
            }

            const userMessage =
                data.userMessage || {
                    _id:
                        `${tempId}-user`,
                    role: "user",
                    content: question,
                    createdAt:
                        new Date().toISOString(),
                };

            const assistantMessage =
                data.assistantMessage || {
                    _id:
                        `${tempId}-assistant`,
                    role: "assistant",
                    content:
                        data.answer ||
                        "AI không trả về nội dung.",
                    createdAt:
                        new Date().toISOString(),
                };

            setMessages((current) => {
                const withoutTemp =
                    current.filter(
                        (item) =>
                            item._id !==
                            tempId
                    );

                return [
                    ...withoutTemp,
                    userMessage,
                    assistantMessage,
                ];
            });
        } catch (requestError) {
            setMessages((current) =>
                current.filter(
                    (item) =>
                        item._id !==
                        tempId
                )
            );

            setMessage(question);

            setError(
                requestError.message ||
                    "Không thể nhận câu trả lời từ AI."
            );
        } finally {
            setSending(false);
        }
    };

    const changeSaveHistory = (value) => {
        if (sending || loadingMessages || typeof value !== "boolean") {
            return false;
        }

        if (saveHistory === value) {
            return true;
        }

        setSaveHistory(value);
        setActiveConversationId(null);
        setMessages([]);
        setMessage("");
        setError("");
        return true;
    };

    const startNewChat = () => {
        if (sending) {
            return false;
        }

        setActiveConversationId(null);
        setMessages([]);
        setMessage("");
        setError("");

        return true;
    };

    return {
        activeConversationId,
        saveHistory,
        changeSaveHistory,
        message,
        messages,
        loadingMessages,
        sending,
        error,
        changeMessage,
        sendMessage,
        startNewChat,
    };
}

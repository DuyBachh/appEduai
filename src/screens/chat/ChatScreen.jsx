import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";

import colors from "../../styles/colors";

import {
    apiRequest,
} from "../../services/api";

// ========================================
// DOCUMENT HELPERS
// ========================================

const getDocumentId = (
    document
) => {
    return (
        document?._id ||
        document?.id ||
        null
    );
};

const getDocumentName = (
    document
) => {
    return (
        document?.name ||
        document?.originalName ||
        document?.fileName ||
        "Tài liệu không tên"
    );
};

// ========================================
// CHAT SCREEN
// ========================================

export default function ChatScreen({
    navigation,
    route,
}) {
    const document =
        route.params
            ?.document;

    const routeConversationId =
        route.params
            ?.conversationId ||
        null;

    const documentId =
        getDocumentId(
            document
        );

    const listRef =
        useRef(null);

    const [
        activeConversationId,
        setActiveConversationId,
    ] = useState(
        routeConversationId
    );

    const [
        message,
        setMessage,
    ] = useState("");

    const [
        messages,
        setMessages,
    ] = useState([]);

    const [
        loadingMessages,
        setLoadingMessages,
    ] = useState(
        Boolean(
            routeConversationId
        )
    );

    const [
        sending,
        setSending,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    // ========================================
    // SCROLL END
    // ========================================

    const scrollToBottom =
        () => {
            setTimeout(
                () => {
                    listRef.current?.scrollToEnd(
                        {
                            animated:
                                true,
                        }
                    );
                },
                100
            );
        };

    // ========================================
    // LOAD EXISTING CONVERSATION
    // ========================================

    useEffect(() => {
        let mounted =
            true;

        const loadConversation =
            async () => {
                setMessage(
                    ""
                );

                setError(
                    ""
                );

                setActiveConversationId(
                    routeConversationId
                );

                if (
                    !routeConversationId
                ) {
                    setMessages(
                        []
                    );

                    setLoadingMessages(
                        false
                    );

                    return;
                }

                try {
                    setLoadingMessages(
                        true
                    );

                    const result =
                        await apiRequest(
                            `/chat/conversations/${routeConversationId}/messages`
                        );

                    if (
                        !mounted
                    ) {
                        return;
                    }

                    const loadedMessages =
                        Array.isArray(
                            result?.data
                                ?.messages
                        )
                            ? result.data
                                  .messages
                            : [];

                    setMessages(
                        loadedMessages
                    );
                } catch (
                    requestError
                ) {
                    if (
                        !mounted
                    ) {
                        return;
                    }

                    console.log(
                        "CHAT LOAD ERROR:",
                        requestError.message
                    );

                    setMessages(
                        []
                    );

                    setError(
                        requestError.message ||
                            "Không thể tải cuộc trò chuyện."
                    );
                } finally {
                    if (
                        mounted
                    ) {
                        setLoadingMessages(
                            false
                        );
                    }
                }
            };

        loadConversation();

        return () => {
            mounted =
                false;
        };
    }, [
        routeConversationId,
    ]);

    // ========================================
    // AUTO SCROLL
    // ========================================

    useEffect(() => {
        if (
            messages.length >
                0 ||
            sending
        ) {
            scrollToBottom();
        }
    }, [
        messages,
        sending,
    ]);

    // ========================================
    // SEND MESSAGE
    // ========================================

    const handleSendMessage =
        async () => {
            const trimmedMessage =
                message.trim();

            if (
                !trimmedMessage ||
                sending
            ) {
                return;
            }

            if (
                !documentId
            ) {
                setError(
                    "Không tìm thấy Document ID."
                );

                return;
            }

            const tempId =
                `temp-${Date.now()}`;

            const tempUserMessage =
                {
                    _id:
                        tempId,

                    role:
                        "user",

                    content:
                        trimmedMessage,

                    createdAt:
                        new Date().toISOString(),

                    pending:
                        true,
                };

            setMessages(
                (
                    previous
                ) => [
                    ...previous,

                    tempUserMessage,
                ]
            );

            setMessage(
                ""
            );

            setError(
                ""
            );

            setSending(
                true
            );

            try {
                const result =
                    await apiRequest(
                        "/chat",
                        {
                            method:
                                "POST",

                            body:
                                JSON.stringify(
                                    {
                                        documentId,

                                        conversationId:
                                            activeConversationId,

                                        question:
                                            trimmedMessage,
                                    }
                                ),
                        }
                    );

                const data =
                    result?.data;

                if (
                    !data
                ) {
                    throw new Error(
                        "Backend không trả về dữ liệu chat."
                    );
                }

                const newConversationId =
                    data.conversationId
                        ? String(
                              data.conversationId
                          )
                        : activeConversationId;

                if (
                    newConversationId
                ) {
                    setActiveConversationId(
                        newConversationId
                    );
                }

                const userMessage =
                    data.userMessage || {
                        _id:
                            `${tempId}-user`,

                        role:
                            "user",

                        content:
                            trimmedMessage,

                        createdAt:
                            new Date().toISOString(),
                    };

                const assistantMessage =
                    data.assistantMessage ||
                    {
                        _id:
                            `${tempId}-assistant`,

                        role:
                            "assistant",

                        content:
                            data.answer ||
                            "AI không trả về nội dung.",

                        createdAt:
                            new Date().toISOString(),
                    };

                setMessages(
                    (
                        previous
                    ) => {
                        const withoutTemp =
                            previous.filter(
                                (
                                    item
                                ) =>
                                    item._id !==
                                    tempId
                            );

                        return [
                            ...withoutTemp,

                            userMessage,

                            assistantMessage,
                        ];
                    }
                );

                console.log(
                    "CHAT SUCCESS:",
                    newConversationId
                );
            } catch (
                requestError
            ) {
                console.log(
                    "CHAT ERROR:",
                    requestError.message
                );

                // Xóa message local
                // vì backend chưa lưu.
                setMessages(
                    (
                        previous
                    ) =>
                        previous.filter(
                            (
                                item
                            ) =>
                                item._id !==
                                tempId
                        )
                );

                // Trả câu hỏi lại input
                // để người dùng bấm gửi lại.
                setMessage(
                    trimmedMessage
                );

                setError(
                    requestError.message ||
                        "Không thể nhận câu trả lời từ AI."
                );
            } finally {
                setSending(
                    false
                );
            }
        };

    // ========================================
    // NEW CHAT
    // ========================================

    const handleNewChat =
        () => {
            if (
                sending
            ) {
                return;
            }

            setActiveConversationId(
                null
            );

            setMessages(
                []
            );

            setMessage(
                ""
            );

            setError(
                ""
            );

            navigation.setParams({
                conversationId:
                    undefined,
            });
        };

    // ========================================
    // HISTORY
    // ========================================

    const handleHistory =
        () => {
            navigation.navigate(
                "ChatHistory",
                {
                    document,
                }
            );
        };

    // ========================================
    // RENDER MESSAGE
    // ========================================

    const renderMessage = ({
        item,
    }) => {
        const isUser =
            item.role ===
            "user";

        return (
            <View
                style={[
                    styles.messageRow,

                    isUser
                        ? styles.userRow
                        : styles.aiRow,
                ]}
            >
                <View
                    style={[
                        styles.messageBubble,

                        isUser
                            ? styles.userBubble
                            : styles.aiBubble,
                    ]}
                >
                    {!isUser ? (
                        <Text
                            style={
                                styles.aiLabel
                            }
                        >
                            AI
                        </Text>
                    ) : null}

                    <Text
                        selectable={
                            !isUser
                        }
                        style={[
                            styles.messageText,

                            isUser
                                ? styles.userText
                                : styles.aiText,
                        ]}
                    >
                        {item.content}
                    </Text>

                    {item.pending ? (
                        <Text
                            style={
                                styles.pendingText
                            }
                        >
                            Đang gửi...
                        </Text>
                    ) : null}
                </View>
            </View>
        );
    };

    // ========================================
    // UI
    // ========================================

    return (
        <KeyboardAvoidingView
            style={
                styles.container
            }
            behavior={
                Platform.OS ===
                "ios"
                    ? "padding"
                    : undefined
            }
        >
            {/* HEADER */}

            <View
                style={
                    styles.header
                }
            >
                <TouchableOpacity
                    style={
                        styles.headerButton
                    }
                    onPress={() =>
                        navigation.goBack()
                    }
                >
                    <Text
                        style={
                            styles.backText
                        }
                    >
                        ‹
                    </Text>
                </TouchableOpacity>

                <View
                    style={
                        styles.headerCenter
                    }
                >
                    <Text
                        style={
                            styles.headerTitle
                        }
                    >
                        AI Q&A
                    </Text>

                    <Text
                        style={
                            styles.documentName
                        }
                        numberOfLines={
                            1
                        }
                    >
                        {getDocumentName(
                            document
                        )}
                    </Text>
                </View>

                <View
                    style={
                        styles.headerActions
                    }
                >
                    <TouchableOpacity
                        style={
                            styles.historyButton
                        }
                        onPress={
                            handleHistory
                        }
                    >
                        <Text
                            style={
                                styles.historyText
                            }
                        >
                            ☰
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.newChatButton
                        }
                        onPress={
                            handleNewChat
                        }
                        disabled={
                            sending
                        }
                    >
                        <Text
                            style={
                                styles.newChatText
                            }
                        >
                            +
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* LOADING HISTORY */}

            {loadingMessages ? (
                <View
                    style={
                        styles.centerContainer
                    }
                >
                    <ActivityIndicator
                        size="large"
                        color={
                            colors.primary
                        }
                    />

                    <Text
                        style={
                            styles.loadingText
                        }
                    >
                        Đang tải cuộc trò chuyện...
                    </Text>
                </View>
            ) : (
                <FlatList
                    ref={
                        listRef
                    }
                    data={
                        messages
                    }
                    keyExtractor={(
                        item,
                        index
                    ) =>
                        String(
                            item._id ||
                                item.id ||
                                index
                        )
                    }
                    renderItem={
                        renderMessage
                    }
                    contentContainerStyle={
                        messages.length ===
                        0
                            ? styles.emptyList
                            : styles.messageList
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={
                        <View
                            style={
                                styles.emptyContainer
                            }
                        >
                            <Text
                                style={
                                    styles.emptyIcon
                                }
                            >
                                🤖
                            </Text>

                            <Text
                                style={
                                    styles.emptyTitle
                                }
                            >
                                Hỏi AI về tài liệu
                            </Text>

                            <Text
                                style={
                                    styles.emptyDescription
                                }
                            >
                                Đặt câu hỏi về nội dung tài liệu. AI sẽ ghi nhớ ngữ cảnh của cuộc trò chuyện để xử lý các câu hỏi tiếp theo.
                            </Text>
                        </View>
                    }
                    ListFooterComponent={
                        <>
                            {sending ? (
                                <View
                                    style={
                                        styles.aiRow
                                    }
                                >
                                    <View
                                        style={
                                            styles.loadingBubble
                                        }
                                    >
                                        <ActivityIndicator
                                            size="small"
                                            color={
                                                colors.primary
                                            }
                                        />

                                        <Text
                                            style={
                                                styles.aiThinkingText
                                            }
                                        >
                                            AI đang suy nghĩ...
                                        </Text>
                                    </View>
                                </View>
                            ) : null}

                            {error ? (
                                <View
                                    style={
                                        styles.errorContainer
                                    }
                                >
                                    <Text
                                        style={
                                            styles.errorText
                                        }
                                    >
                                        {
                                            error
                                        }
                                    </Text>
                                </View>
                            ) : null}
                        </>
                    }
                />
            )}

            {/* INPUT */}

            <View
                style={
                    styles.inputContainer
                }
            >
                <TextInput
                    style={
                        styles.input
                    }
                    value={
                        message
                    }
                    onChangeText={(
                        value
                    ) => {
                        setMessage(
                            value
                        );

                        if (
                            error
                        ) {
                            setError(
                                ""
                            );
                        }
                    }}
                    placeholder="Đặt câu hỏi cho AI..."
                    placeholderTextColor={
                        colors.gray
                    }
                    multiline
                    maxLength={
                        3000
                    }
                    editable={
                        !sending &&
                        !loadingMessages
                    }
                />

                <TouchableOpacity
                    style={[
                        styles.sendButton,

                        (!message.trim() ||
                            sending ||
                            loadingMessages) &&
                            styles.sendButtonDisabled,
                    ]}
                    onPress={
                        handleSendMessage
                    }
                    disabled={
                        !message.trim() ||
                        sending ||
                        loadingMessages
                    }
                    activeOpacity={
                        0.8
                    }
                >
                    {sending ? (
                        <ActivityIndicator
                            size="small"
                            color={
                                colors.white
                            }
                        />
                    ) : (
                        <Text
                            style={
                                styles.sendButtonText
                            }
                        >
                            ➤
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

// ========================================
// STYLES
// ========================================

const styles =
    StyleSheet.create({
        container: {
            flex: 1,

            backgroundColor:
                colors.background,
        },

        header: {
            height: 100,

            paddingTop: 45,

            paddingHorizontal:
                12,

            backgroundColor:
                colors.white,

            borderBottomWidth:
                1,

            borderBottomColor:
                colors.border,

            flexDirection:
                "row",

            alignItems:
                "center",
        },

        headerButton: {
            width: 40,

            height: 40,

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        backText: {
            fontSize: 36,

            lineHeight: 40,

            color:
                colors.text,
        },

        headerCenter: {
            flex: 1,

            paddingHorizontal:
                8,
        },

        headerTitle: {
            fontSize: 18,

            fontWeight:
                "700",

            color:
                colors.text,
        },

        documentName: {
            marginTop: 2,

            fontSize: 12,

            color:
                colors.gray,
        },

        headerActions: {
            flexDirection:
                "row",

            alignItems:
                "center",
        },

        historyButton: {
            width: 38,

            height: 38,

            borderRadius:
                19,

            alignItems:
                "center",

            justifyContent:
                "center",

            marginRight:
                4,
        },

        historyText: {
            fontSize: 22,

            color:
                colors.text,
        },

        newChatButton: {
            width: 40,

            height: 40,

            borderRadius:
                20,

            backgroundColor:
                colors.primary,

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        newChatText: {
            fontSize: 26,

            lineHeight: 28,

            color:
                colors.white,
        },

        messageList: {
            paddingHorizontal:
                16,

            paddingTop: 16,

            paddingBottom:
                20,
        },

        emptyList: {
            flexGrow: 1,

            padding: 24,

            justifyContent:
                "center",
        },

        messageRow: {
            width:
                "100%",

            marginBottom:
                12,
        },

        userRow: {
            alignItems:
                "flex-end",
        },

        aiRow: {
            alignItems:
                "flex-start",
        },

        messageBubble: {
            maxWidth:
                "84%",

            borderRadius:
                16,

            paddingHorizontal:
                15,

            paddingVertical:
                11,
        },

        userBubble: {
            backgroundColor:
                colors.primary,

            borderBottomRightRadius:
                4,
        },

        aiBubble: {
            backgroundColor:
                colors.white,

            borderWidth:
                1,

            borderColor:
                colors.border,

            borderBottomLeftRadius:
                4,
        },

        aiLabel: {
            fontSize: 12,

            fontWeight:
                "700",

            color:
                colors.primary,

            marginBottom:
                4,
        },

        messageText: {
            fontSize: 15,

            lineHeight: 22,
        },

        userText: {
            color:
                colors.white,
        },

        aiText: {
            color:
                colors.text,
        },

        pendingText: {
            marginTop: 5,

            fontSize: 10,

            textAlign:
                "right",

            color:
                "#E0E7FF",
        },

        loadingBubble: {
            flexDirection:
                "row",

            alignItems:
                "center",

            backgroundColor:
                colors.white,

            borderWidth:
                1,

            borderColor:
                colors.border,

            borderRadius:
                16,

            borderBottomLeftRadius:
                4,

            paddingHorizontal:
                15,

            paddingVertical:
                12,
        },

        aiThinkingText: {
            marginLeft: 8,

            fontSize: 14,

            color:
                colors.gray,
        },

        errorContainer: {
            marginTop: 4,

            marginBottom:
                12,

            paddingHorizontal:
                14,

            paddingVertical:
                10,

            backgroundColor:
                "#FEF2F2",

            borderRadius:
                10,
        },

        errorText: {
            fontSize: 13,

            lineHeight: 18,

            color:
                colors.error,
        },

        emptyContainer: {
            alignItems:
                "center",

            justifyContent:
                "center",

            paddingHorizontal:
                30,
        },

        emptyIcon: {
            fontSize: 48,

            marginBottom:
                16,
        },

        emptyTitle: {
            fontSize: 20,

            fontWeight:
                "700",

            color:
                colors.text,

            marginBottom:
                8,

            textAlign:
                "center",
        },

        emptyDescription: {
            fontSize: 14,

            lineHeight: 21,

            color:
                colors.gray,

            textAlign:
                "center",
        },

        inputContainer: {
            flexDirection:
                "row",

            alignItems:
                "flex-end",

            paddingHorizontal:
                12,

            paddingVertical:
                10,

            backgroundColor:
                colors.white,

            borderTopWidth:
                1,

            borderTopColor:
                colors.border,
        },

        input: {
            flex: 1,

            minHeight: 46,

            maxHeight: 120,

            backgroundColor:
                colors.background,

            borderWidth:
                1,

            borderColor:
                colors.border,

            borderRadius:
                23,

            paddingHorizontal:
                16,

            paddingVertical:
                11,

            fontSize: 15,

            color:
                colors.text,

            marginRight: 8,
        },

        sendButton: {
            width: 46,

            height: 46,

            borderRadius:
                23,

            backgroundColor:
                colors.primary,

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        sendButtonDisabled: {
            opacity: 0.45,
        },

        sendButtonText: {
            fontSize: 21,

            color:
                colors.white,
        },

        centerContainer: {
            flex: 1,

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        loadingText: {
            marginTop: 12,

            fontSize: 14,

            color:
                colors.gray,
        },
    });
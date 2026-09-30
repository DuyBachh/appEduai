import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../../styles/colors";

const CHAT_HISTORY_KEY = "chat_history";

export default function ChatScreen({
    navigation,
    route,
}) {
    const document = route.params?.document;

    const conversationId =
        route.params?.conversationId || null;

    const initialMessages =
        route.params?.messages || [];

    const [message, setMessage] = useState("");
    const [messages, setMessages] =
        useState(initialMessages);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    /*
     * Load conversation được truyền từ ChatHistoryScreen
     */
    useEffect(() => {
        if (conversationId && initialMessages.length > 0) {
            setMessages(initialMessages);
        } else {
            setMessages([]);
        }

        setMessage("");
        setError("");
        setLoading(false);
    }, [conversationId]);

    /*
     * Tạo câu trả lời mock.
     *
     * Đây vẫn là Frontend mock.
     * Sau này phần này sẽ được thay bằng Chat API.
     */
    const generateMockAnswer = (
        question,
        conversation
    ) => {
        const previousUserMessages =
            conversation.filter(
                (item) =>
                    item.role === "user"
            );

        const lowerQuestion =
            question.toLowerCase();

        if (
            lowerQuestion.includes("ví dụ") &&
            previousUserMessages.length > 0
        ) {
            const previousQuestion =
                previousUserMessages[
                    previousUserMessages.length - 1
                ].content;

            return (
                `Dựa trên câu hỏi trước của bạn "${previousQuestion}", ` +
                `đây là một ví dụ minh họa.\n\n` +
                "Trong phiên bản hiện tại, đây là câu trả lời mô phỏng. " +
                "Khi kết nối AI thật, hệ thống sẽ sử dụng nội dung tài liệu " +
                "để tạo câu trả lời phù hợp."
            );
        }

        if (
            lowerQuestion.includes("giải thích") &&
            previousUserMessages.length > 0
        ) {
            return (
                "Dựa trên nội dung cuộc trò chuyện trước đó, " +
                "AI sẽ tiếp tục giải thích vấn đề mà bạn đang hỏi.\n\n" +
                "Hiện tại đây là câu trả lời mô phỏng. " +
                "Backend AI sẽ xử lý nội dung tài liệu sau."
            );
        }

        return (
            `Bạn đang hỏi: "${question}"\n\n` +
            `Tài liệu hiện tại: ${
                document?.name ||
                "Tài liệu không tên"
            }\n\n` +
            "Đây là câu trả lời mô phỏng của AI. " +
            "Sau khi kết nối Backend, AI sẽ phân tích nội dung " +
            "tài liệu và trả lời câu hỏi dựa trên ngữ cảnh cuộc trò chuyện."
        );
    };

    /*
     * Lưu conversation vào AsyncStorage
     */
    const saveConversation = async (
        conversationMessages,
        currentConversationId = null
    ) => {
        try {
            if (!conversationMessages?.length) {
                return;
            }

            const storedData =
                await AsyncStorage.getItem(
                    CHAT_HISTORY_KEY
                );

            const conversations =
                storedData
                    ? JSON.parse(storedData)
                    : [];

            const userMessages =
                conversationMessages.filter(
                    (item) =>
                        item.role === "user"
                );

            const firstQuestion =
                userMessages[0]?.content ||
                "Cuộc trò chuyện mới";

            const id =
                currentConversationId ||
                Date.now().toString();

            const existingIndex =
                conversations.findIndex(
                    (item) =>
                        item.id === id
                );

            const existingConversation =
                existingIndex !== -1
                    ? conversations[
                          existingIndex
                      ]
                    : null;

            const conversation = {
                id,
                documentId:
                    document?.id || null,

                documentName:
                    document?.name ||
                    "Tài liệu không tên",

                title:
                    existingConversation?.title ||
                    firstQuestion,

                messages:
                    conversationMessages,

                createdAt:
                    existingConversation?.createdAt ||
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString(),
            };

            if (existingIndex !== -1) {
                conversations[
                    existingIndex
                ] = conversation;
            } else {
                conversations.unshift(
                    conversation
                );
            }

            await AsyncStorage.setItem(
                CHAT_HISTORY_KEY,
                JSON.stringify(
                    conversations
                )
            );

            return id;
        } catch (err) {
            console.log(
                "Save chat history error:",
                err
            );
        }
    };

    /*
     * Gửi câu hỏi
     */
    const handleSendMessage = async () => {
        const trimmedMessage =
            message.trim();

        if (!trimmedMessage || loading) {
            return;
        }

        setError("");

        const userMessage = {
            id:
                Date.now().toString(),
            role: "user",
            content: trimmedMessage,
            createdAt:
                new Date().toISOString(),
        };

        const conversationAfterUser = [
            ...messages,
            userMessage,
        ];

        setMessages(
            conversationAfterUser
        );

        setMessage("");
        setLoading(true);

        /*
         * Lưu ngay câu hỏi của user.
         * Nếu app đóng sau đó vẫn có conversation.
         */
        let currentConversationId =
            conversationId;

        currentConversationId =
            await saveConversation(
                conversationAfterUser,
                currentConversationId
            );

        try {
            /*
             * Mock AI delay
             */
            await new Promise(
                (resolve) =>
                    setTimeout(
                        resolve,
                        1200
                    )
            );

            const answer =
                generateMockAnswer(
                    trimmedMessage,
                    conversationAfterUser
                );

            const aiMessage = {
                id:
                    `${Date.now()}-ai`,
                role: "ai",
                content: answer,
                createdAt:
                    new Date().toISOString(),
            };

            const finalMessages = [
                ...conversationAfterUser,
                aiMessage,
            ];

            setMessages(finalMessages);

            /*
             * Lưu lại conversation sau khi AI trả lời.
             */
            await saveConversation(
                finalMessages,
                currentConversationId
            );
        } catch (err) {
            console.log(
                "Send message error:",
                err
            );

            setError(
                "Không thể nhận câu trả lời. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * Tạo cuộc trò chuyện mới
     */
    const handleNewChat = () => {
        if (loading) {
            return;
        }

        navigation.replace("Chat", {
            document: document,
        });
    };

    /*
     * Mở Chat History
     */
    const handleHistory = () => {
        navigation.navigate(
            "ChatHistory",
            {
                document: document,
            }
        );
    };

    /*
     * Render từng message
     */
    const renderMessage = ({
        item,
    }) => {
        const isUser =
            item.role === "user";

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
                    {!isUser && (
                        <Text
                            style={
                                styles.aiLabel
                            }
                        >
                            AI
                        </Text>
                    )}

                    <Text
                        style={[
                            styles.messageText,
                            isUser
                                ? styles.userText
                                : styles.aiText,
                        ]}
                    >
                        {item.content}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
        >
            {/* Header */}
            <View style={styles.header}>
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
                        numberOfLines={1}
                    >
                        {document?.name ||
                            "Tài liệu không tên"}
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

            {/* Messages */}
            <FlatList
                data={messages}
                keyExtractor={(item) =>
                    item.id
                }
                renderItem={
                    renderMessage
                }
                contentContainerStyle={
                    messages.length === 0
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
                            Đặt câu hỏi về nội dung
                            tài liệu và AI sẽ hỗ trợ
                            bạn.
                        </Text>
                    </View>
                }
                ListFooterComponent={
                    <>
                        {loading && (
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
                                    <Text
                                        style={
                                            styles.loadingText
                                        }
                                    >
                                        AI đang suy nghĩ...
                                    </Text>
                                </View>
                            </View>
                        )}

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
                                    {error}
                                </Text>
                            </View>
                        ) : null}
                    </>
                }
            />

            {/* Input */}
            <View
                style={
                    styles.inputContainer
                }
            >
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={
                        setMessage
                    }
                    placeholder="Đặt câu hỏi cho AI..."
                    placeholderTextColor={
                        colors.gray
                    }
                    multiline
                    maxLength={2000}
                    editable={!loading}
                />

                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (!message.trim() ||
                            loading) &&
                            styles.sendButtonDisabled,
                    ]}
                    onPress={
                        handleSendMessage
                    }
                    disabled={
                        !message.trim() ||
                        loading
                    }
                    activeOpacity={0.8}
                >
                    <Text
                        style={
                            styles.sendButtonText
                        }
                    >
                        ➤
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            colors.background,
    },

    header: {
        height: 100,
        paddingTop: 45,
        paddingHorizontal: 12,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor:
            colors.border,
        flexDirection: "row",
        alignItems: "center",
    },

    headerButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    backText: {
        fontSize: 36,
        lineHeight: 40,
        color: colors.text,
    },

    headerCenter: {
        flex: 1,
        paddingHorizontal: 8,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
    },

    documentName: {
        marginTop: 2,
        fontSize: 12,
        color: colors.gray,
    },

    headerActions: {
        flexDirection: "row",
        alignItems: "center",
    },

    historyButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 4,
    },

    historyText: {
        fontSize: 22,
        color: colors.text,
    },

    newChatButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor:
            colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    newChatText: {
        fontSize: 26,
        lineHeight: 28,
        color: colors.white,
        fontWeight: "400",
    },

    messageList: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },

    emptyList: {
        flexGrow: 1,
        padding: 24,
        justifyContent: "center",
    },

    messageRow: {
        width: "100%",
        marginBottom: 12,
    },

    userRow: {
        alignItems: "flex-end",
    },

    aiRow: {
        alignItems: "flex-start",
    },

    messageBubble: {
        maxWidth: "82%",
        borderRadius: 16,
        paddingHorizontal: 15,
        paddingVertical: 11,
    },

    userBubble: {
        backgroundColor:
            colors.primary,
        borderBottomRightRadius: 4,
    },

    aiBubble: {
        backgroundColor:
            colors.white,
        borderWidth: 1,
        borderColor:
            colors.border,
        borderBottomLeftRadius: 4,
    },

    aiLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.primary,
        marginBottom: 4,
    },

    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },

    userText: {
        color: colors.white,
    },

    aiText: {
        color: colors.text,
    },

    loadingBubble: {
        backgroundColor:
            colors.white,
        borderWidth: 1,
        borderColor:
            colors.border,
        borderRadius: 16,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 15,
        paddingVertical: 11,
    },

    loadingText: {
        fontSize: 14,
        color: colors.gray,
    },

    errorContainer: {
        marginTop: 4,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: "#FEF2F2",
        borderRadius: 10,
    },

    errorText: {
        fontSize: 13,
        lineHeight: 18,
        color: colors.error,
    },

    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
    },

    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
        textAlign: "center",
    },

    emptyDescription: {
        fontSize: 14,
        lineHeight: 21,
        color: colors.gray,
        textAlign: "center",
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor:
            colors.white,
        borderTopWidth: 1,
        borderTopColor:
            colors.border,
    },

    input: {
        flex: 1,
        minHeight: 46,
        maxHeight: 110,
        backgroundColor:
            colors.background,
        borderWidth: 1,
        borderColor:
            colors.border,
        borderRadius: 23,
        paddingHorizontal: 16,
        paddingVertical: 11,
        fontSize: 15,
        color: colors.text,
        marginRight: 8,
    },

    sendButton: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor:
            colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    sendButtonDisabled: {
        opacity: 0.45,
    },

    sendButtonText: {
        fontSize: 21,
        color: colors.white,
    },
});
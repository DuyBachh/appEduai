import React, {
    useEffect,
    useRef,
} from "react";

import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";

import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";

import {
    ChatEmptyState,
    ChatErrorState,
    ChatLoadingState,
    ChatThinkingState,
} from "../components/ChatState";

import useChat from "../hooks/useChat";

import {
    getChatDocumentId,
    getChatDocumentName,
} from "../utils/chatUtils";

export default function ChatScreen({
    navigation,
    route,
}) {
    const document =
        route.params?.document;

    const routeConversationId =
        route.params?.conversationId ||
        null;

    const documentId =
        getChatDocumentId(
            document
        );

    const documentName =
        getChatDocumentName(
            document
        );

    const listRef = useRef(null);

    const chat = useChat({
        documentId,
        routeConversationId,
    });

    useEffect(() => {
        if (
            chat.messages.length === 0 &&
            !chat.sending
        ) {
            return;
        }

        const timer = setTimeout(() => {
            listRef.current?.scrollToEnd({
                animated: true,
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [
        chat.messages,
        chat.sending,
    ]);

    const handleSaveHistoryChange = (value) => {
        if (chat.sending || chat.loadingMessages) {
            return;
        }

        const applyChange = () => {
            if (chat.changeSaveHistory(value)) {
                navigation.setParams({ conversationId: undefined });
            }
        };

        // Switching modes starts a fresh conversation. Past saved chats
        // remain in History and are not deleted.
        if (chat.messages.length > 0 || chat.activeConversationId) {
            Alert.alert(
                "Đổi chế độ lưu lịch sử",
                "Chuyển chế độ sẽ bắt đầu hội thoại mới. Các hội thoại đã lưu trước đó vẫn ở Lịch sử.",
                [
                    { text: "Hủy", style: "cancel" },
                    { text: "Tiếp tục", onPress: applyChange },
                ]
            );
        } else {
            applyChange();
        }
    };

    const handleNewChat = () => {
        const changed =
            chat.startNewChat();

        if (!changed) {
            return;
        }

        navigation.setParams({
            conversationId: undefined,
        });
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
            <ChatHeader
                title="AI Q&A"
                subtitle={documentName}
                onBack={() =>
                    navigation.goBack()
                }
                onHistory={() =>
                    navigation.navigate(
                        "ChatHistory",
                        { document }
                    )
                }
                onNewChat={
                    handleNewChat
                }
                newChatDisabled={
                    chat.sending
                }
            />

            <View style={styles.historyPreference}>
                <View style={styles.historyDescription}>
                    <Text style={styles.preferenceTitle}>
                        Lưu lịch sử hội thoại
                    </Text>
                    <Text style={styles.preferenceHint}>
                        {chat.saveHistory
                            ? "Tin nhắn được lưu để xem lại."
                            : "Không lưu vào lịch sử. Tin nhắn sẽ mất khi rời phiên."}
                    </Text>
                </View>
                <Switch
                    value={chat.saveHistory}
                    onValueChange={handleSaveHistoryChange}
                    disabled={chat.sending || chat.loadingMessages}
                    trackColor={{ true: colors.primary, false: colors.border }}
                    accessibilityLabel="Lưu lịch sử hội thoại"
                />
            </View>

            {chat.loadingMessages ? (
                <ChatLoadingState />
            ) : (
                <FlatList
                    ref={listRef}
                    data={chat.messages}
                    keyExtractor={(
                        item,
                        index
                    ) =>
                        String(
                            item?._id ||
                                item?.id ||
                                index
                        )
                    }
                    renderItem={({ item }) => (
                        <MessageBubble
                            message={item}
                        />
                    )}
                    contentContainerStyle={
                        chat.messages.length === 0
                            ? styles.emptyList
                            : styles.messageList
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={
                        <ChatEmptyState />
                    }
                    ListFooterComponent={
                        <>
                            {chat.sending ? (
                                <ChatThinkingState />
                            ) : null}

                            <ChatErrorState
                                message={chat.error}
                            />
                        </>
                    }
                />
            )}

            <ChatInput
                value={chat.message}
                sending={chat.sending}
                disabled={
                    chat.loadingMessages
                }
                onChangeText={
                    chat.changeMessage
                }
                onSend={
                    chat.sendMessage
                }
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            colors.background,
    },
    historyPreference: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    historyDescription: {
        flex: 1,
        paddingRight: 12,
    },
    preferenceTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.text,
    },
    preferenceHint: {
        fontSize: 12,
        marginTop: 4,
        lineHeight: 17,
        color: colors.gray,
    },
    messageList: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
    emptyList: {
        flexGrow: 1,
        padding: 24,
        justifyContent: "center",
    },
});

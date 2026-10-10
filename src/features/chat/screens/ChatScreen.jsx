import React, {
    useEffect,
    useRef,
} from "react";

import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
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

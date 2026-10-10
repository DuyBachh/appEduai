import React from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

import ChatHeader from "../components/ChatHeader";
import ConversationCard from "../components/ConversationCard";

import useChatHistory from "../hooks/useChatHistory";

import {
    getChatDocumentId,
    getChatDocumentName,
    getConversationId,
} from "../utils/chatUtils";

export default function ChatHistoryScreen({
    navigation,
    route,
}) {
    const document =
        route.params?.document;

    const documentId =
        getChatDocumentId(
            document
        );

    const documentName =
        getChatDocumentName(
            document
        );

    const history =
        useChatHistory(
            documentId
        );

    const openConversation = (
        conversation
    ) => {
        const conversationId =
            getConversationId(
                conversation
            );

        if (!conversationId) {
            return;
        }

        navigation.navigate(
            "Chat",
            {
                document,
                conversationId,
            }
        );
    };

    const startNewChat = () => {
        navigation.navigate(
            "Chat",
            {
                document,
                conversationId:
                    undefined,
            }
        );
    };

    return (
        <View style={styles.container}>
            <ChatHeader
                title="Lịch sử AI Q&A"
                subtitle={documentName}
                onBack={() =>
                    navigation.goBack()
                }
                onNewChat={
                    startNewChat
                }
            />

            {history.loading ? (
                <CenterState>
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
                        Đang tải lịch sử...
                    </Text>
                </CenterState>
            ) : history.error ? (
                <CenterState>
                    <Text
                        style={
                            styles.errorText
                        }
                    >
                        {history.error}
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.retryButton
                        }
                        onPress={
                            history.loadHistory
                        }
                    >
                        <Text
                            style={
                                styles.retryText
                            }
                        >
                            Thử lại
                        </Text>
                    </TouchableOpacity>
                </CenterState>
            ) : (
                <FlatList
                    data={
                        history.conversations
                    }
                    keyExtractor={(
                        item,
                        index
                    ) =>
                        getConversationId(
                            item
                        ) ||
                        String(index)
                    }
                    renderItem={({ item }) => (
                        <ConversationCard
                            conversation={
                                item
                            }
                            onOpen={
                                openConversation
                            }
                            onDelete={
                                history.confirmDelete
                            }
                        />
                    )}
                    contentContainerStyle={
                        history.conversations
                            .length === 0
                            ? styles.emptyList
                            : styles.list
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                    ListEmptyComponent={
                        <EmptyHistory
                            onStart={
                                startNewChat
                            }
                        />
                    }
                />
            )}
        </View>
    );
}

function CenterState({ children }) {
    return (
        <View style={styles.center}>
            {children}
        </View>
    );
}

function EmptyHistory({ onStart }) {
    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
                💬
            </Text>

            <Text style={styles.emptyTitle}>
                Chưa có cuộc trò chuyện
            </Text>

            <Text
                style={
                    styles.emptyDescription
                }
            >
                Hãy bắt đầu một cuộc trò chuyện với AI về tài liệu này.
            </Text>

            <TouchableOpacity
                style={styles.startButton}
                onPress={onStart}
            >
                <Text
                    style={
                        styles.startButtonText
                    }
                >
                    Bắt đầu trò chuyện
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            colors.background,
    },
    list: {
        padding: 16,
        paddingBottom: 30,
    },
    emptyList: {
        flexGrow: 1,
        padding: 24,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyIcon: {
        fontSize: 50,
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
        maxWidth: 300,
        marginBottom: 20,
    },
    startButton: {
        backgroundColor:
            colors.primary,
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    startButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "700",
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: colors.gray,
    },
    errorText: {
        fontSize: 14,
        lineHeight: 21,
        textAlign: "center",
        color: colors.error,
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 18,
        paddingVertical: 11,
        borderRadius: 10,
        backgroundColor:
            colors.primary,
    },
    retryText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "700",
    },
});

import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";
import {
    formatConversationDate,
    getConversationId,
} from "../utils/chatUtils";

export default function ConversationCard({
    conversation,
    onOpen,
    onDelete,
}) {
    const id =
        getConversationId(
            conversation
        );

    const messageCount =
        Number(
            conversation?.messageCount ||
                0
        );

    return (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.main}
                activeOpacity={0.8}
                onPress={() =>
                    onOpen(conversation)
                }
            >
                <View style={styles.iconBox}>
                    <Text style={styles.icon}>
                        💬
                    </Text>
                </View>

                <View style={styles.content}>
                    <Text
                        style={styles.title}
                        numberOfLines={2}
                    >
                        {conversation?.title ||
                            "Cuộc trò chuyện"}
                    </Text>

                    <Text style={styles.meta}>
                        {messageCount} tin nhắn
                    </Text>

                    <Text style={styles.date}>
                        {formatConversationDate(
                            conversation?.updatedAt ||
                                conversation?.createdAt
                        )}
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                    id && onDelete(id)
                }
            >
                <Text style={styles.deleteText}>
                    🗑
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    main: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    icon: {
        fontSize: 23,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 5,
    },
    meta: {
        fontSize: 12,
        color: colors.gray,
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
        color: colors.gray,
    },
    deleteButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 4,
    },
    deleteText: {
        fontSize: 18,
    },
});

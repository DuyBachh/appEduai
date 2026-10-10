import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function MessageBubble({
    message,
}) {
    const isUser =
        message?.role === "user";

    return (
        <View
            style={[
                styles.row,
                isUser
                    ? styles.userRow
                    : styles.aiRow,
            ]}
        >
            <View
                style={[
                    styles.bubble,
                    isUser
                        ? styles.userBubble
                        : styles.aiBubble,
                ]}
            >
                {!isUser ? (
                    <Text style={styles.aiLabel}>
                        AI
                    </Text>
                ) : null}

                <Text
                    selectable={!isUser}
                    style={[
                        styles.text,
                        isUser
                            ? styles.userText
                            : styles.aiText,
                    ]}
                >
                    {message?.content}
                </Text>

                {message?.pending ? (
                    <Text
                        style={styles.pendingText}
                    >
                        Đang gửi...
                    </Text>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        width: "100%",
        marginBottom: 12,
    },
    userRow: {
        alignItems: "flex-end",
    },
    aiRow: {
        alignItems: "flex-start",
    },
    bubble: {
        maxWidth: "84%",
        borderRadius: 16,
        paddingHorizontal: 15,
        paddingVertical: 11,
    },
    userBubble: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderBottomLeftRadius: 4,
    },
    aiLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.primary,
        marginBottom: 4,
    },
    text: {
        fontSize: 15,
        lineHeight: 22,
    },
    userText: {
        color: colors.white,
    },
    aiText: {
        color: colors.text,
    },
    pendingText: {
        marginTop: 5,
        fontSize: 10,
        textAlign: "right",
        color: "#E0E7FF",
    },
});

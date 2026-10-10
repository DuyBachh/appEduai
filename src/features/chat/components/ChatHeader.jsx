import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function ChatHeader({
    title,
    subtitle,
    onBack,
    onHistory,
    onNewChat,
    newChatDisabled = false,
}) {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}
            >
                <Text style={styles.backText}>
                    ‹
                </Text>
            </TouchableOpacity>

            <View style={styles.center}>
                <Text style={styles.title}>
                    {title}
                </Text>

                <Text
                    style={styles.subtitle}
                    numberOfLines={1}
                >
                    {subtitle}
                </Text>
            </View>

            <View style={styles.actions}>
                {onHistory ? (
                    <TouchableOpacity
                        style={styles.historyButton}
                        onPress={onHistory}
                    >
                        <Text
                            style={styles.historyText}
                        >
                            ☰
                        </Text>
                    </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                    style={styles.newButton}
                    onPress={onNewChat}
                    disabled={newChatDisabled}
                >
                    <Text style={styles.newText}>
                        +
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 100,
        paddingTop: 45,
        paddingHorizontal: 12,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
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
    center: {
        flex: 1,
        paddingHorizontal: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
    },
    subtitle: {
        marginTop: 2,
        fontSize: 12,
        color: colors.gray,
    },
    actions: {
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
    newButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    newText: {
        fontSize: 26,
        lineHeight: 28,
        color: colors.white,
    },
});

import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import colors from "../../../styles/colors";

export default function SolverFollowUp({
    value,
    messages = [],
    loading,
    disabled,
    error,
    onChangeText,
    onSend,
}) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Hỏi thêm về bài giải</Text>

            {messages.map((message, index) => (
                <View
                    key={index}
                    style={[
                        styles.message,
                        message.role === "user"
                            ? styles.userMessage
                            : styles.aiMessage,
                    ]}
                >
                    <Text style={styles.messageLabel}>
                        {message.role === "user" ? "Bạn" : "AI giải thích"}
                    </Text>
                    <Text selectable style={styles.messageText}>
                        {message.content}
                    </Text>
                </View>
            ))}

            <TextInput
                value={value}
                onChangeText={onChangeText}
                editable={!disabled && !loading}
                multiline
                maxLength={1000}
                placeholder="Nhập câu hỏi về bài giải này..."
                placeholderTextColor={colors.gray}
                style={styles.input}
                accessibilityLabel="Câu hỏi tiếp theo về bài giải"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
                onPress={onSend}
                disabled={disabled || loading || !value.trim()}
                style={[
                    styles.sendButton,
                    (disabled || loading || !value.trim()) && styles.disabled,
                ]}
            >
                {loading ? (
                    <ActivityIndicator color={colors.white} />
                ) : (
                    <Text style={styles.sendText}>Gửi câu hỏi tiếp theo</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 14,
    },
    message: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 9,
    },
    userMessage: { backgroundColor: "#EEF2FF" },
    aiMessage: { backgroundColor: "#F9FAFB" },
    messageLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.primary,
        marginBottom: 5,
    },
    messageText: {
        color: colors.text,
        fontSize: 14,
        lineHeight: 22,
    },
    input: {
        minHeight: 74,
        maxHeight: 150,
        padding: 12,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: colors.background,
        fontSize: 15,
        color: colors.text,
        textAlignVertical: "top",
        marginTop: 5,
    },
    error: {
        color: colors.error,
        fontSize: 13,
        marginTop: 8,
    },
    sendButton: {
        minHeight: 46,
        marginTop: 12,
        backgroundColor: colors.primary,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    sendText: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.white,
    },
    disabled: { opacity: 0.45 },
});

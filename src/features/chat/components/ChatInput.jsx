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

export default function ChatInput({
    value,
    sending,
    disabled,
    onChangeText,
    onSend,
}) {
    const sendDisabled =
        !value.trim() ||
        sending ||
        disabled;

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder="Đặt câu hỏi cho AI..."
                placeholderTextColor={
                    colors.gray
                }
                multiline
                maxLength={3000}
                editable={!sending && !disabled}
            />

            <TouchableOpacity
                style={[
                    styles.sendButton,
                    sendDisabled &&
                        styles.sendButtonDisabled,
                ]}
                onPress={onSend}
                disabled={sendDisabled}
                activeOpacity={0.8}
            >
                {sending ? (
                    <ActivityIndicator
                        size="small"
                        color={colors.white}
                    />
                ) : (
                    <Text
                        style={styles.sendText}
                    >
                        ➤
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    input: {
        flex: 1,
        minHeight: 46,
        maxHeight: 120,
        backgroundColor:
            colors.background,
        borderWidth: 1,
        borderColor: colors.border,
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
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    sendButtonDisabled: {
        opacity: 0.45,
    },
    sendText: {
        fontSize: 21,
        color: colors.white,
    },
});

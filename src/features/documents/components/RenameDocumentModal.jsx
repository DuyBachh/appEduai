import React from "react";
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function RenameDocumentModal({
    visible,
    value,
    loading,
    onChange,
    onClose,
    onSave,
}) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        Đổi tên tài liệu
                    </Text>

                    <Text style={styles.description}>
                        Nhập tên mới cho tài liệu.
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChange}
                        placeholder="Tên tài liệu"
                        placeholderTextColor={
                            colors.gray
                        }
                        editable={!loading}
                        autoFocus
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text
                                style={
                                    styles.cancelText
                                }
                            >
                                Hủy
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                loading &&
                                    styles.disabled,
                            ]}
                            onPress={onSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator
                                    size="small"
                                    color={colors.white}
                                />
                            ) : (
                                <Text
                                    style={
                                        styles.saveText
                                    }
                                >
                                    Lưu
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor:
            "rgba(0, 0, 0, 0.4)",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    container: {
        width: "100%",
        backgroundColor:
            colors.white,
        borderRadius: 14,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },
    description: {
        fontSize: 13,
        lineHeight: 19,
        color: colors.gray,
        marginTop: 5,
        marginBottom: 16,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor:
            colors.primary,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: colors.text,
        backgroundColor:
            colors.white,
    },
    actions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor:
            colors.border,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.text,
    },
    saveButton: {
        flex: 1,
        height: 48,
        backgroundColor:
            colors.primary,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    saveText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.white,
    },
    disabled: {
        opacity: 0.6,
    },
});

import { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";

import colors from "../../styles/colors";

export default function ProfileScreen({ currentUser, onLogout }) {
    const [name, setName] = useState(
        currentUser?.name || "Người dùng"
    );

    const [oldName, setOldName] = useState(
        currentUser?.name || "Người dùng"
    );

    const [isEditing, setIsEditing] = useState(false);

    const email = currentUser?.email || "";

    // Bắt đầu chỉnh sửa tên
    const handleEdit = () => {
        setOldName(name);
        setIsEditing(true);
    };

    // Lưu tên mới
    const handleSave = () => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            Alert.alert("Lỗi", "Tên không được để trống");
            return;
        }

        if (trimmedName.length < 2) {
            Alert.alert(
                "Lỗi",
                "Tên phải có ít nhất 2 ký tự"
            );
            return;
        }

        setName(trimmedName);
        setIsEditing(false);

        Alert.alert(
            "Thành công",
            "Đã cập nhật thông tin"
        );
    };

    // Hủy chỉnh sửa
    const handleCancel = () => {
        setName(oldName);
        setIsEditing(false);
    };

    // Đăng xuất
    const handleLogout = () => {
        Alert.alert(
            "Đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Đăng xuất",
                    style: "destructive",
                    onPress: onLogout,
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Tiêu đề */}
            <Text style={styles.title}>Hồ sơ</Text>

            {/* Avatar */}
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {name.charAt(0).toUpperCase()}
                </Text>
            </View>

            {/* Tên */}
            <View style={styles.section}>
                <Text style={styles.label}>
                    Họ và tên
                </Text>

                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Nhập họ và tên"
                        placeholderTextColor={colors.gray}
                    />
                ) : (
                    <View style={styles.infoBox}>
                        <Text style={styles.value}>
                            {name}
                        </Text>
                    </View>
                )}
            </View>

            {/* Email */}
            <View style={styles.section}>
                <Text style={styles.label}>
                    Email
                </Text>

                <View style={styles.infoBox}>
                    <Text style={styles.value}>
                        {email}
                    </Text>
                </View>

                <Text style={styles.note}>
                    Email không thể chỉnh sửa
                </Text>
            </View>

            {/* Nút chỉnh sửa / lưu / hủy */}
            {!isEditing ? (
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEdit}
                >
                    <Text style={styles.editButtonText}>
                        Chỉnh sửa thông tin
                    </Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.editActions}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancel}
                    >
                        <Text style={styles.cancelButtonText}>
                            Hủy
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                    >
                        <Text style={styles.saveButtonText}>
                            Lưu
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Đăng xuất */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>
                    Đăng xuất
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 30,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: colors.primary,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
    },

    avatarText: {
        fontSize: 36,
        fontWeight: "700",
        color: colors.white,
    },

    section: {
        marginBottom: 20,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 8,
    },

    infoBox: {
        minHeight: 50,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        backgroundColor: colors.white,
        justifyContent: "center",
        paddingHorizontal: 15,
    },

    value: {
        fontSize: 16,
        color: colors.text,
    },

    input: {
        height: 50,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 10,
        backgroundColor: colors.white,
        paddingHorizontal: 15,
        fontSize: 16,
        color: colors.text,
    },

    note: {
        fontSize: 12,
        color: colors.gray,
        marginTop: 6,
    },

    editButton: {
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
    },

    editButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.white,
    },

    editActions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 5,
    },

    cancelButton: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "center",
    },

    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
    },

    saveButton: {
        flex: 1,
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    saveButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.white,
    },

    logoutButton: {
        height: 50,
        borderWidth: 1,
        borderColor: colors.error,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },

    logoutText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.error,
    },
});


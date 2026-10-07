import {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";

import colors from "../../styles/colors";

import {
    apiRequest,
} from "../../services/api";

import {
    removeToken,
} from "../../services/tokenStorage";

export default function ProfileScreen({
    currentUser,
    onLogout,
}) {
    const [name, setName] =
        useState(
            currentUser?.name || ""
        );

    const [email, setEmail] =
        useState(
            currentUser?.email || ""
        );

    const [oldName, setOldName] =
        useState("");

    const [
        isEditing,
        setIsEditing,
    ] = useState(false);

    const [
        profileLoading,
        setProfileLoading,
    ] = useState(true);

    const [
        saveLoading,
        setSaveLoading,
    ] = useState(false);

    const [
        logoutLoading,
        setLogoutLoading,
    ] = useState(false);

    const [
        profileError,
        setProfileError,
    ] = useState("");

    useEffect(() => {
        const loadProfile =
            async () => {
                try {
                    setProfileLoading(true);
                    setProfileError("");

                    const result =
                        await apiRequest(
                            "/auth/me"
                        );

                    const user =
                        result?.data;

                    if (!user) {
                        throw new Error(
                            "Không lấy được thông tin người dùng."
                        );
                    }

                    setName(
                        user.name || ""
                    );

                    setEmail(
                        user.email || ""
                    );

                    console.log(
                        "PROFILE SUCCESS:",
                        user
                    );
                } catch (error) {
                    console.log(
                        "PROFILE ERROR:",
                        error.message
                    );

                    setProfileError(
                        error.message ||
                            "Không thể tải hồ sơ."
                    );
                } finally {
                    setProfileLoading(
                        false
                    );
                }
            };

        loadProfile();
    }, []);

    const handleEdit = () => {
        setOldName(name);
        setIsEditing(true);
    };

    const handleSave =
        async () => {
            const trimmedName =
                name.trim();

            if (!trimmedName) {
                Alert.alert(
                    "Lỗi",
                    "Tên không được để trống"
                );

                return;
            }

            if (
                trimmedName.length <
                2
            ) {
                Alert.alert(
                    "Lỗi",
                    "Tên phải có ít nhất 2 ký tự"
                );

                return;
            }

            try {
                setSaveLoading(true);

                const result =
                    await apiRequest(
                        "/auth/profile",
                        {
                            method:
                                "PUT",

                            body:
                                JSON.stringify(
                                    {
                                        name:
                                            trimmedName,
                                    }
                                ),
                        }
                    );

                const updatedUser =
                    result?.data;

                setName(
                    updatedUser?.name ||
                        trimmedName
                );

                setEmail(
                    updatedUser?.email ||
                        email
                );

                setOldName(
                    updatedUser?.name ||
                        trimmedName
                );

                setIsEditing(false);

                console.log(
                    "UPDATE PROFILE SUCCESS:",
                    updatedUser
                );

                Alert.alert(
                    "Thành công",
                    result.message ||
                        "Đã cập nhật thông tin."
                );
            } catch (error) {
                console.log(
                    "UPDATE PROFILE ERROR:",
                    error.message
                );

                Alert.alert(
                    "Lỗi",
                    error.message ||
                        "Không thể cập nhật thông tin."
                );
            } finally {
                setSaveLoading(false);
            }
        };

    const handleCancel = () => {
        setName(oldName);
        setIsEditing(false);
    };

    const logout = async () => {
        try {
            setLogoutLoading(true);

            const result =
                await apiRequest(
                    "/auth/logout",
                    {
                        method:
                            "POST",
                    }
                );

            console.log(
                "LOGOUT SUCCESS:",
                result
            );
        } catch (error) {
            console.log(
                "LOGOUT API ERROR:",
                error.message
            );
        } finally {
            await removeToken();
            onLogout();

            setLogoutLoading(false);
        }
    };

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
                    style:
                        "destructive",
                    onPress:
                        logout,
                },
            ]
        );
    };

    if (profileLoading) {
        return (
            <View
                style={
                    styles.loadingContainer
                }
            >
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
                    Đang tải hồ sơ...
                </Text>
            </View>
        );
    }

    return (
        <View
            style={
                styles.container
            }
        >
            <Text
                style={styles.title}
            >
                Hồ sơ
            </Text>

            {profileError !== "" && (
                <Text
                    style={
                        styles.errorText
                    }
                >
                    {profileError}
                </Text>
            )}

            <View
                style={styles.avatar}
            >
                <Text
                    style={
                        styles.avatarText
                    }
                >
                    {name
                        ? name
                              .charAt(0)
                              .toUpperCase()
                        : "U"}
                </Text>
            </View>

            <View
                style={
                    styles.section
                }
            >
                <Text
                    style={
                        styles.label
                    }
                >
                    Họ và tên
                </Text>

                {isEditing ? (
                    <TextInput
                        style={
                            styles.input
                        }
                        value={name}
                        onChangeText={
                            setName
                        }
                        placeholder="Nhập họ và tên"
                        placeholderTextColor={
                            colors.gray
                        }
                        editable={
                            !saveLoading
                        }
                    />
                ) : (
                    <View
                        style={
                            styles.infoBox
                        }
                    >
                        <Text
                            style={
                                styles.value
                            }
                        >
                            {name}
                        </Text>
                    </View>
                )}
            </View>

            <View
                style={
                    styles.section
                }
            >
                <Text
                    style={
                        styles.label
                    }
                >
                    Email
                </Text>

                <View
                    style={
                        styles.infoBox
                    }
                >
                    <Text
                        style={
                            styles.value
                        }
                    >
                        {email}
                    </Text>
                </View>

                <Text
                    style={
                        styles.note
                    }
                >
                    Email không thể chỉnh sửa
                </Text>
            </View>

            {!isEditing ? (
                <TouchableOpacity
                    style={
                        styles.editButton
                    }
                    onPress={
                        handleEdit
                    }
                >
                    <Text
                        style={
                            styles.editButtonText
                        }
                    >
                        Chỉnh sửa thông tin
                    </Text>
                </TouchableOpacity>
            ) : (
                <View
                    style={
                        styles.editActions
                    }
                >
                    <TouchableOpacity
                        style={
                            styles.cancelButton
                        }
                        onPress={
                            handleCancel
                        }
                        disabled={
                            saveLoading
                        }
                    >
                        <Text
                            style={
                                styles.cancelButtonText
                            }
                        >
                            Hủy
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.saveButton
                        }
                        onPress={
                            handleSave
                        }
                        disabled={
                            saveLoading
                        }
                    >
                        {saveLoading ? (
                            <ActivityIndicator
                                color={
                                    colors.white
                                }
                            />
                        ) : (
                            <Text
                                style={
                                    styles.saveButtonText
                                }
                            >
                                Lưu
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                style={[
                    styles.logoutButton,

                    logoutLoading &&
                        styles.logoutButtonDisabled,
                ]}
                onPress={
                    handleLogout
                }
                disabled={
                    logoutLoading
                }
            >
                {logoutLoading ? (
                    <ActivityIndicator
                        color={
                            colors.error
                        }
                    />
                ) : (
                    <Text
                        style={
                            styles.logoutText
                        }
                    >
                        Đăng xuất
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            colors.background,
        padding: 20,
    },

    loadingContainer: {
        flex: 1,
        backgroundColor:
            colors.background,
        alignItems: "center",
        justifyContent: "center",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: colors.gray,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 30,
    },

    errorText: {
        fontSize: 14,
        color: colors.error,
        marginBottom: 15,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor:
            colors.primary,
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
        borderColor:
            colors.border,
        borderRadius: 10,
        backgroundColor:
            colors.white,
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
        borderColor:
            colors.primary,
        borderRadius: 10,
        backgroundColor:
            colors.white,
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
        backgroundColor:
            colors.primary,
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
        borderColor:
            colors.border,
        borderRadius: 10,
        backgroundColor:
            colors.white,
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
        backgroundColor:
            colors.primary,
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
        borderColor:
            colors.error,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },

    logoutButtonDisabled: {
        opacity: 0.6,
    },

    logoutText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.error,
    },
});
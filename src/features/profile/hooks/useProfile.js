import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
} from "react-native";

import {
    removeToken,
} from "../../../services/tokenStorage";

import ProfileService from "../services/profileService";

export default function useProfile({
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
        let mounted = true;

        const loadProfile =
            async () => {
                try {
                    setProfileLoading(
                        true
                    );
                    setProfileError("");

                    const user =
                        await ProfileService.getProfile();

                    if (!mounted) {
                        return;
                    }

                    setName(
                        user.name || ""
                    );
                    setEmail(
                        user.email || ""
                    );
                } catch (requestError) {
                    if (!mounted) {
                        return;
                    }

                    setProfileError(
                        requestError.message ||
                            "Không thể tải hồ sơ."
                    );
                } finally {
                    if (mounted) {
                        setProfileLoading(
                            false
                        );
                    }
                }
            };

        loadProfile();

        return () => {
            mounted = false;
        };
    }, []);

    const startEditing = () => {
        setOldName(name);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setName(oldName);
        setIsEditing(false);
    };

    const saveProfile =
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
                trimmedName.length < 2
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
                    await ProfileService.updateProfile(
                        trimmedName
                    );

                const updatedUser =
                    result.user;

                const nextName =
                    updatedUser?.name ||
                    trimmedName;

                setName(nextName);
                setEmail(
                    updatedUser?.email ||
                        email
                );
                setOldName(nextName);
                setIsEditing(false);

                Alert.alert(
                    "Thành công",
                    result.message ||
                        "Đã cập nhật thông tin."
                );
            } catch (requestError) {
                Alert.alert(
                    "Lỗi",
                    requestError.message ||
                        "Không thể cập nhật thông tin."
                );
            } finally {
                setSaveLoading(false);
            }
        };

    const confirmLogout = () => {
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
                    onPress: logout,
                },
            ]
        );
    };

    const logout = async () => {
        try {
            setLogoutLoading(true);

            try {
                await ProfileService.logout();
            } catch {
                // Vẫn xóa token local nếu API logout lỗi.
            }

            await removeToken();

            onLogout?.();
        } finally {
            setLogoutLoading(false);
        }
    };

    return {
        name,
        email,
        isEditing,
        profileLoading,
        saveLoading,
        logoutLoading,
        profileError,

        setName,
        startEditing,
        cancelEditing,
        saveProfile,
        confirmLogout,
    };
}

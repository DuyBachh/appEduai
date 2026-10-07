import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";

const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem(
            TOKEN_KEY,
            token
        );
    } catch (error) {
        throw new Error(
            "Không thể lưu token."
        );
    }
};

const getToken = async () => {
    try {
        return await AsyncStorage.getItem(
            TOKEN_KEY
        );
    } catch (error) {
        throw new Error(
            "Không thể đọc token."
        );
    }
};

const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(
            TOKEN_KEY
        );
    } catch (error) {
        throw new Error(
            "Không thể xóa token."
        );
    }
};

export {
    saveToken,
    getToken,
    removeToken,
};
import * as ImagePicker from "expo-image-picker";

import { normalizeImageAsset } from "../../../utils/imageUtils";

const PICKER_OPTIONS = {
    mediaTypes: ["images"],
    allowsEditing: false,
    quality: 0.9,
};

export default class ImageService {
    static async pickFromLibrary() {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            throw new Error(
                "Ứng dụng cần quyền truy cập thư viện ảnh."
            );
        }

        const result =
            await ImagePicker.launchImageLibraryAsync(
                PICKER_OPTIONS
            );

        if (result.canceled) {
            return null;
        }

        return normalizeImageAsset(
            result.assets?.[0],
            "solver"
        );
    }

    static async takePhoto() {
        const permission =
            await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            throw new Error(
                "Ứng dụng cần quyền camera để chụp ảnh."
            );
        }

        const result =
            await ImagePicker.launchCameraAsync(
                PICKER_OPTIONS
            );

        if (result.canceled) {
            return null;
        }

        return normalizeImageAsset(
            result.assets?.[0],
            "solver-camera"
        );
    }
}

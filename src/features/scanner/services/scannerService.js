import * as ImagePicker from "expo-image-picker";

import {
    File,
    UploadType,
} from "expo-file-system";

import {
    API_BASE_URL,
} from "../../../services/api";

import {
    getToken,
    removeToken,
} from "../../../services/tokenStorage";

import {
    normalizeImageAsset,
} from "../../../utils/imageUtils";

const MAX_IMAGE_SIZE =
    10 * 1024 * 1024;

export default class ScannerService {
    static async pickImage() {
        const permission =
            await ImagePicker
                .requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            throw new Error(
                "Ứng dụng cần quyền truy cập thư viện ảnh."
            );
        }

        const result =
            await ImagePicker
                .launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsEditing: false,
                    quality: 0.9,
                });

        if (result.canceled) {
            return null;
        }

        return normalizeImageAsset(
            result.assets?.[0],
            "image"
        );
    }

    static fromCameraPhoto(photo) {
        return normalizeImageAsset(
            {
                uri: photo?.uri,
                fileName:
                    `camera-${Date.now()}.jpg`,
                mimeType:
                    "image/jpeg",
            },
            "camera"
        );
    }

    static async recognizeText(image) {
        if (!image?.uri) {
            throw new Error(
                "Vui lòng chụp hoặc chọn ảnh trước."
            );
        }

        const token = await getToken();

        if (!token) {
            throw new Error(
                "Bạn chưa đăng nhập."
            );
        }

        const uploadFile =
            new File(image.uri);

        if (!uploadFile.exists) {
            throw new Error(
                "Không tìm thấy file ảnh."
            );
        }

        if (
            uploadFile.size >
            MAX_IMAGE_SIZE
        ) {
            throw new Error(
                "Ảnh không được vượt quá 10 MB."
            );
        }

        const uploadTask =
            uploadFile.createUploadTask(
                `${API_BASE_URL}/ocr`,
                {
                    httpMethod: "POST",
                    uploadType:
                        UploadType.MULTIPART,
                    fieldName: "image",
                    mimeType: image.mimeType,
                    parameters: {
                        originalName:
                            image.name,
                    },
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        const response =
            await uploadTask.uploadAsync();

        let data = {};

        try {
            data = response.body
                ? JSON.parse(response.body)
                : {};
        } catch {
            throw new Error(
                "Server không trả về JSON hợp lệ."
            );
        }

        if (response.status === 401) {
            await removeToken();

            throw new Error(
                data?.message ||
                    "Phiên đăng nhập đã hết hạn."
            );
        }

        if (
            response.status < 200 ||
            response.status >= 300
        ) {
            throw new Error(
                data?.message ||
                    `OCR thất bại (${response.status}).`
            );
        }

        const extractedText =
            data?.data?.extractedText;

        if (
            !extractedText ||
            !String(
                extractedText
            ).trim()
        ) {
            throw new Error(
                "Backend không trả về văn bản OCR."
            );
        }

        return String(
            extractedText
        ).trim();
    }
}

import {
    File,
    UploadType,
} from "expo-file-system";

import {
    API_BASE_URL,
    apiRequest,
} from "../../../services/api";

import {
    getToken,
    removeToken,
} from "../../../services/tokenStorage";

import SolverResult from "../models/SolverResult";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export default class SolverService {
    static async solve(question) {
        const normalizedQuestion =
            String(question || "").trim();

        if (!normalizedQuestion) {
            throw new Error(
                "Vui lòng nhập câu hỏi hoặc OCR ảnh bài toán trước."
            );
        }

        const response = await apiRequest("/solver", {
            method: "POST",
            body: JSON.stringify({
                question: normalizedQuestion,
            }),
        });

        if (!response?.data) {
            throw new Error(
                "Backend không trả về kết quả."
            );
        }

        return SolverResult.fromApi(
            response.data,
            normalizedQuestion
        );
    }

    static async readQuestionFromImage(image) {
        if (!image?.uri) {
            throw new Error(
                "Vui lòng chọn ảnh bài toán trước."
            );
        }

        const token = await getToken();

        if (!token) {
            throw new Error("Bạn chưa đăng nhập.");
        }

        const file = new File(image.uri);

        if (!file.exists) {
            throw new Error("Không tìm thấy file ảnh.");
        }

        if (file.size > MAX_IMAGE_SIZE) {
            throw new Error(
                "Ảnh không được vượt quá 10 MB."
            );
        }

        const uploadTask = file.createUploadTask(
            `${API_BASE_URL}/ocr`,
            {
                httpMethod: "POST",
                uploadType: UploadType.MULTIPART,
                fieldName: "image",
                mimeType: image.mimeType,
                parameters: {
                    originalName: image.name,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const response = await uploadTask.uploadAsync();

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
            !String(extractedText).trim()
        ) {
            throw new Error(
                "Không nhận diện được đề bài trong ảnh."
            );
        }

        return String(extractedText).trim();
    }
}

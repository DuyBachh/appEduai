import * as DocumentPicker from "expo-document-picker";
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

import {
    getDocumentMimeType,
    getDocumentsFromResponse,
} from "../utils/documentUtils";

export default class DocumentService {
    static async getDocuments() {
        const result =
            await apiRequest("/documents");

        return getDocumentsFromResponse(result);
    }

    static async getDocumentById(documentId) {
        const result =
            await apiRequest(
                `/documents/${documentId}`
            );

        if (!result?.data) {
            throw new Error(
                "Không tìm thấy dữ liệu tài liệu."
            );
        }

        return result.data;
    }

    static async pickDocument() {
        const result =
            await DocumentPicker.getDocumentAsync({
                type: [
                    "application/pdf",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "text/plain",
                ],
                copyToCacheDirectory: true,
                multiple: false,
            });

        if (result.canceled) {
            return null;
        }

        return result.assets?.[0] || null;
    }

    static async uploadDocument(file) {
        if (!file?.uri) {
            throw new Error(
                "Không tìm thấy file đã chọn."
            );
        }

        const token = await getToken();

        if (!token) {
            throw new Error(
                "Bạn chưa đăng nhập."
            );
        }

        const uploadFile = new File(file.uri);

        if (!uploadFile.exists) {
            throw new Error(
                "Không tìm thấy file tài liệu."
            );
        }

        const uploadTask =
            uploadFile.createUploadTask(
                `${API_BASE_URL}/documents/upload`,
                {
                    httpMethod: "POST",
                    uploadType:
                        UploadType.MULTIPART,
                    fieldName: "file",
                    mimeType:
                        getDocumentMimeType(file),
                    parameters: {
                        originalName:
                            file.name || "document",
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
                    "Upload tài liệu thất bại."
            );
        }

        return data;
    }

    static updateDocument(
        documentId,
        payload
    ) {
        return apiRequest(
            `/documents/${documentId}`,
            {
                method: "PUT",
                body: JSON.stringify(payload),
            }
        );
    }

    static deleteDocument(documentId) {
        return apiRequest(
            `/documents/${documentId}`,
            {
                method: "DELETE",
            }
        );
    }
}

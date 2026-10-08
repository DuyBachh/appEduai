import {
    apiRequest,
} from "../../../services/api";

export default class SummaryService {
    static async createSummary(
        documentId,
        type
    ) {
        const result =
            await apiRequest(
                `/summaries/documents/${documentId}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        type,
                    }),
                }
            );

        if (!result?.data?.content) {
            throw new Error(
                "Backend không trả về nội dung tóm tắt."
            );
        }

        return result.data;
    }

    static async getHistory(
        documentId
    ) {
        const result =
            await apiRequest(
                `/summaries/documents/${documentId}`
            );

        return Array.isArray(result?.data)
            ? result.data
            : [];
    }

    static async getSummaryById(
        summaryId
    ) {
        const result =
            await apiRequest(
                `/summaries/${summaryId}`
            );

        if (!result?.data) {
            throw new Error(
                "Không tìm thấy dữ liệu bản tóm tắt."
            );
        }

        return result.data;
    }

    static deleteSummary(summaryId) {
        return apiRequest(
            `/summaries/${summaryId}`,
            {
                method: "DELETE",
            }
        );
    }
}

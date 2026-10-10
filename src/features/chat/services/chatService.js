import {
    apiRequest,
} from "../../../services/api";

export default class ChatService {
    static async getMessages(
        conversationId
    ) {
        const result =
            await apiRequest(
                `/chat/conversations/${conversationId}/messages`
            );

        return Array.isArray(
            result?.data?.messages
        )
            ? result.data.messages
            : [];
    }

    static async sendMessage({
        documentId,
        conversationId,
        question,
    }) {
        const result =
            await apiRequest("/chat", {
                method: "POST",
                body: JSON.stringify({
                    documentId,
                    conversationId,
                    question,
                }),
            });

        if (!result?.data) {
            throw new Error(
                "Backend không trả về dữ liệu chat."
            );
        }

        return result.data;
    }

    static async getConversations(
        documentId
    ) {
        const result =
            await apiRequest(
                `/chat/conversations?documentId=${encodeURIComponent(
                    documentId
                )}`
            );

        return Array.isArray(result?.data)
            ? result.data
            : [];
    }

    static deleteConversation(
        conversationId
    ) {
        return apiRequest(
            `/chat/conversations/${conversationId}`,
            {
                method: "DELETE",
            }
        );
    }
}

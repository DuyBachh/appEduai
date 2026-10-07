const chatService =
    require(
        "../services/chatService"
    );

// ========================================
// VERIFY SERVICES
// ========================================

const requiredFunctions =
    [
        "chatWithDocument",

        "getConversations",

        "getConversationMessages",

        "deleteConversation",
    ];

for (
    const functionName of
    requiredFunctions
) {
    if (
        typeof chatService[
            functionName
        ] !==
        "function"
    ) {
        throw new Error(
            `chatService.${functionName} phải là function.`
        );
    }
}

const {
    chatWithDocument,

    getConversations,

    getConversationMessages,

    deleteConversation,
} = chatService;

// ========================================
// USER ID
// ========================================

const getUserIdFromRequest = (
    req
) => {
    const value =
        req.user?.userId ||
        req.user?.id ||
        req.user?._id ||
        req.auth?.userId ||
        req.auth?.id ||
        req.auth?._id;

    return value
        ? String(value)
        : null;
};

const requireUserId = (
    req
) => {
    const userId =
        getUserIdFromRequest(
            req
        );

    if (!userId) {
        const error =
            new Error(
                "Không xác định được người dùng đăng nhập."
            );

        error.statusCode =
            401;

        throw error;
    }

    return userId;
};

// ========================================
// SEND MESSAGE
// ========================================

const sendMessage =
    async (
        req,
        res,
        next
    ) => {
        try {
            const userId =
                requireUserId(
                    req
                );

            const {
                documentId,

                conversationId =
                    null,

                question,
            } =
                req.body || {};

            const result =
                await chatWithDocument(
                    {
                        userId,

                        documentId,

                        conversationId,

                        question,
                    }
                );

            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Chat với tài liệu thành công.",

                    data:
                        result,
                });
        } catch (error) {
            return next(
                error
            );
        }
    };

// ========================================
// HISTORY
// ========================================

const getChatHistory =
    async (
        req,
        res,
        next
    ) => {
        try {
            const userId =
                requireUserId(
                    req
                );

            const documentId =
                req.query
                    ?.documentId ||
                null;

            const conversations =
                await getConversations(
                    {
                        userId,

                        documentId,
                    }
                );

            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Lấy lịch sử trò chuyện thành công.",

                    data:
                        conversations,
                });
        } catch (error) {
            return next(
                error
            );
        }
    };

// ========================================
// GET MESSAGES
// ========================================

const getMessages =
    async (
        req,
        res,
        next
    ) => {
        try {
            const userId =
                requireUserId(
                    req
                );

            const result =
                await getConversationMessages(
                    {
                        userId,

                        conversationId:
                            req.params
                                .conversationId,
                    }
                );

            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Lấy nội dung cuộc trò chuyện thành công.",

                    data:
                        result,
                });
        } catch (error) {
            return next(
                error
            );
        }
    };

// ========================================
// DELETE
// ========================================

const removeConversation =
    async (
        req,
        res,
        next
    ) => {
        try {
            const userId =
                requireUserId(
                    req
                );

            const result =
                await deleteConversation(
                    {
                        userId,

                        conversationId:
                            req.params
                                .conversationId,
                    }
                );

            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Xóa cuộc trò chuyện thành công.",

                    data:
                        result,
                });
        } catch (error) {
            return next(
                error
            );
        }
    };

// ========================================
// EXPORT
// ========================================

module.exports = {
    sendMessage,
    getChatHistory,
    getMessages,
    removeConversation,
};
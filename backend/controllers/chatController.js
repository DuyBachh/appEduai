const {
    chatWithDocument,
    getConversations,
    getConversationMessages,
    deleteConversation,
} = require("../services/chatService");

const sendMessage = async (
    req,
    res,
    next
) => {
    try {
        const {
            documentId,
            conversationId,
            question,
        } = req.body;

        const result =
            await chatWithDocument({
                userId: req.user.userId,
                documentId,
                conversationId,
                question,
            });

        res.status(200).json({
            success: true,
            message:
                "Chat với tài liệu thành công.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getChatHistory = async (
    req,
    res,
    next
) => {
    try {
        const conversations =
            await getConversations(
                req.user.userId
            );

        res.status(200).json({
            success: true,
            message:
                "Lấy lịch sử trò chuyện thành công.",
            data: conversations,
        });
    } catch (error) {
        next(error);
    }
};

const getMessages = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await getConversationMessages({
                userId: req.user.userId,
                conversationId:
                    req.params.conversationId,
            });

        res.status(200).json({
            success: true,
            message:
                "Lấy nội dung cuộc trò chuyện thành công.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const removeConversation = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await deleteConversation({
                userId: req.user.userId,
                conversationId:
                    req.params.conversationId,
            });

        res.status(200).json({
            success: true,
            message:
                "Xóa cuộc trò chuyện thành công.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendMessage,
    getChatHistory,
    getMessages,
    removeConversation,
};
const { ObjectId } = require("mongodb");

const {
    client,
} = require("../config/database");

const {
    createConversation,
} = require("../models/conversationModel");

const {
    createMessage,
} = require("../models/messageModel");

const {
    generateText,
} = require("./aiService");

const {
    getChatPrompt,
} = require("../prompts/chatPrompts");

const validateObjectId = (
    id,
    message = "ID không hợp lệ."
) => {
    if (!ObjectId.isValid(id)) {
        const error = new Error(message);

        error.statusCode = 400;

        throw error;
    }
};

const chatWithDocument = async ({
    userId,
    documentId,
    conversationId,
    question,
}) => {
    validateObjectId(
        userId,
        "User ID không hợp lệ."
    );

    validateObjectId(
        documentId,
        "Document ID không hợp lệ."
    );

    if (!question || !question.trim()) {
        const error = new Error(
            "Câu hỏi không được để trống."
        );

        error.statusCode = 400;

        throw error;
    }

    const db = client.db("appEduai");

    const documentsCollection =
        db.collection("documents");

    const conversationsCollection =
        db.collection("conversations");

    const messagesCollection =
        db.collection("messages");

    const document =
        await documentsCollection.findOne({
            _id: new ObjectId(documentId),
            userId: new ObjectId(userId),
        });

    if (!document) {
        const error = new Error(
            "Không tìm thấy tài liệu hoặc bạn không có quyền truy cập."
        );

        error.statusCode = 404;

        throw error;
    }

    if (
        !document.extractedText ||
        !document.extractedText.trim()
    ) {
        const error = new Error(
            "Tài liệu chưa có nội dung để chat."
        );

        error.statusCode = 400;

        throw error;
    }

    let conversation = null;
    let isNewConversation = false;

    if (conversationId) {
        validateObjectId(
            conversationId,
            "Conversation ID không hợp lệ."
        );

        conversation =
            await conversationsCollection.findOne({
                _id: new ObjectId(
                    conversationId
                ),
                userId: new ObjectId(userId),
            });

        if (!conversation) {
            const error = new Error(
                "Không tìm thấy cuộc trò chuyện."
            );

            error.statusCode = 404;

            throw error;
        }

        if (
            conversation.documentId &&
            conversation.documentId.toString() !==
                documentId
        ) {
            const error = new Error(
                "Cuộc trò chuyện không thuộc tài liệu này."
            );

            error.statusCode = 400;

            throw error;
        }
    } else {
        conversation = createConversation({
            userId,
            title: question
                .trim()
                .slice(0, 50),
        });

        conversation.documentId =
            new ObjectId(documentId);

        isNewConversation = true;
    }

    let history = [];

    if (!isNewConversation) {
        history =
            await messagesCollection
                .find({
                    conversationId:
                        conversation._id,
                    userId:
                        new ObjectId(userId),
                })
                .sort({
                    createdAt: -1,
                })
                .limit(10)
                .toArray();

        history.reverse();
    }

    const prompt = getChatPrompt({
        documentText:
            document.extractedText,
        history,
        question: question.trim(),
    });

    const answer =
        await generateText({
            instructions:
                "Bạn là trợ lý học tập chuyên trả lời câu hỏi dựa trên tài liệu và lịch sử hội thoại.",
            prompt,
        });

    if (isNewConversation) {
        await conversationsCollection.insertOne(
            conversation
        );
    }

    const userMessage =
        createMessage({
            conversationId:
                conversation._id,
            userId,
            role: "user",
            content: question.trim(),
        });

    const aiMessage =
        createMessage({
            conversationId:
                conversation._id,
            userId,
            role: "assistant",
            content: answer,
        });

    await messagesCollection.insertMany([
        userMessage,
        aiMessage,
    ]);

    await conversationsCollection.updateOne(
        {
            _id: conversation._id,
            userId: new ObjectId(userId),
        },
        {
            $set: {
                updatedAt: new Date(),
            },
        }
    );

    return {
        conversationId:
            conversation._id,
        question:
            userMessage.content,
        answer:
            aiMessage.content,
    };
};

const getConversations = async (
    userId
) => {
    validateObjectId(
        userId,
        "User ID không hợp lệ."
    );

    const db = client.db("appEduai");

    const conversationsCollection =
        db.collection("conversations");

    const conversations =
        await conversationsCollection
            .find({
                userId: new ObjectId(userId),
            })
            .sort({
                updatedAt: -1,
            })
            .toArray();

    return conversations;
};

const getConversationMessages = async ({
    userId,
    conversationId,
}) => {
    validateObjectId(
        userId,
        "User ID không hợp lệ."
    );

    validateObjectId(
        conversationId,
        "Conversation ID không hợp lệ."
    );

    const db = client.db("appEduai");

    const conversationsCollection =
        db.collection("conversations");

    const messagesCollection =
        db.collection("messages");

    const conversation =
        await conversationsCollection.findOne({
            _id: new ObjectId(
                conversationId
            ),
            userId: new ObjectId(userId),
        });

    if (!conversation) {
        const error = new Error(
            "Không tìm thấy cuộc trò chuyện."
        );

        error.statusCode = 404;

        throw error;
    }

    const messages =
        await messagesCollection
            .find({
                conversationId:
                    new ObjectId(
                        conversationId
                    ),
                userId:
                    new ObjectId(userId),
            })
            .sort({
                createdAt: 1,
            })
            .toArray();

    return {
        conversation,
        messages,
    };
};

const deleteConversation = async ({
    userId,
    conversationId,
}) => {
    validateObjectId(
        userId,
        "User ID không hợp lệ."
    );

    validateObjectId(
        conversationId,
        "Conversation ID không hợp lệ."
    );

    const db = client.db("appEduai");

    const conversationsCollection =
        db.collection("conversations");

    const messagesCollection =
        db.collection("messages");

    const conversation =
        await conversationsCollection.findOne({
            _id: new ObjectId(
                conversationId
            ),
            userId: new ObjectId(userId),
        });

    if (!conversation) {
        const error = new Error(
            "Không tìm thấy cuộc trò chuyện hoặc bạn không có quyền xóa."
        );

        error.statusCode = 404;

        throw error;
    }

    await messagesCollection.deleteMany({
        conversationId:
            new ObjectId(conversationId),
        userId:
            new ObjectId(userId),
    });

    await conversationsCollection.deleteOne({
        _id: new ObjectId(
            conversationId
        ),
        userId: new ObjectId(userId),
    });

    return {
        id: conversationId,
    };
};

module.exports = {
    chatWithDocument,
    getConversations,
    getConversationMessages,
    deleteConversation,
};
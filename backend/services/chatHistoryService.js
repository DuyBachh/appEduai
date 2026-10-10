const { ObjectId } = require("mongodb");
const { client } = require("../config/database");
const { createServiceError } = require("../utils/serviceError");
const { validateObjectId } = require("../utils/chatValidation");

// ========================================
// CHAT HISTORY
// ========================================

const getConversations =
    async ({
        userId,
        documentId =
            null,
    }) => {
        validateObjectId(
            userId,
            "User ID không hợp lệ."
        );

        if (
            documentId
        ) {
            validateObjectId(
                documentId,
                "Document ID không hợp lệ."
            );
        }

        const db =
            client.db(
                "appEduai"
            );

        const conversationsCollection =
            db.collection(
                "conversations"
            );

        const messagesCollection =
            db.collection(
                "messages"
            );

        const userObjectId =
            new ObjectId(
                userId
            );

        const filter = {
            userId:
                userObjectId,
        };

        if (
            documentId
        ) {
            filter.documentId =
                new ObjectId(
                    documentId
                );
        }

        const conversations =
            await conversationsCollection
                .find(
                    filter
                )
                .sort({
                    updatedAt:
                        -1,
                })
                .toArray();

        if (
            conversations.length ===
            0
        ) {
            return [];
        }

        const conversationIds =
            conversations.map(
                (
                    item
                ) =>
                    item._id
            );

        const counts =
            await messagesCollection
                .aggregate([
                    {
                        $match: {
                            userId:
                                userObjectId,

                            conversationId:
                                {
                                    $in:
                                        conversationIds,
                                },
                        },
                    },

                    {
                        $group: {
                            _id:
                                "$conversationId",

                            messageCount:
                                {
                                    $sum:
                                        1,
                                },
                        },
                    },
                ])
                .toArray();

        const countMap =
            new Map(
                counts.map(
                    (
                        item
                    ) => [
                        item._id.toString(),

                        item.messageCount,
                    ]
                )
            );

        return conversations.map(
            (
                conversation
            ) => ({
                ...conversation,

                messageCount:
                    countMap.get(
                        conversation._id.toString()
                    ) || 0,
            })
        );
    };

// ========================================
// GET MESSAGES
// ========================================

const getConversationMessages =
    async ({
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

        const db =
            client.db(
                "appEduai"
            );

        const conversationsCollection =
            db.collection(
                "conversations"
            );

        const messagesCollection =
            db.collection(
                "messages"
            );

        const userObjectId =
            new ObjectId(
                userId
            );

        const conversationObjectId =
            new ObjectId(
                conversationId
            );

        const conversation =
            await conversationsCollection.findOne(
                {
                    _id:
                        conversationObjectId,

                    userId:
                        userObjectId,
                }
            );

        if (
            !conversation
        ) {
            throw createServiceError(
                "Không tìm thấy cuộc trò chuyện.",
                404
            );
        }

        const messages =
            await messagesCollection
                .find({
                    conversationId:
                        conversationObjectId,

                    userId:
                        userObjectId,
                })
                .sort({
                    createdAt:
                        1,
                })
                .toArray();

        return {
            conversation,

            messages,
        };
    };

// ========================================
// DELETE CONVERSATION
// ========================================

const deleteConversation =
    async ({
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

        const db =
            client.db(
                "appEduai"
            );

        const conversationsCollection =
            db.collection(
                "conversations"
            );

        const messagesCollection =
            db.collection(
                "messages"
            );

        const userObjectId =
            new ObjectId(
                userId
            );

        const conversationObjectId =
            new ObjectId(
                conversationId
            );

        const conversation =
            await conversationsCollection.findOne(
                {
                    _id:
                        conversationObjectId,

                    userId:
                        userObjectId,
                }
            );

        if (
            !conversation
        ) {
            throw createServiceError(
                "Không tìm thấy cuộc trò chuyện hoặc bạn không có quyền xóa.",
                404
            );
        }

        const messageResult =
            await messagesCollection.deleteMany(
                {
                    conversationId:
                        conversationObjectId,

                    userId:
                        userObjectId,
                }
            );

        await conversationsCollection.deleteOne(
            {
                _id:
                    conversationObjectId,

                userId:
                    userObjectId,
            }
        );

        return {
            conversationId,

            deletedMessages:
                messageResult.deletedCount,
        };
    };

module.exports = { getConversations, getConversationMessages, deleteConversation };

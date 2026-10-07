const express = require("express");

const {
    sendMessage,
    getChatHistory,
    getMessages,
    removeConversation,
} = require("../controllers/chatController");

const {
    authMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    sendMessage
);

router.get(
    "/conversations",
    getChatHistory
);

router.get(
    "/conversations/:conversationId/messages",
    getMessages
);

router.delete(
    "/conversations/:conversationId",
    removeConversation
);

module.exports = router;
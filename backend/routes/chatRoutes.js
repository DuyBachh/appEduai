const express =
    require("express");

const chatController =
    require(
        "../controllers/chatController"
    );

const authModule =
    require(
        "../middleware/authMiddleware"
    );

// ========================================
// AUTH
// ========================================

const authMiddleware =
    typeof authModule ===
    "function"
        ? authModule
        : authModule.authMiddleware ||
          authModule.protect ||
          authModule.authenticate ||
          authModule.authenticateToken ||
          authModule.verifyToken;

if (
    typeof authMiddleware !==
    "function"
) {
    throw new TypeError(
        "authMiddleware không phải function."
    );
}

// ========================================
// CONTROLLERS
// ========================================

const requiredControllers =
    [
        "sendMessage",

        "getChatHistory",

        "getMessages",

        "removeConversation",
    ];

for (
    const controllerName of
    requiredControllers
) {
    if (
        typeof chatController[
            controllerName
        ] !==
        "function"
    ) {
        throw new TypeError(
            `chatController.${controllerName} không phải function.`
        );
    }
}

// ========================================
// ROUTER
// ========================================

const router =
    express.Router();

router.use(
    authMiddleware
);

// POST /api/chat
router.post(
    "/",
    chatController.sendMessage
);

// GET /api/chat/conversations
router.get(
    "/conversations",
    chatController.getChatHistory
);

// GET /api/chat/conversations/:id/messages
router.get(
    "/conversations/:conversationId/messages",
    chatController.getMessages
);

// DELETE /api/chat/conversations/:id
router.delete(
    "/conversations/:conversationId",
    chatController.removeConversation
);

// ========================================
// EXPORT
// ========================================

module.exports =
    router;

module.exports.chatRoutes =
    router;
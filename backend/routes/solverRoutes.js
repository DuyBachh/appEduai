const express =
    require("express");

const solverController =
    require(
        "../controllers/solverController"
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
// CONTROLLER
// ========================================

if (
    typeof solverController
        .solve !==
    "function"
) {
    throw new TypeError(
        "solverController.solve không phải function."
    );
}

// ========================================
// ROUTER
// ========================================

const router =
    express.Router();

router.use(
    authMiddleware
);

// POST /api/solver
router.post(
    "/",
    solverController.solve
);

// ========================================
// EXPORT
// ========================================

module.exports =
    router;

module.exports.solverRoutes =
    router;
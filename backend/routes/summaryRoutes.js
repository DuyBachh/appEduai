const express =
    require("express");

const summaryController =
    require(
        "../controllers/summaryController"
    );

const authModule =
    require(
        "../middleware/authMiddleware"
    );

// ========================================
// AUTH MIDDLEWARE
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

// ========================================
// VALIDATE AUTH
// ========================================

if (
    typeof authMiddleware !==
    "function"
) {
    throw new TypeError(
        "authMiddleware không phải function. Kiểm tra middleware/authMiddleware.js."
    );
}

// ========================================
// VALIDATE CONTROLLER
// ========================================

const requiredControllers = [
    "createSummary",
    "getSummariesByDocument",
    "getSummaryDetail",
    "deleteSummary",
];

for (
    const controllerName of
    requiredControllers
) {
    if (
        typeof summaryController[
            controllerName
        ] !==
        "function"
    ) {
        throw new TypeError(
            `summaryController.${controllerName} không phải function.`
        );
    }
}

// ========================================
// ROUTER
// ========================================

const router =
    express.Router();

// ========================================
// AUTH
// ========================================

router.use(
    authMiddleware
);

// ========================================
// CREATE SUMMARY
//
// POST
// /api/summaries/documents/:documentId
// ========================================

router.post(
    "/documents/:documentId",
    summaryController.createSummary
);

// ========================================
// HISTORY
//
// GET
// /api/summaries/documents/:documentId
// ========================================

router.get(
    "/documents/:documentId",
    summaryController.getSummariesByDocument
);

// ========================================
// DETAIL
//
// GET
// /api/summaries/:summaryId
// ========================================

router.get(
    "/:summaryId",
    summaryController.getSummaryDetail
);

// ========================================
// DELETE
//
// DELETE
// /api/summaries/:summaryId
// ========================================

router.delete(
    "/:summaryId",
    summaryController.deleteSummary
);

// ========================================
// EXPORT
// ========================================

// Kiểu chuẩn
module.exports =
    router;

// Đồng thời hỗ trợ:
// const { summaryRoutes } = require(...)
module.exports.summaryRoutes =
    router;
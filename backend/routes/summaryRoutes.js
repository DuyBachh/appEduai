const express = require("express");

const {
    createSummary,
    getSummaryHistory,
    getSummaryDetail,
    deleteSummary,
} = require("../controllers/summaryController");

const {
    authMiddleware,
} = require("../middleware/authMiddleware");

const router =
    express.Router();

router.use(
    authMiddleware
);

// Tạo summary
router.post(
    "/documents/:documentId",
    createSummary
);

// Lịch sử summary theo tài liệu
router.get(
    "/documents/:documentId",
    getSummaryHistory
);

// Chi tiết một summary
router.get(
    "/:summaryId",
    getSummaryDetail
);

// Xóa một summary
router.delete(
    "/:summaryId",
    deleteSummary
);

module.exports =
    router;
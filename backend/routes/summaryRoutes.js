const express = require("express");

const {
    createSummary,
} = require("../controllers/summaryController");

const {
    authMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/documents/:documentId",
    createSummary
);

module.exports = router;
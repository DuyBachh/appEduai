const {
    summarizeDocument,
    getDocumentSummaries,
    getSummaryById,
    deleteSummaryById,
} = require("../services/summaryService");

// ========================================
// CREATE SUMMARY
// ========================================

const createSummary = async (
    req,
    res,
    next
) => {
    try {
        const {
            type = "medium",
        } = req.body;

        const summary =
            await summarizeDocument({
                userId:
                    req.user.userId,

                documentId:
                    req.params.documentId,

                type,
            });

        res.status(201).json({
            success: true,
            message:
                "Tóm tắt tài liệu thành công.",
            data: summary,
        });
    } catch (error) {
        next(error);
    }
};

// ========================================
// SUMMARY HISTORY
// ========================================

const getSummaryHistory = async (
    req,
    res,
    next
) => {
    try {
        const summaries =
            await getDocumentSummaries({
                userId:
                    req.user.userId,

                documentId:
                    req.params.documentId,
            });

        res.status(200).json({
            success: true,
            data: summaries,
        });
    } catch (error) {
        next(error);
    }
};

// ========================================
// SUMMARY DETAIL
// ========================================

const getSummaryDetail = async (
    req,
    res,
    next
) => {
    try {
        const summary =
            await getSummaryById({
                userId:
                    req.user.userId,

                summaryId:
                    req.params.summaryId,
            });

        res.status(200).json({
            success: true,
            data: summary,
        });
    } catch (error) {
        next(error);
    }
};

// ========================================
// DELETE SUMMARY
// ========================================

const deleteSummary = async (
    req,
    res,
    next
) => {
    try {
        await deleteSummaryById({
            userId:
                req.user.userId,

            summaryId:
                req.params.summaryId,
        });

        res.status(200).json({
            success: true,
            message:
                "Đã xóa bản tóm tắt.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSummary,
    getSummaryHistory,
    getSummaryDetail,
    deleteSummary,
};
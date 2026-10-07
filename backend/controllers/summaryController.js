const {
    summarizeDocument,
} = require("../services/summaryService");

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
                userId: req.user.userId,
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

module.exports = {
    createSummary,
};
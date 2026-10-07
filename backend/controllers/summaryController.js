const summaryService =
    require(
        "../services/summaryService"
    );

// ========================================
// VERIFY SERVICE EXPORTS
// ========================================

const requiredServiceFunctions =
    [
        "summarizeDocument",

        "getDocumentSummaries",

        "getSummaryById",

        "deleteSummaryById",
    ];

for (
    const functionName of
    requiredServiceFunctions
) {
    if (
        typeof summaryService[
            functionName
        ] !==
        "function"
    ) {
        throw new Error(
            `summaryService.${functionName} phải là function. Kiểm tra module.exports trong summaryService.js.`
        );
    }
}

const {
    summarizeDocument,

    getDocumentSummaries,

    getSummaryById,

    deleteSummaryById,
} = summaryService;

// ========================================
// GET USER ID
// ========================================

const getUserIdFromRequest = (
    req
) => {
    const value =
        req.user?.id ||
        req.user?._id ||
        req.user?.userId ||
        req.auth?.id ||
        req.auth?._id ||
        req.auth?.userId;

    if (!value) {
        return null;
    }

    return String(
        value
    );
};

// ========================================
// REQUIRE USER
// ========================================

const requireUserId = (
    req
) => {
    const userId =
        getUserIdFromRequest(
            req
        );

    if (!userId) {
        const error =
            new Error(
                "Không xác định được người dùng đăng nhập."
            );

        error.statusCode =
            401;

        throw error;
    }

    return userId;
};

// ========================================
// CREATE SUMMARY
// ========================================

const createSummary =
    async (
        req,
        res,
        next
    ) => {
        try {
            const userId =
                requireUserId(
                    req
                );

            const documentId =
                req.params
                    .documentId;

            const type =
                req.body
                    ?.type ||
                "medium";

            const summary =
                await summarizeDocument(
                    {
                        userId,

                        documentId,

                        type,
                    }
                );

            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Tạo bản tóm tắt thành công.",

                    data:
                        summary,
                });
        } catch (error) {
            return next(
                error
            );
        }
    };

// ========================================
// HISTORY
// ========================================

const getSummariesByDocument =
    async (
        req,
        res,
        next
    ) => {
        try {
            const userId =
                requireUserId(
                    req
                );

            const documentId =
                req.params
                    .documentId;

            const summaries =
                await getDocumentSummaries(
                    {
                        userId,

                        documentId,
                    }
                );

            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Lấy lịch sử tóm tắt thành công.",

                    data:
                        summaries,
                });
        } catch (error) {
            return next(
                error
            );
        }
    };

// ========================================
// DETAIL
// ========================================

const getSummaryDetail =
    async (
        req,
        res,
        next
    ) => {
        try {
            const userId =
                requireUserId(
                    req
                );

            const summaryId =
                req.params
                    .summaryId;

            const summary =
                await getSummaryById(
                    {
                        userId,

                        summaryId,
                    }
                );

            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Lấy bản tóm tắt thành công.",

                    data:
                        summary,
                });
        } catch (error) {
            return next(
                error
            );
        }
    };

// ========================================
// DELETE
// ========================================

const deleteSummary =
    async (
        req,
        res,
        next
    ) => {
        try {
            const userId =
                requireUserId(
                    req
                );

            const summaryId =
                req.params
                    .summaryId;

            const result =
                await deleteSummaryById(
                    {
                        userId,

                        summaryId,
                    }
                );

            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Xóa bản tóm tắt thành công.",

                    data:
                        result,
                });
        } catch (error) {
            return next(
                error
            );
        }
    };

// ========================================
// EXPORT
// ========================================

module.exports = {
    createSummary,
    getSummariesByDocument,
    getSummaryDetail,
    deleteSummary,
};
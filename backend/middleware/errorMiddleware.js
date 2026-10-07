const errorMiddleware = (
    error,
    req,
    res,
    next
) => {
    let statusCode =
        Number(
            error?.statusCode ||
                error?.status ||
                500
        );

    if (
        !Number.isInteger(
            statusCode
        ) ||
        statusCode < 400 ||
        statusCode > 599
    ) {
        statusCode =
            500;
    }

    const message =
        error?.message ||
        "Đã xảy ra lỗi trên server.";

    console.error(
        "Backend Error:",
        error
    );

    if (
        res.headersSent
    ) {
        return next(
            error
        );
    }

    return res
        .status(
            statusCode
        )
        .json({
            success: false,

            message,
        });
};

// ========================================
// EXPORT
// ========================================

// Cho phép:
// const errorMiddleware = require(...)
module.exports =
    errorMiddleware;

// Đồng thời cho phép:
// const { errorMiddleware } = require(...)
module.exports.errorMiddleware =
    errorMiddleware;

// Và:
// const { errorHandler } = require(...)
module.exports.errorHandler =
    errorMiddleware;
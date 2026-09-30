const errorMiddleware = (err, req, res, next) => {
    console.error("Backend Error:", err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message:
            err.message ||
            "Đã xảy ra lỗi phía server.",
    });
};

module.exports = {
    errorMiddleware,
};
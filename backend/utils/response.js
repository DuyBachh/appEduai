const successResponse = (
    res,
    data = null,
    message = "Thành công.",
    statusCode = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

const errorResponse = (
    res,
    message = "Đã xảy ra lỗi.",
    statusCode = 500
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
};

module.exports = {
    successResponse,
    errorResponse,
};
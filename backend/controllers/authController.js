const authService = require("../services/authService");

const register = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Vui lòng nhập đầy đủ họ tên, email và mật khẩu.",
            });
        }

        const user =
            await authService.registerUser({
                name,
                email,
                password,
            });

        res.status(201).json({
            success: true,
            message: "Đăng ký thành công.",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Vui lòng nhập email và mật khẩu.",
            });
        }

        const result =
            await authService.loginUser({
                email,
                password,
            });

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Đăng xuất thành công.",
    });
};

const getCurrentUser = async (
    req,
    res,
    next
) => {
    try {
        const user =
            await authService.getCurrentUser(
                req.user.userId
            );

        res.status(200).json({
            success: true,
            message:
                "Lấy thông tin người dùng thành công.",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (
    req,
    res,
    next
) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message:
                    "Vui lòng nhập email.",
            });
        }

        const result =
            await authService.forgotPassword(
                email
            );

        res.status(200).json({
            success: true,
            message:
                "Tạo yêu cầu đặt lại mật khẩu thành công.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (
    req,
    res,
    next
) => {
    try {
        const {
            token,
            newPassword,
        } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Vui lòng cung cấp token và mật khẩu mới.",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Mật khẩu phải có ít nhất 6 ký tự.",
            });
        }

        const result =
            await authService.resetPassword({
                token,
                newPassword,
            });

        res.status(200).json({
            success: true,
            message:
                "Đặt lại mật khẩu thành công.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
};
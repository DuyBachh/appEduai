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

module.exports = {
    register,
    login,
    logout,
};
const bcrypt = require("bcrypt");
const {
    ObjectId,
} = require("mongodb");
const crypto = require("crypto");

const {
    createUser,
} = require("../models/userModel");

const {
    client,
} = require("../config/database");

const {
    generateToken,
} = require("../utils/jwt");

const registerUser = async ({
    name,
    email,
    password,
}) => {
    const db =
        client.db("appEduai");

    const usersCollection =
        db.collection("users");

    const existingUser =
        await usersCollection.findOne({
            email:
                email.toLowerCase(),
        });

    if (existingUser) {
        const error =
            new Error(
                "Email đã được đăng ký."
            );

        error.statusCode = 409;

        throw error;
    }

    const hashedPassword =
        await bcrypt.hash(
            password,
            10
        );

    const user = createUser({
        name,
        email:
            email.toLowerCase(),
        password:
            hashedPassword,
    });

    await usersCollection.insertOne(
        user
    );

    return {
        id: user._id,
        name: user.name,
        email: user.email,
    };
};

const loginUser = async ({
    email,
    password,
}) => {
    const db =
        client.db("appEduai");

    const usersCollection =
        db.collection("users");

    const user =
        await usersCollection.findOne({
            email:
                email.toLowerCase(),
        });

    if (!user) {
        const error =
            new Error(
                "Email hoặc mật khẩu không chính xác."
            );

        error.statusCode = 401;

        throw error;
    }

    const isPasswordValid =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isPasswordValid) {
        const error =
            new Error(
                "Email hoặc mật khẩu không chính xác."
            );

        error.statusCode = 401;

        throw error;
    }

    const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
    };

    const token =
        generateToken(userData);

    return {
        user: userData,
        token,
    };
};

const getCurrentUser =
    async (userId) => {
        const db =
            client.db("appEduai");

        const usersCollection =
            db.collection("users");

        if (
            !ObjectId.isValid(
                userId
            )
        ) {
            const error =
                new Error(
                    "User ID không hợp lệ."
                );

            error.statusCode = 400;

            throw error;
        }

        const user =
            await usersCollection.findOne(
                {
                    _id:
                        new ObjectId(
                            userId
                        ),
                },
                {
                    projection: {
                        password: 0,
                    },
                }
            );

        if (!user) {
            const error =
                new Error(
                    "Không tìm thấy người dùng."
                );

            error.statusCode = 404;

            throw error;
        }

        return {
            id: user._id,
            name: user.name,
            email: user.email,
        };
    };

const updateProfile = async ({
    userId,
    name,
}) => {
    const db =
        client.db("appEduai");

    const usersCollection =
        db.collection("users");

    if (
        !ObjectId.isValid(
            userId
        )
    ) {
        const error =
            new Error(
                "User ID không hợp lệ."
            );

        error.statusCode = 400;

        throw error;
    }

    const trimmedName =
        name.trim();

    if (!trimmedName) {
        const error =
            new Error(
                "Tên không được để trống."
            );

        error.statusCode = 400;

        throw error;
    }

    const result =
        await usersCollection.updateOne(
            {
                _id:
                    new ObjectId(
                        userId
                    ),
            },
            {
                $set: {
                    name:
                        trimmedName,
                    updatedAt:
                        new Date(),
                },
            }
        );

    if (
        result.matchedCount ===
        0
    ) {
        const error =
            new Error(
                "Không tìm thấy người dùng."
            );

        error.statusCode = 404;

        throw error;
    }

    return await getCurrentUser(
        userId
    );
};

const forgotPassword =
    async (email) => {
        const db =
            client.db("appEduai");

        const usersCollection =
            db.collection("users");

        const normalizedEmail =
            email.toLowerCase();

        const user =
            await usersCollection.findOne(
                {
                    email:
                        normalizedEmail,
                }
            );

        if (!user) {
            const error =
                new Error(
                    "Email không tồn tại."
                );

            error.statusCode = 404;

            throw error;
        }

        const resetToken =
            crypto
                .randomBytes(32)
                .toString("hex");

        const resetTokenExpires =
            new Date(
                Date.now() +
                    15 *
                        60 *
                        1000
            );

        await usersCollection.updateOne(
            {
                _id: user._id,
            },
            {
                $set: {
                    resetPasswordToken:
                        resetToken,
                    resetPasswordExpires:
                        resetTokenExpires,
                    updatedAt:
                        new Date(),
                },
            }
        );

        return {
            resetToken,
            expiresAt:
                resetTokenExpires,
        };
    };

const resetPassword = async ({
    token,
    newPassword,
}) => {
    const db =
        client.db("appEduai");

    const usersCollection =
        db.collection("users");

    const user =
        await usersCollection.findOne(
            {
                resetPasswordToken:
                    token,

                resetPasswordExpires:
                    {
                        $gt:
                            new Date(),
                    },
            }
        );

    if (!user) {
        const error =
            new Error(
                "Token không hợp lệ hoặc đã hết hạn."
            );

        error.statusCode = 400;

        throw error;
    }

    const hashedPassword =
        await bcrypt.hash(
            newPassword,
            10
        );

    await usersCollection.updateOne(
        {
            _id: user._id,
        },
        {
            $set: {
                password:
                    hashedPassword,
                updatedAt:
                    new Date(),
            },

            $unset: {
                resetPasswordToken:
                    "",
                resetPasswordExpires:
                    "",
            },
        }
    );

    return {
        message:
            "Đặt lại mật khẩu thành công.",
    };
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile,
    forgotPassword,
    resetPassword,
};
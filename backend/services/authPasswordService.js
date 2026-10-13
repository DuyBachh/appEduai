const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { client } = require("../config/database");

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


module.exports = { forgotPassword, resetPassword };

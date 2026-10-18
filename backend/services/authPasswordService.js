const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { client } = require("../config/database");
const { createServiceError } = require("../utils/serviceError");

const TOKEN_LIFETIME_MS = 15 * 60 * 1000;

const forgotPassword = async (email) => {
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        throw createServiceError("Email không hợp lệ.", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = client.db("appEduai").collection("users");
    const user = await users.findOne({ email: normalizedEmail });

    // Never reveal whether an email is registered.
    if (!user) {
        return { requested: true };
    }

    const resetToken = crypto.randomBytes(24).toString("hex");
    const resetPasswordTokenHash = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    const resetPasswordExpires = new Date(Date.now() + TOKEN_LIFETIME_MS);

    await users.updateOne(
        { _id: user._id },
        {
            $set: {
                resetPasswordTokenHash,
                resetPasswordExpires,
                updatedAt: new Date(),
            },
            $unset: { resetPasswordToken: "" },
        }
    );

    // Restore the original classroom flow: return the temporary reset token
    // to the app, without email or OTP. Do not use with real accounts.
    return {
        requested: true,
        resetToken,
        expiresAt: resetPasswordExpires,
    };
};

const resetPassword = async ({ token, newPassword }) => {
    if (
        typeof token !== "string" ||
        !/^[0-9a-f]{48}$/i.test(token.trim()) ||
        typeof newPassword !== "string" ||
        newPassword.length < 6
    ) {
        throw createServiceError("Mã đặt lại hoặc mật khẩu mới không hợp lệ.", 400);
    }

    const users = client.db("appEduai").collection("users");
    const resetPasswordTokenHash = crypto
        .createHash("sha256")
        .update(token.trim().toLowerCase())
        .digest("hex");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // The match-and-update is atomic: a reset code can be redeemed only once.
    const result = await users.updateOne(
        {
            resetPasswordTokenHash,
            resetPasswordExpires: { $gt: new Date() },
        },
        {
            $set: { password: hashedPassword, updatedAt: new Date() },
            $unset: {
                resetPasswordTokenHash: "",
                resetPasswordExpires: "",
                resetPasswordToken: "",
            },
        }
    );

    if (result.matchedCount !== 1) {
        throw createServiceError("Mã không hợp lệ, đã dùng hoặc hết hạn.", 400);
    }

    return { message: "Đặt lại mật khẩu thành công." };
};

module.exports = {
    forgotPassword,
    resetPassword,
};

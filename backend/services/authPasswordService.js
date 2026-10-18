const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { client } = require("../config/database");
const { createServiceError } = require("../utils/serviceError");

const TOKEN_LIFETIME_MS = 15 * 60 * 1000;

const isLocalDemoEnabled = () =>
    process.env.NODE_ENV === "development" &&
    process.env.ALLOW_DEMO_RESET_TOKEN === "true";

const canSendResetEmail = () =>
    Boolean(process.env.RESEND_API_KEY && process.env.RESET_EMAIL_FROM);

// Sending a secret to the account owner must happen out of band.
// This provider uses Node's built-in fetch so it needs no added dependency.
const sendResetEmail = async ({ email, resetToken }) => {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: process.env.RESET_EMAIL_FROM,
            to: [email],
            subject: "appEduai - Mã đặt lại mật khẩu",
            text: [
                "Bạn đã yêu cầu đặt lại mật khẩu cho appEduai.",
                "",
                `Mã đặt lại mật khẩu: ${resetToken}`,
                "Mã có hiệu lực trong 15 phút và chỉ sử dụng một lần.",
                "Nếu không yêu cầu, bạn có thể bỏ qua email này.",
            ].join("\n"),
        }),
    });

    if (!response.ok) {
        throw createServiceError(
            "Chưa gửi được email đặt lại mật khẩu. Vui lòng thử lại sau.",
            503
        );
    }
};

const forgotPassword = async (email) => {
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        throw createServiceError("Email không hợp lệ.", 400);
    }

    const demoMode = isLocalDemoEnabled();
    if (!canSendResetEmail() && !demoMode) {
        throw createServiceError(
            "Chức năng gửi email đặt lại mật khẩu chưa được cấu hình.",
            503
        );
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

    if (canSendResetEmail()) {
        try {
            await sendResetEmail({ email: normalizedEmail, resetToken });
        } catch (error) {
            await users.updateOne(
                { _id: user._id, resetPasswordTokenHash },
                { $unset: {
                    resetPasswordTokenHash: "",
                    resetPasswordExpires: "",
                }}
            );
            if (error?.statusCode === 503) throw error;
            throw createServiceError(
                "Chưa gửi được email đặt lại mật khẩu. Vui lòng thử lại sau.",
                503
            );
        }
        return { requested: true };
    }

    // EXPLICIT development-only demo; NEVER enable this on a public server.
    return {
        requested: true,
        resetToken: demoMode ? resetToken : undefined,
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
    isLocalDemoEnabled,
};

const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");

process.env.MONGODB_URI ||= "mongodb://127.0.0.1:27017/appeduai_ci";
const { client } = require("../config/database");
const { forgotPassword, resetPassword } = require("../services/authPasswordService");

const originalDb = client.db;
const originalFetch = global.fetch;
const originalEnv = {
    NODE_ENV: process.env.NODE_ENV,
    ALLOW_DEMO_RESET_TOKEN: process.env.ALLOW_DEMO_RESET_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESET_EMAIL_FROM: process.env.RESET_EMAIL_FROM,
};

const restore = () => {
    client.db = originalDb;
    global.fetch = originalFetch;
    for (const [key, value] of Object.entries(originalEnv)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
    }
};

const mockUsers = () => {
    const user = {
        _id: "u1",
        email: "student@example.com",
        password: "old-hash",
    };
    const users = {
        findOne: async (query) => {
            if (query.email) return user.email === query.email ? user : null;
            if (
                query.resetPasswordTokenHash === user.resetPasswordTokenHash &&
                user.resetPasswordExpires > query.resetPasswordExpires.$gt
            ) return user;
            return null;
        },
        updateOne: async (query, update) => {
            const matchesUser = query._id === user._id;
            const matchesToken = query.resetPasswordTokenHash
                && query.resetPasswordTokenHash === user.resetPasswordTokenHash
                && user.resetPasswordExpires > query.resetPasswordExpires.$gt;
            if (!matchesUser && !matchesToken) return { matchedCount: 0 };
            Object.assign(user, update.$set || {});
            for (const key of Object.keys(update.$unset || {})) delete user[key];
            return { matchedCount: 1 };
        },
    };
    client.db = () => ({ collection: () => users });
    return user;
};

// Environment and client stubs are shared; keep this entire suite sequential.
test("password reset: hashed, one-use code and unknown email privacy", async () => {
    const user = mockUsers();
    process.env.NODE_ENV = "development";
    process.env.ALLOW_DEMO_RESET_TOKEN = "true";
    delete process.env.RESEND_API_KEY;
    delete process.env.RESET_EMAIL_FROM;

    try {
        const missing = await forgotPassword("unknown@example.com");
        assert.deepEqual(missing, { requested: true });

        const issued = await forgotPassword("student@example.com");
        assert.match(issued.resetToken, /^[0-9a-f]{48}$/);
        assert.notEqual(user.resetPasswordTokenHash, issued.resetToken);
        assert.equal(user.resetPasswordTokenHash.length, 64);
        assert.equal(user.resetPasswordToken, undefined);
        const answer = await resetPassword({
            token: issued.resetToken,
            newPassword: "changed-password-1",
        });
        assert.match(answer.message, /thành công/);
        assert.equal(await bcrypt.compare("changed-password-1", user.password), true);
        assert.equal(user.resetPasswordTokenHash, undefined);
        await assert.rejects(
            resetPassword({ token: issued.resetToken, newPassword: "changed-password-2" }),
            { statusCode: 400 }
        );
    } finally {
        restore();
    }
});

test("password reset: production never permits token-disclosure demo", async () => {
    mockUsers();
    process.env.NODE_ENV = "production";
    process.env.ALLOW_DEMO_RESET_TOKEN = "true";
    delete process.env.RESEND_API_KEY;
    delete process.env.RESET_EMAIL_FROM;
    try {
        await assert.rejects(
            forgotPassword("student@example.com"),
            { statusCode: 503 }
        );
    } finally {
        restore();
    }
});

test("password reset: email provider sends code but API does not expose it", async () => {
    const user = mockUsers();
    process.env.NODE_ENV = "production";
    delete process.env.ALLOW_DEMO_RESET_TOKEN;
    process.env.RESEND_API_KEY = "ci_mock";
    process.env.RESET_EMAIL_FROM = "appEduai <demo@example.com>";
    let sent;
    global.fetch = async (_url, options) => {
        sent = JSON.parse(options.body);
        return { ok: true };
    };
    try {
        const response = await forgotPassword("student@example.com");
        assert.deepEqual(response, { requested: true });
        assert.equal(sent.to[0], "student@example.com");
        assert.match(sent.text, /Mã đặt lại mật khẩu:/);
        assert.equal(user.resetPasswordToken, undefined); // no raw token stored
    } finally {
        restore();
    }
});

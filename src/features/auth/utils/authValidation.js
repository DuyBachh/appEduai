export function normalizeEmail(value = "") {
    return String(value)
        .trim()
        .toLowerCase();
}

export function validateEmail(value = "") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        value
    );
}

export function validatePassword(value = "") {
    return String(value).length >= 6;
}

export function validateLoginForm({
    email,
    password,
}) {
    const normalizedEmail =
        normalizeEmail(email);

    if (!normalizedEmail) {
        return {
            error: "Vui lòng nhập email",
        };
    }

    if (!validateEmail(normalizedEmail)) {
        return {
            error: "Email không hợp lệ",
        };
    }

    if (!password) {
        return {
            error: "Vui lòng nhập mật khẩu",
        };
    }

    if (!validatePassword(password)) {
        return {
            error:
                "Mật khẩu phải có ít nhất 6 ký tự",
        };
    }

    return {
        normalizedEmail,
        error: "",
    };
}

export function validateRegisterForm({
    name,
    email,
    password,
    confirmPassword,
}) {
    const normalizedName =
        String(name || "").trim();

    const normalizedEmail =
        normalizeEmail(email);

    if (!normalizedName) {
        return {
            error: "Vui lòng nhập tên",
        };
    }

    if (!normalizedEmail) {
        return {
            error: "Vui lòng nhập email",
        };
    }

    if (!validateEmail(normalizedEmail)) {
        return {
            error: "Email không hợp lệ",
        };
    }

    if (!password) {
        return {
            error: "Vui lòng nhập mật khẩu",
        };
    }

    if (!validatePassword(password)) {
        return {
            error:
                "Mật khẩu phải có ít nhất 6 ký tự",
        };
    }

    if (!confirmPassword) {
        return {
            error:
                "Vui lòng xác nhận mật khẩu",
        };
    }

    if (confirmPassword !== password) {
        return {
            error:
                "Mật khẩu xác nhận không khớp",
        };
    }

    return {
        normalizedName,
        normalizedEmail,
        error: "",
    };
}

export function validateForgotPasswordForm(
    email
) {
    const normalizedEmail =
        normalizeEmail(email);

    if (!normalizedEmail) {
        return {
            error: "Vui lòng nhập email",
        };
    }

    if (!validateEmail(normalizedEmail)) {
        return {
            error: "Email không hợp lệ",
        };
    }

    return {
        normalizedEmail,
        error: "",
    };
}

export function validateResetPasswordForm({
    resetToken,
    newPassword,
    confirmPassword,
}) {
    if (!resetToken) {
        return {
            error:
                "Yêu cầu đặt lại mật khẩu không hợp lệ.",
        };
    }

    if (!String(newPassword).trim()) {
        return {
            error:
                "Vui lòng nhập mật khẩu mới",
        };
    }

    if (!validatePassword(newPassword)) {
        return {
            error:
                "Mật khẩu phải có ít nhất 6 ký tự",
        };
    }

    if (!String(confirmPassword).trim()) {
        return {
            error:
                "Vui lòng xác nhận mật khẩu",
        };
    }

    if (newPassword !== confirmPassword) {
        return {
            error:
                "Mật khẩu xác nhận không khớp",
        };
    }

    return {
        error: "",
    };
}

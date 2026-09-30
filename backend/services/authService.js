const bcrypt = require("bcrypt");

const { createUser } = require("../models/userModel");
const { client } = require("../config/database");
const { generateToken } = require("../utils/jwt");

const registerUser = async ({
    name,
    email,
    password,
}) => {
    const db = client.db("appEduai");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
        email: email.toLowerCase(),
    });

    if (existingUser) {
        const error = new Error(
            "Email đã được đăng ký."
        );

        error.statusCode = 409;

        throw error;
    }

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    const user = createUser({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
    });

    await usersCollection.insertOne(user);

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
    const db = client.db("appEduai");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
        email: email.toLowerCase(),
    });

    if (!user) {
        const error = new Error(
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
        const error = new Error(
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

    const token = generateToken(userData);

    return {
        user: userData,
        token,
    };
};

module.exports = {
    registerUser,
    loginUser,
};
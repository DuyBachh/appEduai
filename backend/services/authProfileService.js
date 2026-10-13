const { ObjectId } = require("mongodb");
const { client } = require("../config/database");

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


module.exports = { getCurrentUser, updateProfile };

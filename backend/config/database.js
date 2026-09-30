const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1",
]);

const { MongoClient } = require("mongodb");

const client = new MongoClient(
    process.env.MONGODB_URI
);

const connectDatabase = async () => {
    try {
        await client.connect();

        console.log(
            "MongoDB kết nối thành công."
        );

        return client.db("appEduai");
    } catch (error) {
        console.error(
            "MongoDB kết nối thất bại:",
            error.message
        );

        throw error;
    }
};

module.exports = {
    client,
    connectDatabase,
};
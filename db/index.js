const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config()


const connect = async (url) => {
    mongoose.connect(url || process.env.MONGODB_URL ||'mongodb://localhost:27017/learning-path-management')

    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB Successfully");
    });

    mongoose.connection.on("error", (err) => {
        console.log("An error occurred while connecting to MongoDB");
        console.log(err);
    });
}

module.exports = {
    connect
};
const mongoose = require('mongoose');

const connnectDb = async () => {
    try {
        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/mydb", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDb connected:`, conn?.connection?.host);
    } catch (error) {
        console.log("Error Connecting to MongoDb", error?.message);
    }
}

module.exports = connnectDb;
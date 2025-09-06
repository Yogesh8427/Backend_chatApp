const mongoose = require('mongoose');

const connnectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.ConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDb connected: succes`);
    } catch (error) {
        console.log("Error Connecting to MongoDb", error?.message);
    }
}

module.exports = connnectDb;
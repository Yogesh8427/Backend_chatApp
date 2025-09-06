const mongoose = require('mongoose');

const connnectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.CONNECTION_STRING , {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDb connected: success`);
    } catch (error) {
        console.log("Error Connecting to MongoDb", error?.message);
    }
}

module.exports = connnectDb;
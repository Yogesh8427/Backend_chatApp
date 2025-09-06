const admin = require("firebase-admin");
const dotenv= require("dotenv")
const serviceAccount = require("./utils/firebasekey.json");
dotenv.config()
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;

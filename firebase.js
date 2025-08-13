const admin = require("firebase-admin");
const serviceAccount = require("./chat-app-db1cf-3a418db0a98e.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;

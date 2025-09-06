const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
console.log(process.env.FIREBASE_SERVICE_ACCOUNT,"jhjhj");
// Fix escaped newlines in private key
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

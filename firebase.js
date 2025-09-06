// const admin = require('firebase-admin');
// const dotenv = require('dotenv');
// dotenv.config();

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
// console.log(process.env.FIREBASE_SERVICE_ACCOUNT,"jhjhj");
// // Fix escaped newlines in private key
// serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// module.exports = admin;


const dotenv = require('dotenv');
dotenv.config();  // Ensure dotenv is loading environment variables

console.log('FIREBASE_SERVICE_ACCOUNT:', process.env.FIREBASE_SERVICE_ACCOUNT);  // Check the value of the env variable

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  console.log('Parsed service account:', serviceAccount);
} catch (error) {
  console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', error);
}

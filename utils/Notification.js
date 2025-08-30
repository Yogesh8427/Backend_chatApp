// const admin = require("../firebase");

// const sendNotification = async (title, body, token) => {
//     try {
//         const message = {
//             notification: {
//                 title: title || "Hello from Node.js",
//                 body: body || "This is a Firebase push notification!"
//             },
//             token: token,
//         };
//         const response = await admin.messaging().send(message);
//         console.log("✅ Notification sent successfully:", response);
//     } catch (error) {
//         console.error("❌ Error sending notification:", error);
//     }
// };
// module.exports = { sendNotification };
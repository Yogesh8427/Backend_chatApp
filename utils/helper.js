const jwt = require("jsonwebtoken");

const generateToken = (user) => jwt.sign({ email: user.email, userid: user._id }, process.env.JWTSECRET)

module.exports = { generateToken };
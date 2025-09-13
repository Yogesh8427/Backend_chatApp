
const userModel = require("../Models/userSchema")
const JWT = require("jsonwebtoken")
const admin = require("../firebase");

const authenticateJwt = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(404).json({ message: "Please login first" })
        }
        const decodedata = JWT.verify(token, process.env.JWTSECRET)
        const { userid } = decodedata
        const user = await userModel.findById(userid)
        if (!user) {
            return res.status(404).json({ message: "no user found" })
        }
        req.user = user
        next()
    }
    catch (err) {
        console.log(err)
    }
}
const verifySocialLogin = async (req, res, next) => {
}

module.exports = { authenticateJwt, verifySocialLogin }

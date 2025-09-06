const userModel = require('../Models/userSchema');
const bcrypt = require("bcrypt");
const { generateToken } = require('../utils/helper');

const createUser = async (req, res) => {
    try {
        const { name, email, password, deviceInfo } = req.body;
        if (!name || !email || !password || !deviceInfo) {
            return res.status(400).json({ message: "invalid payload" });
        }
        const hashesdPassword = await bcrypt.hash(password, 10)
        const existing = await userModel.findOne({ email })
        if (existing) {
            return res.status(409).json({ message: "user already exists" });
        }
        const user = await userModel.create({
            name,
            email,
            password: hashesdPassword,
            deviceInfo,
        })

        const token = generateToken(user);
        
        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            { $set: { token } },
            { new: true, select: { password: 0, deviceInfo: 0 } }
        );

        return res.status(201).json({ message: "user created sucessfully", data: updatedUser })
    }
    catch (err) {
        console.log(err);
        return res.status(404).json({ message: err.message })
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password, deviceInfo } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "please enter email and password" })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "invalid credentials" })
        }
        const matchedpassword = await bcrypt.compare(password, user.password)
        if (!matchedpassword) {
            return res.status(400).json({ message: "please enter email and password" })
        }
        const token = generateToken(user);
        const updateduser = await userModel.findByIdAndUpdate(user.id,
            { $set: { token, deviceInfo } },
            { new: true, select: { password: 0, deviceInfo: 0 } });

        return res.status(200).json({ message: "login succesful", data: updateduser })
    }
    catch (err) {
        return res.status(404).json({ message: err.message })
    }
}

module.exports = { createUser, userLogin };
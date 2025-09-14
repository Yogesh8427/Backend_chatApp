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

        return res.status(201).json({ message: "Login successful", data: updatedUser })
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


const editUser = async (req, res) => {
    try {
        const loginUser = req.user._id

        const { name } = req.body

        let imageUrl = null;
        if (req.file) {

            imageUrl = `http://localhost:5055/uploads/${req.file.filename}`;
        }
        const user = await userModel.findByIdAndUpdate(loginUser, {
            name: name,
            image: imageUrl

        }, { new: true })

        return res.status(200).json({ message: "userUpdated succesfully", user })

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: err.message || "Internal server error" })
    }
}


const socialLogin = async (req, res) => {
    try {
        const userdata = req.firebaseUser;
        if (!userdata || !userdata.email) {
            return res.status(400).json({ message: "Invalid user data from Firebase" });
        }
        const { name, email, picture } = userdata;
        const { deviceInfo } = req.body;
        if (!deviceInfo) {
            return res.status(400).json({ message: "Device information is required" });
        }
        let token;
        let user = await userModel.findOne({ email });
        if (user) {
            user = await userModel.findByIdAndUpdate(user._id, { $set: { deviceInfo, image: picture } },
                { new: true, select: "-password" });
            token = generateToken(user);
        } else {
            user = await userModel.create({ name, email, image: picture, deviceInfo, password: null });
            token = generateToken(user);
        }
        const updateduser = await userModel.findByIdAndUpdate(user._id, { $set: { token } },
            { new: true, select: { password: 0, deviceInfo: 0 } });
        return res.status(200).json({ success: true, message: "Login successful", data: updateduser });
    } catch (err) {
        console.error("SocialLogin Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
const logout = async (req, res) => {
    try {
        const loginuser = req.user
        const user = await userModel.findByIdAndUpdate(loginuser._id, {
            token: null,
            deviceInfo: null
        }, { new: true })
        return res.status(200).json({ messgae: "logout succesfully" })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: err.message || "Internal server error" })
    }
}
  

module.exports = { createUser, userLogin, editUser, logout, socialLogin };


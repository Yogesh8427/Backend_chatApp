
const { Router } = require('express');
const {upload}= require("../middleware/multer.js")
const router = Router();
const { createUser, userLogin, socialLogin,editUser, logout } = require('../Controllers/userController');
const { authenticateJwt, verifySocialLogin } = require("../middleware/authenticateUser.js")
router.post('/socialSignup', verifySocialLogin, socialLogin);
router.post('/signup', createUser);
router.post('/login', userLogin);
// router.post("/social-login",verifyUSerLogin)
router.post("/edituser",authenticateJwt,upload.single("image"),editUser)
router.put('/logout', authenticateJwt, logout);
module.exports = router;



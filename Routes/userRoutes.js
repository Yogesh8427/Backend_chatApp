
const { Router } = require('express');
const {upload}= require("../middleware/multer.js")
const router = Router();
const { createUser, userLogin,editUser, logout } = require('../Controllers/userController');
const { authenticateJwt } = require("../middleware/authenticateUser.js");
const { verifyUSerLogin } = require('../middleware/verifyLogin.js');
router.post('/signup', createUser);
router.post('/login', userLogin);
router.post("/social-login",verifyUSerLogin)
router.post("/edituser",authenticateJwt,upload.single("image"),editUser)
router.put('/logout', authenticateJwt, logout);
module.exports = router;


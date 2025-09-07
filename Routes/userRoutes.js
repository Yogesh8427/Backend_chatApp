const { Router } = require('express');
const router = Router();
const { createUser, userLogin, socialLogin } = require('../Controllers/userController');
const { authenticateJwt, verifyGoogleUserLogin } = require("../middleware/authenticateUser.js")
router.post('/social/GoogleSignup', verifyGoogleUserLogin, socialLogin);
router.post('/signup', createUser);
router.post('/login', userLogin);
router.get('/logout', authenticateJwt, () => { });
module.exports = router;
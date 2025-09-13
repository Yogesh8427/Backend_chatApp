const { Router } = require('express');
const router = Router();
const { createUser, userLogin, socialLogin } = require('../Controllers/userController');
const { authenticateJwt, verifySocialLogin } = require("../middleware/authenticateUser.js")
router.post('/socialSignup', verifySocialLogin, socialLogin);
router.post('/signup', createUser);
router.post('/login', userLogin);
router.get('/logout', authenticateJwt, () => { });
module.exports = router;
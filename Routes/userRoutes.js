const { Router } = require('express');
const router = Router();
const { createUser, userLogin } = require('../Controllers/userController');
const { authenticateJwt } = require("../middleware/authenticateUser.js")
router.post('/signup', createUser);
router.post('/login', userLogin);
router.get('/logout', authenticateJwt, () => { });
module.exports = router;
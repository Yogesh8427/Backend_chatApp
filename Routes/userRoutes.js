const { Router } = require('express');
const {authenticateJwt}= require("../middleware/authenticateUser.js")
const router = Router();
const { createUser, userLogin,getMyChats} = require('../Controllers/userController');
router.post('/signup', createUser);
router.post('/login', userLogin);
router.get('/myChats', authenticateJwt,getMyChats);
module.exports = router;
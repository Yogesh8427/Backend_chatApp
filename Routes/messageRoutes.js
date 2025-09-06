const { Router } = require('express');
const { authenticateJwt } = require("../middleware/authenticateUser.js")
const router = Router();
const { getUserMessage, searchUser, getMyChats } = require('../Controllers/messageController');
router.post('/getMessage', authenticateJwt, getUserMessage);
router.get('/findUser', searchUser);
router.get('/myChats', authenticateJwt, getMyChats);
module.exports = router;
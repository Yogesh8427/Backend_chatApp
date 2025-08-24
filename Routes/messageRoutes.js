const { Router } = require('express');
const router = Router();
const { getUserMessage, searchUser } = require('../Controllers/messageController');
router.post('/getMessage', getUserMessage);
router.get('/findUser', searchUser);
module.exports = router;
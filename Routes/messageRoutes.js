const { Router } = require('express');
const router = Router();
const { getUsermessgae, searchUser } = require('../Controllers/messageController');
router.post('/getMessage', getUsermessgae);
router.get('/findUser', searchUser);
module.exports = router;
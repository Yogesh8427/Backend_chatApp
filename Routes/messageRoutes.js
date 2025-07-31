const { Router } = require('express');
const router = Router();
const { getUsermessgae } = require('../Controllers/messageController');
router.post('/getMessage', getUsermessgae);
module.exports = router;
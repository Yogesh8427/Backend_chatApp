const { Router } = require('express');
const router = Router();
const { createUser, userLogin,getMyChats} = require('../Controllers/userController');
router.post('/signup', createUser);
router.post('/login', userLogin);
router.get('/myChats', getMyChats);
module.exports = router;
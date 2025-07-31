const { Router } = require('express');
const router = Router();
const { createUser, userLogin, getAllusers } = require('../Controllers/userController');
router.post('/signup', createUser);
router.post('/login', userLogin);
router.get('/allusers', getAllusers);
module.exports = router;
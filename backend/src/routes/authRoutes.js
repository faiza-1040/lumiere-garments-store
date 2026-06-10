const express = require('express');
const router = express.Router();
const { registerUser, authUser, verifyEmail } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/verify/:token', verifyEmail);

module.exports = router;

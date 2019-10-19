const express = require('express');
const router = express.Router();
const user = require('../controllers/user');

router.post('/login', user.login);
router.post('/signup', user.signup);
router.post('/me', user.me);

module.exports = router;

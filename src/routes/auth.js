const express = require('express');
const router = express.Router();
const user = require('../controllers/user');

router.post('/login', user.login);
router.post('/signup', user.signup);
router.post('/recoveryPassword', user.recoveryPassword);
router.post('/changePassword', user.changePassword);
router.post('/me', user.me);

module.exports = router;

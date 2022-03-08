const express = require('express');
const { login, signup, logout, checkIsAvailable } = require('./auth.controller');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/username', checkIsAvailable);

module.exports = router;
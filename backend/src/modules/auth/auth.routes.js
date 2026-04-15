const express = require('express');
const { login } = require('./login.controller');
const { register } = require('./register.controller');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

module.exports = router;

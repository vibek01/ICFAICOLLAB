// In auth.routes.js
const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/auth.controller');
const { checkAuthForPublic } = require('../middlewares/auth.middleware');

router.post('/login', login);
router.get('/logout', logout);
router.get('/status', checkAuthForPublic);

module.exports = router;
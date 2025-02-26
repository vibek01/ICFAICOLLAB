// auth.routes.js
const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/auth.controller');
const { checkAuthForPublic } = require('../middlewares/auth.middleware');

router.post('/login', login);
router.post('/logout', logout); // Changed from GET to POST
router.get('/status', checkAuthForPublic);

module.exports = router;
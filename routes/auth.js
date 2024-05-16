const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/token', authController.login);
router.post('/refresh-token/:refreshToken/token', authController.refreshToken);
router.get('/validate/:accessToken', authController.validateAccessToken);

module.exports = router;
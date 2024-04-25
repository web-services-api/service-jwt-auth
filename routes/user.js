const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', userController.createUser);
router.put('/', authMiddleware.authenticateToken, userController.updateUser);
router.get('/', authMiddleware.authenticateToken, userController.getUser);

module.exports = router;

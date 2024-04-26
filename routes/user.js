const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.authenticateToken, userController.getUser);
router.post('/create', userController.createUser);
router.put('/update', authMiddleware.authenticateToken, userController.updateUser);

module.exports = router;

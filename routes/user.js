const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:id', authMiddleware.authenticateToken, userController.getUser);
router.post('/', authMiddleware.authenticateToken, userController.createUser);
router.put('/:id', authMiddleware.authenticateToken, userController.updateUser);

module.exports = router;

const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/user', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/users', authenticateToken, userController.getUsers);
router.get('/user/:id', authenticateToken, userController.getOneUser);
router.put('/user/:id', authenticateToken, userController.updateUser);
router.delete('/user/:id', authenticateToken, userController.deleteUser);

module.exports = router;

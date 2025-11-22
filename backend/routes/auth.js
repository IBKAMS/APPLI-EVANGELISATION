const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers, updateUser, deleteUser, resetPassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin', 'pasteur'), getAllUsers);
router.put('/users/:id', protect, authorize('admin', 'pasteur'), updateUser);
router.delete('/users/:id', protect, authorize('admin', 'pasteur'), deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  registerUser,
  loginUser
} = require('../controllers/authController');

// POST /auth/register
router.post('/register', [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], registerUser);

// POST /auth/login
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], loginUser);

module.exports = router;
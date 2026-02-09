const express = require('express');
const router = express.Router();





const authController = require('../controller/auth.controller')

router.post('/signup', authController.registerUser)

router.post('/login', authController.loginUser)

router.post('/logout', authController.logoutUser)

module.exports = router;
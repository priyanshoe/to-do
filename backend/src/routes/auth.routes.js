const express = require('express');
const router = express.Router();





const authController = require('../controller/auth.controller')

router.post('/sign-up', authController.registerUser)

router.post('/sign-in', authController.loginUser)

router.get('/sign-out', authController.logoutUser)

module.exports = router;
const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController.js')
const loginLimiter = require('../middleware/loginLimiter')

router.route('/login')
    .post(loginLimiter, authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

module.exports = router

module.exports = router
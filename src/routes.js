const authController = require('./app/controllers/authController')

const router = require('express').Router()


// Register new user
router.post('/register', authController.register)

// Authenticate user
router.post('/authenticate', authController.authenticate)

// Forgot password
router.post('/forgot_password', authController.forgot_password)

// Reset password
router.post('/reset_password', authController.reset_password) 



module.exports = router
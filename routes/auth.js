const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth.js')

const authorization=require("../middleware/auth.js")

router.post('/register', AuthController.register)

router.post('/login', AuthController.login)

router.post('/verifyemail', AuthController.fetchemail)

router.post('/refresh-token', AuthController.refreshToken)

router.post('/addinterests', AuthController.addinterests)

router.delete('/logout', AuthController.logout)

router.get('/fetchusername',AuthController.fetchusername)

router.post('/verifyCode',AuthController.verifyCode)
module.exports = router
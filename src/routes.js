const { Router } = require('express')

const HomeController = require('./controllers/HomeController')
const UserController = require('./controllers/UserController')

const router = Router()

// View routes
router.get('/home', HomeController.getHome)
router.get('/login', UserController.getLoginForm)
router.get('/cadastro', UserController.getSignUpForm)


// User Methods
router.post('/cadastro', UserController.createUser)
router.post('/login', UserController.loginUser)



module.exports = router
const express = require('express')
const router = express.Router({ mergeParams: true })

const wrapAsync = require('../utils/wrapAsync')
const expressError = require('../utils/expressError')

const User = require('../models/users')

const passport = require('passport')

const users = require('../controllers/users')

router.route('/register')
    .get(users.renderSignupForm)
    .post(wrapAsync(users.createUser))


router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), wrapAsync(users.userLogin))


router.get('/logout', users.logout)

module.exports = router;







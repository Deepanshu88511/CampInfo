const express = require('express')
const router = express.Router({ mergeParams: true })

const wrapAsync = require('../utils/wrapAsync')
const expressError = require('../utils/expressError')

const User = require('../models/users')

const passport = require('passport')

router.get('/register', (req, res) => {
    res.render('authentication/signup')
})


router.get('/login', (req, res) => {
    res.render('authentication/login')
})

router.post('/register', wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (password != confirmPassword) {
            req.flash('error', 'Password and Confirm password do not match')
            return res.redirect('/register')
        }

        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", `Hello ${username}, Welcome to camping!`)
            res.redirect('/campgrounds')
        })

    } catch (err) {
        req.flash("error", `${err.message}`)
    }
}))


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), wrapAsync(async (req, res) => {
    try {
        const { username, password } = req.body;
        req.flash("success", `Hello ${username}, Welcome to camping!`)
        res.redirect('/campgrounds')
    } catch (err) {
        req.flash("error", `${err.message}`)
    }
}))


router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
})





module.exports = router;
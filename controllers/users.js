const Campground = require('../models/campground');
const Reviews = require('../models/reviews');
const User = require('../models/users')


// sign up form rendering 

module.exports.renderSignupForm = (req, res) => {
    res.render('authentication/signup')
}


// login form rendering

module.exports.renderLoginForm = (req, res) => {
    res.render('authentication/login')
}


// sign up post request route

module.exports.createUser = async (req, res, next) => {
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
}


// login post route 

module.exports.userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        req.flash("success", `Hello ${username}, Welcome to camping!`)
        res.redirect('/campgrounds')
    } catch (err) {
        req.flash("error", `${err.message}`)
    }
}


// logout route

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
}
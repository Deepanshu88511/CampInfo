const Campground = require('../models/campground'); // Ensure the correct path to the Campground model

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in first");
        return res.redirect('/login');
    }
    next();
};

const isOwner = async (req, res, next) => {

    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground.owner.equals(req.user._id)) {
        req.flash('error', 'You don\'t have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();

};

module.exports = { isLoggedIn, isOwner };

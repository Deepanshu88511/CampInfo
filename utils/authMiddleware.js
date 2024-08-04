const Campground = require('../models/campground');
const { campgroundSchema, reviewSchema } = require('../Schemas')
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

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }
    else next()
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }
    else next()
}

module.exports = { isLoggedIn, isOwner, validateCampground, validateReview };

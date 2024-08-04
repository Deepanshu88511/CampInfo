const Campground = require('../models/campground')
const Reviews = require('../models/reviews')
const { campgroundSchema, reviewSchema } = require('../Schemas')

// review post route

module.exports.createReview = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const review = new Reviews(req.body.review)
    review.owner = req.user.id;
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Successfully posted review')
    res.redirect(`/campgrounds/${campground._id}`)
}

// review delete route

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Reviews.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}

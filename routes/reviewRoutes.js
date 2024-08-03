const express = require('express')
const router = express.Router({mergeParams:true})

const wrapAsync = require('../utils/wrapAsync')
const expressError = require('../utils/expressError')

const Campground = require('../models/campground')
const Reviews = require('../models/reviews')
const { reviewSchema } = require('../Schemas')




const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new expressError(msg, 400)
    }
    else next()
  }
// review

router.post('/', validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const review = new Reviews(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success','Successfully posted review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// delete review

router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Reviews.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted review')

    res.redirect(`/campgrounds/${id}`)
}))

module.exports=router;


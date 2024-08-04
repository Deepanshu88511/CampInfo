const express = require('express')
const router = express.Router({ mergeParams: true })

const wrapAsync = require('../utils/wrapAsync')
const expressError = require('../utils/expressError')

const Campground = require('../models/campground')
const Reviews = require('../models/reviews')
const { reviewSchema } = require('../Schemas')

const reviews=require('../controllers/reviews')

const { isLoggedIn } = require('../utils/authMiddleware')
const { isOwner } = require('../utils/authMiddleware')

const { validateReview } = require('../utils/authMiddleware')



// review

router.post('/', validateReview,isLoggedIn, wrapAsync(reviews.createReview))


// delete review

router.delete('/:reviewId', isLoggedIn, isOwner, wrapAsync(reviews.deleteReview))

module.exports = router;





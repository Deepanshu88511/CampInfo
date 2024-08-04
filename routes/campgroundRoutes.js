const express = require('express')
const router = express.Router({ mergeParams: true })

const campgrounds = require('../controllers/campgrounds')

const wrapAsync = require('../utils/wrapAsync')
const expressError = require('../utils/expressError')


const Campground = require('../models/campground')
const Reviews = require('../models/reviews')
const { campgroundSchema, reviewSchema } = require('../Schemas')

const { isLoggedIn } = require('../utils/authMiddleware')
const { isOwner } = require('../utils/authMiddleware')

const { validateCampground } = require('../utils/authMiddleware')



router.route('/')
    .get(wrapAsync(campgrounds.allCampgrounds))
    .post(validateCampground, isLoggedIn, wrapAsync(campgrounds.createCampground))

    
router.get('/new', isLoggedIn, campgrounds.renderNewForm)


router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(campgrounds.renderEditForm))


router.route('/:id')
    .get(isLoggedIn, wrapAsync(campgrounds.viewCampground))
    .put(validateCampground, isOwner, wrapAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isOwner, wrapAsync(campgrounds.deleteCampground))


module.exports = router;
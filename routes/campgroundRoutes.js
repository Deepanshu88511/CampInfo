const express = require('express')
const router = express.Router({ mergeParams: true })

const wrapAsync = require('../utils/wrapAsync')
const expressError = require('../utils/expressError')


const Campground = require('../models/campground')
const Reviews = require('../models/reviews')
const { campgroundSchema } = require('../Schemas')

const { isLoggedIn } = require('../utils/authMiddleware')
const { isOwner } = require('../utils/authMiddleware')





const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }
    else next()
}

router.get('/', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    if (!campgrounds) {
        req.flash("error", "Nothing to show here")
        return res.redirect('/campgrounds')
    }

    // console.log(campgrounds)
    res.render('campgrounds/allcampgrounds', { campgrounds, })
}))


router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/newcampground')
})



router.post('/', validateCampground, isLoggedIn, wrapAsync(async (req, res) => {
    const campgroundData = req.body.campground
    const campground = await new Campground(campgroundData)
    campground.owner = req.user._id
    // console.log(campgroundData)
    await campground.save()
    req.flash('success', 'Successfully created campground')
    res.redirect('/campgrounds')
}))


router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/editcampground', { campground })

}))

router.put('/:id', validateCampground, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true })
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)

}))

router.delete('/:id', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds')
}))



router.get('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'owner'
        }

    }).populate('owner')

    // console.log(campground)


    if (!campground) {
        req.flash('error', 'No campground exists like that')
        return res.redirect('/campgrounds')
    }
    // console.log(campground)
    res.render('campgrounds/campdetail', { campground })
}))

module.exports = router;
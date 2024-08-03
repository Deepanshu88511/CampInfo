const express = require('express')
const router = express.Router({mergeParams:true})

const wrapAsync=require('../utils/wrapAsync')
const expressError=require('../utils/expressError')

const Campground = require('../models/campground')
const Reviews = require('../models/reviews')
const {campgroundSchema}=require('../Schemas')

const {isLoggedIn}=require('../utils/authMiddleware')




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
    
    // console.log(campgrounds)
    res.render('campgrounds/allcampgrounds', { campgrounds,})
}))


router.get('/new', isLoggedIn , (req, res) => {
    res.render('campgrounds/newcampground')
})



router.post('/', validateCampground, wrapAsync(async (req, res) => {
    const campgroundData = req.body.campground
    const campground = await new Campground(campgroundData)
    // console.log(campgroundData)
    await campground.save()
    req.flash('success','Successfully created campground')
    res.redirect('/campgrounds')
}))


router.get('/:id/edit',isLoggedIn , wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/editcampground', { campground })

}))

router.put('/:id', validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true })
    req.flash('success','Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)

}))

router.delete('/:id',isLoggedIn , wrapAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted campground')
    res.redirect('/campgrounds')
}))



router.get('/:id',isLoggedIn , wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate('reviews')
    if(!campground){
        req.flash('error','No campground exists like that')
        return res.redirect('/campgrounds')
    }
    // console.log(campground)
    res.render('campgrounds/campdetail', { campground })
}))

module.exports=router;

const Campground = require('../models/campground')
const Reviews = require('../models/reviews')
const { campgroundSchema, reviewSchema } = require('../Schemas')

const expressError = require('../utils/expressError')

const { cloudinary } = require('../cloudinary')

// all campgrounds

module.exports.allCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({})
    if (!campgrounds) {
        req.flash("error", "Nothing to show here")
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/allcampgrounds', { campgrounds })
}

// new form rendering

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/newcampground')
}

// new campground post (creation)

module.exports.createCampground = async (req, res) => {
    const campgroundData = req.body.campground
    const campground = await new Campground(campgroundData)
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.owner = req.user._id
    await campground.save()
    req.flash('success', 'Successfully created campground')
    res.redirect('/campgrounds')
}



// render edit form for campground

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/editcampground', { campground })
}

// submitting or Updating edited campground (post request edit)

module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true })
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...images)
    await campground.save()

    // deleting images from cloudinary
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }

        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    // deleting images code ends


    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
    // console.log(req.body)
    // res.send("edited...")
}

// deleting a campground

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds')
}


// details page of campground

module.exports.viewCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'owner'
        }

    }).populate('owner')

    if (!campground) {
        req.flash('error', 'No campground exists like that')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/campdetail', { campground })
}


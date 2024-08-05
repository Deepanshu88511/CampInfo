const joi = require('joi')

module.exports.campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        price: joi.number().min(0).required(),
        // image:joi.string().required(),
        location: joi.string().required(),
        description: joi.string().required(),

    }).required(),
    deleteImages: joi.array()
})


// review joi

module.exports.reviewSchema = joi.object({
    review: joi.object({

        rating: joi.number().min(0).max(5).required(),
        comment: joi.string().required()
    }).required()
})
const { type } = require('express/lib/response')
const mongoose=require('mongoose')
const {Schema}=mongoose

const User=require('./users')

const reviewSchema= new Schema({
    comment:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },

    
})

module.exports=mongoose.model('Review',reviewSchema)
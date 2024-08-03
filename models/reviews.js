const { type } = require('express/lib/response')
const mongoose=require('mongoose')
const {Schema}=mongoose

const reviewSchema= new Schema({
    comment:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    }
    
})

module.exports=mongoose.model('Review',reviewSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const DisLikeSchema = new Schema({
    userId:{
        type:Object,
        required:true
    },
   postId:{
    type:Object,
    required:true
   },
   disLikedOn:{
    type:Date,
    required:true
   }
},
)




const DisLike = mongoose.model('dislike', DisLikeSchema)
module.exports = DisLike
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const LikeSchema = new Schema({
    userId:{
        type:Object,
        required:true
    },
   postId:{
    type:Object,
    required:true
   },
   likedOn:{
    type:Date,
    required:true
   }
},
)




const Like = mongoose.model('like', LikeSchema)
module.exports = Like
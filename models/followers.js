const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const FollowerSchema = new Schema({
    userId:{
        type:String,
        required:true
    },
   FollowedBy:{
    type:String,
    required:true
   },
   FollowedOn:{
    type:Date,
    required:true,
    default:Date.now()
   }
},
)




const Follower = mongoose.model('follower', FollowerSchema)
module.exports = Follower
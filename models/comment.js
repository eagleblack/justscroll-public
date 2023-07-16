const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const CommentSchema = new Schema({
    userId:{
        type:Object,
        required:true
    },
    createdOn:{
        type:Date,
        required:true
    },
    PostId:{
        type:Object,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
},
)




const Comment = mongoose.model('comment', CommentSchema)
module.exports = Comment
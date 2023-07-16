const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const PostSchema = new Schema({
    userId:{
        type:Object,
        required:true
    },
    fileURLS:{
        type:String,
        required:true
    },
    createdOn:{
        type:Date,
        required:true
    },
    caption:{
        type:String,
    },
    title:{
        type:String
    },
    totalLikes:{
        type:Number,
        required:true,
        default:0
    },
    totalDislikes:{
        type:Number,
        required:true,
        default:0
    },
    totalComments:{
        type:Number,
        required:true,default:0
    },
    totalScrolls:{
        type:Number,
        required:true,
        default:0
    },
    flaggedStatus:{
        type:Boolean,
        required:true,
        default:false
    },
   
    shopLink:{
        type:Object,
        required:false
        
    },
    commentingStatus:{
        type:Boolean,
        default:false
    },
    commentOn:{
        type:Boolean,
        default:true
    },
    donationOn:{
        type:Boolean,
        default:false
    },
    hashtags:{
        type:[]
    }

},
)




const Post = mongoose.model('post', PostSchema)
module.exports = Post
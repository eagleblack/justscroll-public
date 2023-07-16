const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const VerificationSchema = new Schema({
    userId:{
        type:Object,
        required:true
    },
    createdOn:{
        type:Date,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    instagramUsername:{
        type:String,
        required:true
    },
    category:{
        type:Array,
        required:true
    },
    status:{
        type:String,
        default:"PENDING"
    }
},
)




const Verification = mongoose.model('verification', VerificationSchema)
module.exports = Verification
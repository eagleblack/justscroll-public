const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const ScrollSchema = new Schema({
    userId:{
        type:Object,
        required:true
    },
   postId:{
    type:Object,
    required:true
   },
   scrolledOn:{
    type:Date,
    required:true
   }
},
)




const Scroll = mongoose.model('scroll', ScrollSchema)
module.exports = Scroll
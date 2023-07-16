const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const SaveSchema = new Schema({
    userId:{
        type:Object,
        required:true
    },
   postId:{
    type:Object,
    required:true
   },
   savedOn:{
    type:Date,
    required:true
   }
},
)




const Saved = mongoose.model('saved', SaveSchema)
module.exports = Saved
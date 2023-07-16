const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const DonateSchema = new Schema({
    userId:{
        type:Object,
        required:true
    },
   postId:{
    type:Object,
    required:true
   },
    donatedOn:{
    type:Date,
    required:true
   }
},
)




const Donate = mongoose.model('donate', DonateSchema)
module.exports = Donate
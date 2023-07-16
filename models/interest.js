const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const InterestSchema = new Schema({
   userInterest:{
      type:String,
      required:true
  },
  flag:{
   type:Boolean,
    default:false
  }
},
)




const Interest = mongoose.model('interest', InterestSchema)
module.exports = Interest
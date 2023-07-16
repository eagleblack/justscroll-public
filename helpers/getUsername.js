const createHttpError = require('http-errors')
const User = require('../models/user')

module.exports = {
 getUSerName:async(userId)=>{
  try {
    const doesExist = await User.findOne({ _id: userId })
   if(!doesExist)
   {
    return  createHttpError.NotFound("User Not Found")
   }
   else
   {
  
    return doesExist
   }
  } catch (error) {

  }
   
 }
}
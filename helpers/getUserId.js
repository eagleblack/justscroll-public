const createHttpError = require('http-errors')
const User = require('../models/user')

module.exports = {
 getuserId:async(username)=>{
  try {
    const doesExist = await User.findOne({ username: username })
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
   
 },
 getUserData:async(userId)=>{
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
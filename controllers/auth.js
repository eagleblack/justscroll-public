const createError = require('http-errors')
const User = require('../models/user')

const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  sendmail
} = require('../helpers/jwt_helpers')


module.exports = {
  register: async (req, res, next) => {
    try {
     const { username, password } = req.body
    if (!username || !password) throw createError.BadRequest()
     

      const doesExist = await User.findOne({ username: username })
      if (doesExist)
        throw createError.Conflict(`${username} is already been registered`)


      const user = new User(req.body)
      const savedUser = await user.save()
      const accessToken = await signAccessToken(savedUser.id)

      res.send({ accessToken })
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ username: username})
      if (!user) throw createError.NotFound('User not registered')

      const isMatch = await user.isValidPassword(password)
      if (!isMatch)
        throw createError.Unauthorized('Username/password not valid')

      const accessToken = await signAccessToken(user.id)
      const userData = await User.findOne({ username: username })

      res.send({ accessToken,userData })
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Invalid Username/Password'))
      next(error)
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)

      const accessToken = await signAccessToken(userId)
      const refToken = await signRefreshToken(userId)
      res.send({ accessToken: accessToken, refreshToken: refToken })
    } catch (error) {
      next(error)
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)
      client.DEL(userId, (err, val) => {
        if (err) {
          console.log(err.message)
          throw createError.InternalServerError()
        }
        console.log(val)
        res.sendStatus(204)
      })
    } catch (error) {
      next(error)
    }
  },
  fetchusername: async(req,res,next)=>{
    try {
      const username=req.query.username
      if(username==undefined || username=="")
      res.send({"error":{"status":400,"message":"Not Found"}})
      const doesExist = await User.findOne({ username: username })
      if (doesExist)
        throw createError.Conflict(`${username} is not available`)

      res.send({"error":{"status":200,"message":"Username Available"}})
    } catch (error) {
      next(error)
    }
  },
  fetchemail: async(req,res,next)=>{
    try {
      const { email,username } = req.body
      if(email==undefined || email=="")
      res.send({"error":{"status":400,"message":"Not Found"}})
      const doesExist = await User.findOne({ email: email })
      if (doesExist)
        throw createError.Conflict(`${email} verified with another account`)
        const code=Math.floor(100000 + Math.random() * 900000);
        const usercode=await User.updateOne({username:username},{verificationCode:code});
        const mail=await sendmail(email,code,username)
        if(mail)
        {
        
          
          res.send({"error":{"status":200}})
        }
        else
        {
          res.send({"error":{"status":500,"message":"Internal server error"}})
        }
      
    } catch (error) {
      next(error)
    }
  },
  addinterests:async(req,res,next)=>{
    const username=req.body.username
    const interest=req.body.interest
    const doesExist = await User.findOne({ username: username })
    if(doesExist)
    {
      const interests=await User.updateMany({username:username},{$set:{interest:interest}});
      const user = await User.findOne({ username: username})
      res.send({"status":200,"message":"okay","userData":user})
    }
    else
    {
      res.send({"status":400,"message":"username not available"})
    }
  },
  verifyCode:async(req,res,next)=>{
    const email=req.body.email
    const username=req.body.username
    const code=req.body.code;

    if(code=="" || username==undefined ||email==undefined)
    {
      res.send({"status":500,"Message":"Something Went wrong"})
    }
    else
    {
      const doesExist = await User.findOne({ username: username,verificationCode:code })
      if(doesExist==null)
      {
        res.send({"status":400,"Message":"Code is incorrect"})
      }
      else
      {
        const updateEmail=await User.updateOne({username:username},{verificationCode:"",email:email,isEmailVerified:true});
  
        res.send({"status":200, "Message":"okay"})
      }
    }
  },
  
}
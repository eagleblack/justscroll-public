const createError = require('http-errors')
const JWT = require('jsonwebtoken')
 const Authorization=(req,res,next)=>{
    
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
  
    JWT.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        return next(createError.Unauthorized(err))
      }
      req.payload = payload
      
      next()
    })

}

module.exports=Authorization
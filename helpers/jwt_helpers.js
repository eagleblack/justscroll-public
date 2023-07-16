const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const nodemailer =require("nodemailer");
const User = require('../models/user');
var transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'admin@contetor.in', // your domain email address
    pass: 'Admin@contetor.in1' // your password
  },
  maxConnections: 5,
  maxMessages: 200
});
async function wrapedSendMail(mailOptions){
  return new Promise((resolve,reject)=>{
   

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
     
    reject(false) // or use rejcet(false) but then you will have to handle errors
  } 
 else {
     
     resolve(true);
  }
 });
 })
}
module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.ACCESS_TOKEN_SECRET
      const options = {
       
        issuer: 'justScroll.com',
        audience: userId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
          return
        }
        resolve(token)
      })
    })
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
        return next(createError.Unauthorized(message))
      }
      req.payload = payload
      next()
    })
  },
   sendmail:async(email,usercode,username)=>{
    
    var mailOptions = {
      from: "admin@contetor.in",
      to: email,
      subject: "Contetor Verify Your email",
       html:`
       <div style="width:100%;background-color:white;text-align:center">
       <p>Welcome ${username} to just Scroll.</p>
       <p>Your email verification code is </p>
       <h2>${usercode}</h2>
       </div>`

         };
    let resp= await wrapedSendMail(mailOptions);
    // log or process resp;
    if(resp)
    {
     
      return true
    }
    else
    {
      return false
    }
}
}
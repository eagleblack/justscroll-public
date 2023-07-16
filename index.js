const express=require("express")
const morgan=require("morgan")
const AuthRoute = require('./routes/auth')
const PostRoute = require('./routes/post')
const UserRoute = require('./routes/user')
const AdminRoute = require('./routes/admin')
const AddPostRoute=require('./routes/addPost')
const cors = require('cors')

require('./helpers/init_mongodb')
const createError=require("http-errors")
require('dotenv').config();
var bodyParser = require('body-parser');
const User = require("./models/user")


const app=express();
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'))
app.use("/uploads", express.static(__dirname + '/uploads'));
app.use("/getImg", express.static(__dirname + '/uploads'));
app.get('/', async(req,res,next)=>{
    res.send("Hello")
})
app.get('/', async(req,res,next)=>{
  res.send("Hello")
})
app.get('/update', async(req,res,next)=>{
  const now=  new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
 const data= await User.updateMany({$set:{dailyDonationCoin:10,coinLastUpdate:now}});
 if(data)res.send(200)
 else res.send(400)

})
app.use('/auth',AuthRoute)
app.use('/post',PostRoute)
app.use('/addPost/',AddPostRoute)
app.use('/user',UserRoute)
app.use('/adminAll',AdminRoute)


app.use(async (req, res, next) => {
    next(createError.NotFound())
  })
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    })
  })

const port=process.env.port || 3000;

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})
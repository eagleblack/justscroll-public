const express = require('express')
const router = express.Router()
const Interest=require('../models/interest')
const Verification = require('../models/verification')
const User = require('../models/user')
const PostCantroller = require('../controllers/post.js')
const authorization=require("../middleware/auth.js")
const multer  = require('multer')
const { fork,spawn } = require("child_process");
const createError = require('http-errors')
const AWS= require('aws-sdk')
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const fs = require("fs");
const Post = require('../models/post.js')
require('dotenv').config(); 
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const { VALID_VIDEO_EXTENSIONS } = require( '../constants.js');
const  { v4: uuidv4 } = require( 'uuid');
const mime = require( 'mime-types');
const path = require('path');
const values = require('@hapi/joi/lib/values.js')
const { result } = require('@hapi/joi/lib/base.js')
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECREAT_KEY
});
var s3 = new AWS.S3();
router.post('/updateInterest',async (req, res,next) => {
    const {interest} =req.body
    console.log(interest)
    const doesExist = await Interest.findOne({ userInterest: interest })

    if(doesExist)
    {
        res.send({status:500,message:'Already Exists'})
    }
    else

    {   
        const interestSave={userInterest:interest}
        const InterestNew= new Interest(interestSave)
        const savedInterest = await InterestNew.save()
        
        res.send({status:200,message:"Added",data:savedInterest})
    }
})

router.get('/AllInterest',async (req, res,next) => {
    const interest= await Interest.find() 
    res.send(JSON.stringify(interest))
    
})
router.post('/deleteInterest',async (req, res,next) => {
    const interest= await Interest.deleteOne({userInterest:req.body.userInterest})
    res.send({status:200})
    
})
router.get('/fetchPendingVerification',async (req, res,next) => {
    const verification= await Verification.find({status:'PENDING'}) 
    res.send(JSON.stringify(verification))
    
})
router.post('/submitCreatorVerification',async (req, res,next) => {
  const {username,accept}=req.body
  if(accept=="ACCEPT")
  {
    const usercode=await User.updateOne({username:username},{isCreator:true});
  }
  res.send({status:true})
  
 
    
})
router.post('/createCretor',async (req, res,next) => {
    const {username,password}=req.body
    if (!username || !password) throw createError.BadRequest()
     

    const doesExist = await User.findOne({ username: username })
    if (doesExist)
      throw createError.Conflict(`${username} is already been registered`)
    const data={username:username,password:password,isCreator:true}

    const user = new User(data)
   const savedUser = await user.save()
    
   
      
  })
  router.post('/createUser',async (req, res,next) => {
    const {username,password}=req.body
    if (!username || !password) throw createError.BadRequest()
     

      const doesExist = await User.findOne({ username: username })
      if (doesExist)
        throw createError.Conflict(`${username} is already been registered`)


      const user = new User(req.body)
      const savedUser = await user.save()
       res.send({status:true})
    
   
      
  })
  router.post('/AddPost',upload.any(), async (req, res,next) => {
    const file = req.files
    if (!file) {
        return res.send({ error: 'No input file received. Please send video file in file in application/form-data format.' });
    }
     const {username,title}=req.body
     const doesExist = await User.findOne({ username: username })
   
     if (doesExist)
     {
   
     const userId=doesExist._id;
     const {  originalname, encoding, mimetype, size,buffer } = file[0];
     
     const extension = mime.extension(mimetype);
     if (!extension || !VALID_VIDEO_EXTENSIONS.includes(extension)) {
         return res.send({ error: 'Video format is not supported.' });
     }
     const videoId = uuidv4();
     fs.mkdirSync(path.resolve('uploads', videoId));
     const videoFilePath = path.resolve('uploads', `${videoId}/${videoId}.${extension}`);
     const thumbnailFilePath = path.resolve('uploads', `${videoId}/${videoId}.jpeg`);
     fs.writeFileSync(videoFilePath, buffer);
     fs.writeFileSync(thumbnailFilePath, file[1].buffer);
     const S3_URL=`https://justscroll-s3-amazon.s3.ap-south-1.amazonaws.com/posts`
     const createHLSVOD = spawn('bash', ['create-hls-vod.sh', videoId, extension, S3_URL]);
     createHLSVOD.stdout.on('data', d => console.log(`stdout info: ${d}`));
     createHLSVOD.stderr.on('data', d => console.log(`stderr error: ${d}`));
     createHLSVOD.on('error', d => console.log(`error: ${d}`));
     createHLSVOD.on('close', async code => {
         //fs.unlinkSync(`uploads/${videoId}/${videoId}.${extension}`,(err) => {})
          
           // remove the local folder
           // trigger uploading the contents of video into s3 bucket now
            const rjs=await uploadPromiseNew(videoId).then(async reult=>{
             try {
                 postBody={
                     userId:userId,
                     fileURLS:videoId,
                     createdOn:new Date(),
                     commentOn:true,
                     donationOn:true,
                     totalLikes:0,
                     
                     
                 }
                 const post = new Post(postBody)
                 const savedPost = await post.save();
                 res.json({
                     success: true,
                     statusCode: 200,});
 
             } catch (error) {
                  console.log(error)
             }
           
            })
            
           
     });
     }
     else
     {
      res.send({status:401})
     }
    })
  const uploadPromiseNew=async(videoId)=>{
    const readFile = fs.readdirSync(path.resolve('uploads', videoId))
     const  uploadPromises = [readFile.map(file => new Promise(async (resolve, reject) => {
        try {
            const key=`posts/${videoId}/${file}`
            const params = {
                Body:fs.createReadStream(`uploads/${videoId}/${file}`),
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
              };
              s3.upload(params, async function (err, data) {
                fs.unlinkSync(`uploads/${videoId}/${file}`,(err) => {
                })
            })
        } catch (err) {
           
        }
        resolve(true)
    }))]
    await Promise.all(uploadPromises).then(result=>{
      
    }) 

}
module.exports = router
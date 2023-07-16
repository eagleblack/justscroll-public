const express = require('express')
const router = express.Router()
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
router.post('/submitPost', authorization , upload.any(), async (req, res,next) => {
    const file = req.files
    if (!file) {
        return res.send({ error: 'No input file received. Please send video file in file in application/form-data format.' });
    }
    const {  originalname, encoding, mimetype, size,buffer } = file[0];
    const extension = mime.extension(mimetype);
    if (!extension || !VALID_VIDEO_EXTENSIONS.includes(extension)) {
        return res.send({ error: 'Video format is not supported.' });
    }
    const videoId = uuidv4();
    fs.mkdirSync(path.resolve('uploads', videoId));
    const videoFilePath = path.resolve('uploads', `${videoId}/${videoId}.${extension}`);
    fs.writeFileSync(videoFilePath, buffer);
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
                    userId:req.payload.aud,
                    userType:"CREATOR",
                    fileURLS:videoId,
                    createdOn:new Date(),
                    caption:req.body?.caption,
                    tittle:req.body.title,
                    commentOn:req.body.commenting,
                    donationOn:req.body.wallet,
                    totalLikes:0,
                    hashtags:req.body.hashtags,
                    
                }
                const post = new Post(postBody)
                const savedPost = await post.save();
                res.json({
                    success: true,
                    statusCode: 200,});

            } catch (error) {
                 
            }
          
           })
           
          
    });
  
    
})
router.get("/process/:video", async (req, res,next) => {
    res.send({status:200,message:"UPLOADED SUCCESSFULLY"})
      
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
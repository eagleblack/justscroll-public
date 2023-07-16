const express = require('express')
const router = express.Router() 
const PostCantroller = require('../controllers/post.js')
const authorization=require("../middleware/auth.js")
const multer  = require('multer')
const { fork } = require("child_process");
const createError = require('http-errors')
const AWS= require('aws-sdk')
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const fs = require("fs");
const Post = require('../models/post.js')
require('dotenv').config(); 
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    sendmail  
  } = require('../helpers/jwt_helpers')
 
const storage = multer.diskStorage({
 destination: function(req, file, cb) { 
    let dir = `uploads`; // specify the path you want to store file
    //check if file path exists or create the directory
    fs.access(dir, function(error) {
    if (error) {
   
    return fs.mkdir(dir, error => cb(error, dir));
    } else {
  
    return cb(null, dir);
    }
    });
       
},
filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // added Date.now() so that name will be unique
    },
});
const upload = multer({ storage: storage})
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECREAT_KEY
  });
var s3 = new AWS.S3();

router.get('/stremData/:fileUrl', async (req, res,next) => {
  var fileUrl = req.params.fileUrl;

  const objectKey="posts/"+fileUrl+"/"+fileUrl+".mp4";
  console.log(objectKey)
  const s3Link=`https://justscroll-s3-amazon.s3.ap-south-1.amazonaws.com/posts/`
  const params = {
    Bucket:process.env.AWS_BUCKET_NAME,
    Key: objectKey 
  }
  const data = s3.getObject(params)
  .on('httpHeaders',function(statusCode,headers){
    res.set('Content-Length',headers['content-length'])
    res.set('Content-Type',headers['content-type'])
    res.set('Cache-Cantrol',headers['no-store'])
    this.response.httpResponse.createUnBufferedStream()
    .pipe(res)
  })
  .send();  

 
 
  

})
router.get('/getPosts/:pageNumber',authorization, PostCantroller.getPosts)
router.get('/getUserPosts',authorization, PostCantroller.getUserPosts)
router.get('/getUserPostsGeneral/:id',authorization, PostCantroller.getUserPostsGeneral)
router.post('/likepost',authorization, PostCantroller.likePost)
router.post('/dislikepost',authorization, PostCantroller.disLikePost)
router.post('/scrollpost',authorization, PostCantroller.scrollPost)
router.post('/postComment',authorization, PostCantroller.postComment)
router.post('/savePost',authorization, PostCantroller.savePost)
//savePost
router.get('/getComment/:postId', PostCantroller.getComment)

module.exports = router

const express = require('express')
const router = express.Router()
const {getuserId, getUserData}=require("../helpers/getUserId")
const Authorization = require('../middleware/auth')
const multer  = require('multer')
const sharp = require('sharp');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
    let dir = `uploads/`; // specify the path you want to store file
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
const fs = require("fs");

const User = require('../models/user')
const Verification = require('../models/verification')
const Follower=require("../models/followers")
const { default: mongoose } = require('mongoose')

router.get('/getUserData',Authorization,async (req,res,next)=>{
    const getUserDataNow=await getUserData(req.payload.aud)
    res.send(JSON.stringify(getUserDataNow))
})

router.get('/getUserDataGeneral/:id',Authorization,async (req,res,next)=>{
   let id=req.params.id
   const getUserDataNow=await getUserData(id)
   let newData=getUserDataNow.toObject()
   const findFollowing=await Follower.findOne({userId:id,FollowedBy:req.payload.aud}).then(result=>{
      if(result)
      {
         newData.isFollowing=true
     
      }
      else
      {
         newData.isFollowing=false
      }
   })
   
   res.send(JSON.stringify(newData))
   
  
})
router.post('/editProfile',Authorization,upload.any(),async (req,res,next)=>{
   const file = req.files;
   let filename
   const body=req.body;
   console.log(body)
   const _id=req.payload.aud
   if(!file)
{
 

}
else
{
 try {
   await sharp('./uploads/'+file[0]?.filename)
   .resize({
     
       width: 80,
       height: 80
   })
   .jpeg({ quality: 80 })
   .toFile('./uploads/profilepic/'+file[0]?.filename)
   fs.unlink('./uploads/'+file[0]?.filename, (err) => {
      if (err) {
       
      }
    });
    filename=file[0]?.filename
    const data= await User.updateOne({_id:_id},{$set:{profilePic:filename}});
    
 } catch (error) {
     console.log(error)
 }
}
try {
   const setUpdate={}
    if(body.username!==undefined){
       setUpdate.username=body.username
    }
    if(body.name!==undefined){
       setUpdate.name=body.name
    }
    if(body.bio!==undefined){
       setUpdate.bio=body.bio
    }
    if(body.link!==undefined){
      setUpdate.link=body.link
   }
   else
   {
      setUpdate.link=[]
   }
    const data= await User.updateOne({_id:_id},{$set:setUpdate});
   
    } catch (error) {
     console.log(error)
    }
     res.send({
      fileUrl:filename,
      success: true,
      statusCode: 200,
      });
  
})
router.get('/checkEmailStatus',async (req,res,next)=>{
   let username=req.query.username
   if(username==undefined || username=="")
   res.send({"error":{"status":400,"message":"Not Found"}})
   const doesExist = await User.findOne({ username: username })
   if(doesExist!==null)
   {
      if(!doesExist.isEmailVerified)res.send({status:401,message:' Email Not Verified !! \n  Goto JustScroll App -> Profile -> Edit Profile-> Add Email and try again'})
      const userVerificationexits = await Verification.findOne({ username: username })
      if(userVerificationexits)
      {
         res.send({status:409,message:'You have already submited for verification!!'})
      }
      else
      {
            res.send({status:200,message:'Ok'})
      }
    

   }
   else res.send({status:400,message:'User Not Found !! \n Please Download the app and signup to continue'})
 
})
router.post('/verifyEmail/',Authorization,async (req,res,next)=>{
   console.log("Hello")
})
router.post('/followUser/',Authorization,async (req,res,next)=>{
   const {userId,isfollowing}=req.body;
   if(isfollowing)
   {
      const deleteResult = await Follower.deleteOne({userId:userId,FollowedBy:req.payload.aud,});
      res.send({status:'204',message:"Unfollowed"})
   }
   else
   {
      postBody={
         userId:userId,
         FollowedBy:req.payload.aud,
         FollowedOn:new Date()
         
     }
     const follower = new Follower(postBody)
     const savedfollowe = await follower.save();
     res.send({status:'204',message:"Followed"})
   }
})
router.post('/submitVerification/',async (req,res,next)=>{
   const username=req.body.username
   const interest=req.body.interest
   const instagramUsername=req.body.instagramUsername
   if(username==undefined || interest==undefined || instagramUsername==undefined)
   {
      res.send({status:401})
   }
   else
   {
      const userData=await getuserId(username);
      const userId=userData._id;
      const email=userData.email
      body={
         createdOn:new Date(),
         userId:userId,
         username:username,
         category:interest,
         instagramUsername:instagramUsername
         
     }
     const verification = new Verification(body)
     const veificationSave = await verification.save();
     res.send({
         success: true,
         statusCode: 200,
      data:veificationSave});

   }
   
})
module.exports = router
/*
const filename=undefined;
const body=req.body;
const _id=req.payload.aud
if(!file)
{
 

}
else
{
 try {
   
    const filename=file[0].filename
    const data= await User.updateOne({_id:_id},{$set:{profilePic:filename}});
    console.log(data)
 } catch (error) {
      res.json(error)
 }
}

 try {
const setUpdate={}
 if(body.username!==undefined){
    setUpdate.username=body.username
 }
 if(body.name!==undefined){
    setUpdate.name=body.name
 }
 if(body.bio!==undefined){
    setUpdate.bio=body.bio
 }
 const data= await User.updateOne({_id:_id},{$set:setUpdate});
 console.log(data)
 } catch (error) {
  console.log(error)
 }*/
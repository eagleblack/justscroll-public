const createError = require('http-errors')
const {getuserId}=require("../helpers/getUserId")
const mongoose = require('mongoose')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  sendmail
} = require('../helpers/jwt_helpers')
const Post = require('../models/post')
const getUsername = require('../helpers/getUsername')
const { compareSync } = require('bcrypt')
const Like=require("../models/like")
const DisLike=require("../models/dislike")
const Scroll=require("../models/scroll")
const Comment=require("../models/comment")
const Follower=require("../models/followers")
const Saved=require("../models/saved")
const User = require('../models/user')
module.exports = {
  getUserPosts: async (req, res, next) => {
 
      
      //const data= getUserDatafromId(getUserData._id)
     const userIdstring=req.payload.aud
     const userId=req.payload.aud;
     //const data= await Post.find({userId:userIdstring}).sort({createdOn:-1})
     const data = await Post.aggregate([
     
      {
        $match:
      {
         "userId":userIdstring 
      }
    },
      { "$addFields": { "userId": { "$toObjectId": "$userId" }}},
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField:"_id",
          as: "userData"
        }
      },
      {
        $sort: { createdOn:-1 }
      }
    ])
  
    const newPostData= data.map(async(item,id)=>{
      const itemid=item._id
      const postid=JSON.stringify(itemid)
      
      const findLike=await Like.findOne({userId:userId,postId:itemid.toString()})
      if(findLike)
      {
        item.isLiked=true
      }
      else
      {
        item.isLiked=false
      }
      const findDisLike=await DisLike.findOne({userId:userId,postId:itemid.toString()})
      if(findDisLike)
      {
      item.isDisliked=true
      }
      else
      {
        item.isDisliked=false
      }
      const scroll=await Scroll.findOne({userId:userId,postId:itemid.toString()})
      if(scroll)
      {
      item.isScroll=true
      }
      else
      {
        item.isScroll=false
      }
      return item
    
    })
  const ownerInformation = await Promise.all(newPostData)
 
  res.send(JSON.stringify(ownerInformation))
 },
 getPosts:async(req,res,next)=>{
  const userId=req.payload.aud;
  let pageNumber = 5*parseInt(req.params.pageNumber);
  
  const postdata = await Post.aggregate([
    { "$addFields": { "userId": { "$toObjectId": "$userId" }}},
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField:"_id",
        as: "userData"
      }
    },
   
    {
      $sort: { createdOn:-1 }
   },
   { "$skip": pageNumber },
   { "$limit": 5 },
   
   
  ])
  const newPostData= postdata.map(async(item,id)=>{
    const itemid=item._id 
    const userIdFollowed=item.userId
    const postid=JSON.stringify(itemid)
    
    const findLike=await Like.findOne({userId:userId,postId:itemid.toString()})
    if(findLike)
    {
      item.isLiked=true
    }
    else
    {
      item.isLiked=false
    }
    const findDisLike=await DisLike.findOne({userId:userId,postId:itemid.toString()})
    if(findDisLike)
    {
    item.isDisliked=true
    }
    else
    {
      item.isDisliked=false
    }
    const scroll=await Scroll.findOne({userId:userId,postId:itemid.toString()})
    if(scroll)
    {
    item.isScroll=true
    }
    else
    {
      item.isScroll=false
    }
    const findFollowing=await Follower.findOne({userId:userIdFollowed,FollowedBy:userId})
    if(findFollowing)
    {
    item.isFollowing=true
    }
    else
    {
      item.isFollowing=false
    }
    const saved=await Saved.findOne({userId:userId,postId:itemid.toString()})
    if(saved)
    {
    item.isSaved=true
    }
    else
    {
      item.isSaved=false
    }
    return item
  
  })
 
  const ownerInformation = await Promise.all(newPostData)
 
  res.send(JSON.stringify(ownerInformation))
  
},
getComment:async(req,res,next)=>{
  const postId=req.params.postId
  
  const doesExist = await Comment.aggregate(
    [
      {
        $match:
      {
         "PostId":postId 
      }
    },
      {
        $lookup:{
          "from": "users",
          "let": { "userId": "$_id" },'let': {"userId": {$toObjectId: "$userId"}}, 
          "pipeline": [
           {
             $match:{"$expr": {
                  "$eq": [
                      "$_id",
                      "$$userId"
                  ]
              }
           }
           }
          ],
          "as": "userData"
        }
      }
    ]
  );

 res.send(JSON.stringify(doesExist))
},
postComment:async(req,res,next)=>{
 const comment=req.body.comment
 const postId=req.body.postId

 const userId=req.payload.aud
 let commentBody={
  userId:userId,
  createdOn:new Date(),
  comment:comment,
  PostId:postId
  
}
 const commentPush = new Comment(commentBody)
 const savedComment = await commentPush.save();
 const userData=[];
 const newObj=savedComment.toObject();

 newObj.isSaved=true
 const user=await User.findOne({_id:userId})
 userData[0]=user
 newObj.userData=userData
 res.send(JSON.stringify(newObj))

  
},
getUserPostsGeneral:async(req,res,next)=>{
  var userIdstring = req.params.id;
  const userIdnew=req.params.id;
  const userId=req.payload.aud;
  const data = await Post.aggregate([
     
    {
      $match:
    {
       "userId":userIdstring 
    }
  },
    { "$addFields": { "userId": { "$toObjectId": "$userIdnew" }}},
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField:"_id",
        as: "userData"
      }
    },
    {
      $sort: { createdOn:-1 }
    }
  ])
  
  const newPostData= data.map(async(item,id)=>{
    const itemid=item._id 
    const userIdFollowed=item.userId
    const postid=JSON.stringify(itemid)
    
    const findLike=await Like.findOne({userId:userId,postId:itemid.toString()})
    if(findLike)
    {
      item.isLiked=true
    }
    else
    {
      item.isLiked=false
    }
    const findDisLike=await DisLike.findOne({userId:userId,postId:itemid.toString()})
    if(findDisLike)
    {
    item.isDisliked=true
    }
    else
    {
      item.isDisliked=false
    }
    const scroll=await Scroll.findOne({userId:userId,postId:itemid.toString()})
    if(scroll)
    {
    item.isScroll=true
    }
    else
    {
      item.isScroll=false
    }

    const saved=await Saved.findOne({userId:userId,postId:itemid.toString()})
    if(saved)
    {
    item.isSaved=true
    }
    else
    {
      item.isSaved=false
    }
    return item
  
  })
 
  const ownerInformation = await Promise.all(newPostData)
 
  res.send(JSON.stringify(ownerInformation))
 },
 likePost:async(req,res,next)=>{
    const isLiked=req.body.isLiked;
    const postId=req.body.postId;
    const userId=req.payload.aud;
    const dislike=req.body.isDislike 
    let data;
    let likeUpdatedata;
    if(!isLiked){
      if(dislike)
      {
        likeUpdatedata=await Post.updateOne({_id:postId},{$inc:{totalDislikes:-1}});
        const deleteResult = await DisLike.deleteOne({postId:postId,userId:userId});
        likeUpdatedata=await Post.updateOne({_id:postId},{$inc:{totalLikes:1}});
        postBody={
          postId:postId,
          userId:userId,
          likedOn:new Date()
          
      }
      const like = new Like(postBody)
      const savedLike = await like.save();
      }
      else
      {
     likeUpdatedata=await Post.updateOne({_id:postId},{$inc:{totalLikes:1}});
        postBody={
          postId:postId,
          userId:userId,
          likedOn:new Date()
          
      }
      const like = new Like(postBody)
      const savedLike = await like.save();
      }
      
      
    } 
    else
    {
      likeUpdatedata=await Post.updateOne({_id:postId},{$inc:{totalLikes:-1}});
      const deleteResult = await Like.deleteOne({postId:postId,userId:userId});
    }
    res.send({"error":{"status":200,"message":"Successfull"}})
  
   
 },
 disLikePost:async(req,res,next)=>{
  const isDislike=req.body.isDislike;
  const postId=req.body.postId;
  const userId=req.payload.aud;
  const isLiked=req.body.isLiked
  let data;
  if(!isDislike){
    if(isLiked)
    {
      likeUpdatedata=await Post.updateOne({_id:postId},{$inc:{totalLikes:-1}});
      const deleteResult = await Like.deleteOne({postId:postId,userId:userId});
      disLikeUpdatedata=await Post.updateOne({_id:postId},{$inc:{totalDislikes:1}});
      postBody={
        postId:postId,
        userId:userId,
        disLikedOn:new Date()
        
    }
    const dislike = new DisLike(postBody)
    const savedDisLike = await dislike.save();
    }
    else
    {
    disLikeUpdatedata=await Post.updateOne({_id:postId},{$inc:{totalDislikes:1}});
      postBody={
        postId:postId,
        userId:userId,
        disLikedOn:new Date()
        
    }
    const dislike = new DisLike(postBody)
    const savedDisLike = await dislike.save();
    }
  } 
  else
  {
    likeUpdatedata=await Post.updateOne({_id:postId},{$inc:{totalDislikes:-1}});
    const deleteResult = await DisLike.deleteOne({postId:postId,userId:userId});
  }
  res.send({"error":{"status":200,"message":"Successfull"}})
},
scrollPost:async(req,res,next)=>{
  const isScroll=req.body.isScroll;
  const postId=req.body.postId;
  const userId=req.payload.aud;
  let data;
  if(!isScroll){
    likeUpdatedata=await Post.updateOne({_id:postId},{$inc:{totalScrolls:1}});
   
    postBody={
      postId:postId,
      userId:userId,
      scrolledOn:new Date()
      
  }
  const scroll = new Scroll(postBody)
  const savedscroll = await scroll.save();
   
  } 
  else
  {
    likeUpdatedata=await Post.updateOne({_id:postId},{$inc:{totalScrolls:-1}});
    const deleteResult = await Scroll.deleteOne({postId:postId,userId:userId});
  }
 
  res.send({"error":{"status":200,"message":"Successfull"}})
},
savePost:async(req,res,next)=>{
  const isSaved=req.body.isScroll;
  const postId=req.body.postId;
  const userId=req.payload.aud;
  
  if(!isSaved){
  
    postBody={
      postId:postId,
      userId:userId,
      savedOn:new Date()
      
  }
  const saved = new Saved(postBody)
  const savePost = await saved.save();
   
  } 
  else
  {
    const deleteResult = await Saved.deleteOne({postId:postId,userId:userId});
  }
 
  res.send({"error":{"status":200,"message":"Successfull"}})
}
 
}
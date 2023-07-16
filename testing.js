  const extension = mime.extension(mimetype);
    
    /**
     * Check for extension
     */
    if (!extension || !VALID_VIDEO_EXTENSIONS.includes(extension)) {
        return res.send({ error: 'Video format is not supported.' });
    }
    const videoId = uuidv4();
    /** 
     * Save the incoming file in uploads folder
     */
    fs.mkdirSync(path.resolve('uploads', videoId));
    const videoFilePath = path.resolve('temp', `${videoId}.${extension}`);
    fs.writeFileSync(videoFilePath, buffer); 
    
    const child = fork("video.js");
    const newname=`${videoId}.${extension}`
    child.send({name:newname,videoId:videoId}); 
        
    // Listen for message from child process   
    child.on("message", async(message) => {  
       if(message.statusCode==200)
       { 
        const createHLSVOD = spawn('bash', ['create-hls-vod.sh', videoId, extension, S3_URL]);
        createHLSVOD.stdout.on('data', d => console.log(`stdout info: ${d}`));
        createHLSVOD.stderr.on('data', d => console.log(`stderr error: ${d}`));
        createHLSVOD.on('error', d => console.log(`error: ${d}`));
        createHLSVOD.on('close', code => {
            res.send({status:200,message:"UPLOADED SUCCESSFULLY"})
        });
        if(!file[1])
    {

    }
    else
    {
        
        const extension_thumb = mime.extension(file[1].mimetype);
        const thumbnailpath = path.resolve(`uploads/${videoId}/`, `thumbnail.${extension_thumb}`);
        fs.writeFileSync(thumbnailpath, file[1].buffer); 
    }
    if(!file[2])
    {

    }
    else
    {
        
        const extension_shop = mime.extension(file[2].mimetype);
        const shoppath = path.resolve(`uploads/${videoId}/`, `shopimg.${extension_shop}`);
        fs.writeFileSync(shoppath, file[2].buffer); 
    }
        postBody={
            userId:req.payload.aud,
            userType:"CREATOR",
            fileURLS:[videoId],
            createdOn:new Date(),
            caption:"",
            totalLikes:0,
            
        }
        const post = new Post(postBody)
        const savedPost = await post.save();

       } 
    })
    
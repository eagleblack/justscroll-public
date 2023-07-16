if (!file) {
    const error = new createError("Please add a content to upload");
    error.httpStatusCode = 400;
    return next(error);
    }
    else
    {
    
        const child = fork("video.js");
        // Send message to child process
        child.send({ name: file.filename });
        // Listen for message from child process
        child.on("message", (message) => {
        const { statusCode, text } = message;
         if(statusCode==200)
         {
            // thumbnail uploads/files[1].filename
            // content temp/files[0].filename
            // Store Img temp/files[2].filename
            const key="posts/"+req.files[0].filename
            const params = {
                ACL: "public-read-write",
                Body:fs.createReadStream("temp/"+req.files[0].filename),
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
              };
              s3.putObject(
                (params,
                (err, data) => {
                  if (err) {
                   console.log(err)
                  }
                  res.status(200).send(data);
                })
              );
        
                
         }
         else
         {
            res.status(statusCode).send(text);
         }
        });
       

    }
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECREAT_KEY,
        region: process.env.AWS_REGION,
        Bucket: process.env.AWS_BUCKET_NAME,
      })
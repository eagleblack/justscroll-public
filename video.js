const fs = require("fs");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

process.on("message", (payload) => {
    //const buffer = Buffer.from(JSON.parse(payload.message).data);
    const name=payload.name;
    const videoId=payload.videoId;
    let tempFilePath="temp/"+name
    const endProcess = (endPayload) => {
        const { statusCode, text } = endPayload;
        
          // Remove temp file
          fs.unlink(tempFilePath, (err) => {
            if (err) {
              process.send({ statusCode: 500, text: err.message });
            }
          });
          // Format response so it fits the api response
          process.send({ statusCode, text });
          // vEnd process
          process.exit();
        };
  ffmpeg(tempFilePath)
  .fps(30)
  .addOptions(["-crf 28"])
  .on("end", () => {  
    endProcess({ statusCode: 200, text: "Success" });
  })
  .on("error", (err,stdout,stderr) => {
        console.log('Stdout: %o', stdout);
        console.log('Stderr: %o', stderr);
    endProcess({ statusCode: 500, text: err.message });
  })
  .save(`./uploads/${videoId}/${name}`);
})
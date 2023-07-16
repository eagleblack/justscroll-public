const fs = require("fs");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

process.on("message", (payload) => {
const { name } = payload;
const endProcess = (endPayload) => {
const { statusCode, text } = endPayload;
 let tempFilePath="uploads/"+name
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
// Process video and send back the result
ffmpeg("uploads/"+name)
  .fps(30)
  .addOptions(["-crf 28"])
  .on("end", () => {  
    endProcess({ statusCode: 200, text: "Success" });
  })
  .on("error", (err) => {
    endProcess({ statusCode: 500, text: err.message });
  })
  .save(`./temp/${name}`);



});
// /1682484222184-rn_image_picker_lib_temp_34f63e7d-a7f6-4230-9998-e88466f5bed7.mp4
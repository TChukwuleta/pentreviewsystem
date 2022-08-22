const cloudinary = require("cloudinary").v2
const fs = require("fs")
const path = require("path")
const logger = require("../helpers/logger")
require("dotenv").config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadAudio = async function (audio) {
  try {
    console.log(audio)
    const featureImagePath = path.resolve(`./uploads/${audio.name}`);
    await audio.mv(featureImagePath);
    console.log(featureImagePath)
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload(featureImagePath,{
          resource_type: "video",
          chunk_size: 6000000
        })
        .then((result) => {
          fs.unlinkSync(featureImagePath); 
          resolve(result);
        })
        .catch((error) => {
          logger.error(error);
          reject(error);
        });
    });
  } catch (error) { 
    logger.error(error);
  }
}

const uploadVideo = async function (video) {
  try {
    const featureImagePath = path.resolve(`./uploads/${video.name}`);
    await video.mv(featureImagePath);
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload(featureImagePath, {
          resource_type: "video",
          chunk_size: 8000000,
          eager: [
            {
              width: 300,
              height: 300,
              crop: "pad",
              audio_codec: "none",
            },
            {
              width: 160,
              height: 100,
              crop: "crop",
              gravity: "south",
              audio_codec: "none",
            },
          ],
          })
        .then((result) => {
          fs.unlinkSync(featureImagePath);
          resolve(result);
        })
        .catch((error) => {
          logger.error(error);
          reject(error);
        }); 
    });
  } catch (error) {
    logger.error(error);
  }
}

const uploadImage = async function (image) {
    try {
      const featureImagePath = path.resolve(`./uploads/${image.name}`);
      await image.mv(featureImagePath);
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload(featureImagePath)
          .then((result) => {
            fs.unlinkSync(featureImagePath);
            resolve(result);
          })
          .catch((error) => {
            logger.error(error);
            reject(error);
          }); 
      });
    } catch (error) {
      logger.error(error);
    }
}

module.exports = {
    uploadAudio,
    uploadVideo,
    uploadImage
};
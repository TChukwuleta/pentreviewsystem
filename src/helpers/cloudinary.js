const cloudinary = require("cloudinary").v2
const fs = require("fs")
const multer = require("multer")
const ApiError = require("../helpers/ApiError");
const path = require("path")
const logger = require("../helpers/logger")
require("dotenv").config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadAudio = async function (req, res) {
    try {
        const storage = multer.diskStorage({
            filename: (req, file, cb) => {
                const fileExt = file.originalname.split(".").pop();
                const filename = `${file.originalname}_${new Date().getTime()}.${fileExt}`;
                cb(null, filename);
            }
        })

        const fileFilter = (req, file, cb) => {
            if(file.mimetype === "audio/mp3" || file.mimetype === "audio/mpeg"){
                cb(null, true)
            }
            else{
                cb({ message: "Unsupported file format"}, false)
            }
        }

        const audioUpload = multer({
            storage,
            limits: {
                fieldNameSize: 200,
                fileSize: 10 * 1024 * 1024,
            },
            fileFilter
        }).single("audio")

        audioUpload(req, res, (err) => {
            if(err){
                throw new ApiError(400, "An error occured")
            }
            const { path } = req.file
            return new Promise((resolve, reject) => {
                cloudinary.uploader
                  .upload(path, {
                    resource_type: "raw",
                    public_id: `AudioUploads/${fName}`,
                    })
                  .then((result) => {
                    fs.unlinkSync(path);
                    resolve(result);
                  })
                  .catch((error) => {
                    logger.error(error);
                    reject(error);
                });
            })
        }) 
    } catch (error) {
      logger.error(error);
    }
}



const uploadImage = async function (image) {
    try {
      const featureImagePath = await path.resolve(`./uploads/${image.name}`);
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

const uploadVideo = async function (req, res) {
    try {
        const storage = multer.diskStorage({
            filename: (req, file, cb) => {
                const fileExt = file.originalname.split(".").pop();
                const filename = `${file.originalname}_${new Date().getTime()}.${fileExt}`;
                cb(null, filename);
            }
        })

        const fileFilter = (req, file, cb) => {
            if(file.mimetype === "video/mp4"){
                cb(null, true)
            }
            else{
                cb({ message: "Unsupported file format"}, false)
            }
        }

        const videoUpload = multer({
            storage,
            limits: {
                fieldNameSize: 200,
                fileSize: 30 * 1024 * 1024,
            },
            fileFilter
        }).single("video")

        videoUpload(req, res, (err) => {
            if(err) throw new ApiError(400, "An error occured")
            const { path } = req.file;
            const fName = req.file.originalname.split(".")[0];
            return new Promise((resolve, reject) => {
                cloudinary.uploader
                  .upload(path, {
                    resource_type: "video",
                    public_id: `VideoUploads/${fName}`,
                    chunk_size: 6000000,
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
                    fs.unlinkSync(path);
                    resolve(result);
                  })
                  .catch((error) => {
                    logger.error(error);
                    reject(error);
                });
            })
        })
    } catch (error) {
      logger.error(error);
    }
}

module.exports = {
    uploadAudio,
    uploadVideo,
    uploadImage
};
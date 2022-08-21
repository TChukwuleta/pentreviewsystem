const { User, Review, ReviewRating } = require("../models")
const ApiError = require("../helpers/ApiError")
const { authService } = require('./index');
const cloudinary = require("../helpers/cloudinary");

const createReview = async (req, res, data, mediaType) => {
    try {
        let mediaReview;
        switch(mediaType) {
            case "audio":
                const audioResult = await cloudinary.uploadAudio(req, res)
                mediaReview = audioResult.secure_url
              break;
            case "image":
                if (req.files && req.files.image) {
                    mediaReview = await processImages(req);
                }
                break;
            case "video":
                const videoResult = await cloudinary.uploadVideo(req, res)
                mediaReview = videoResult.secure_url
              break;
            default:
              throw new ApiError(400, "Invalid media type selected")
        }
        const reviewData = { ...data, mediaReview }  
        let review = await Review.create(reviewData)
        return JSON.parse(JSON.stringify(review))
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);   
    }
}

const processImages = async (req) => {
    console.log(req.files)
    const result = await cloudinary.uploadImage(req.files.image)
    console.log(result)
    return result.secure_url
}

const getReviewById = async (reviewId) => { 
    try {
        const review = await Review.findOne({ _id: reviewId })
        if(!review){
            throw new ApiError(400, "Review does not exist")
        }
        return JSON.parse(JSON.stringify(review))
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error); 
    }
} 

const getOneReview = async (criteria) => {
    try {
        const review = await Review.findOne({ ...criteria });
        if(!review) throw new ApiError(400, "Review does not exist")
        return JSON.parse(JSON.stringify(review));
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

const visitorReview = async (body) => {
    try {
        const { reviewId, visitorResponse } = body
        const existingReview = await Review.findOne({ _id: reviewId })
        if(!existingReview){
            throw new ApiError(400, "Review does not exist")
        }

        const visitorReview = await ReviewRating.create({
            isReviewHelpful: visitorResponse,
            review: existingReview._id
        })
        let data;
        switch (key) {
            case true:
                data.helpfulCount = existingReview.helpfulCount + 1
                break;
            case false:
                data.helpfulCount = existingReview.notHelpfulCount + 1
                break;
            default:
                throw new ApiError(400, "Invalid review response")
        }
        Object.assign(existingReview, data);
        await existingReview.save()

        const response = { visitorReview, existingReview }
        return JSON.parse(JSON.stringify(response));
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

const getReviews = async (criteria = {}, options = {}) => {
    try {
        const { sort = { createdAt: -1 }, limit } = options;
        const _limit = parseInt(limit, 10);
        let reviews = await Review.find(criteria)
        .sort(sort)
        .limit(_limit)
        .populate("User", "firstName lastName")
        if(!reviews){
            throw new ApiError(400, "No Reviews available")
        }
        return reviews;
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

const countReviews = async (criteria = {}) => {
    return await Review.find(criteria).countDocuments()
}

module.exports = {
    createReview,
    getOneReview,
    getReviewById,
    getReviews,
    visitorReview,
    countReviews
}
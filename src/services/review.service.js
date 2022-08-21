const { Review, ReviewRating } = require("../models")
const ApiError = require("../helpers/ApiError")
const cloudinary = require("../helpers/cloudinary");

const createReview = async (req, data) => {
    try {
        const { mediaType } = req.body
        let mediaReview;
        if(req.files){
            switch(mediaType) {
                case "audio":
                    if (req.files && req.files.audio) {
                        mediaReview = await processAudio(req);
                    }
                  break;
                case "image":
                    if (req.files && req.files.image) {
                        mediaReview = await processImages(req);
                    }
                    break;
                case "video":
                    if (req.files && req.files.video) {
                        mediaReview = await processVideo(req);
                    }
                  break;
                default:
                  throw new ApiError(400, "Invalid media type selected. Media type can be: 'audio', 'image', 'video'")
            }
        }
        const reviewData = { ...data, mediaReview }  
        let review = await Review.create(reviewData)
        return JSON.parse(JSON.stringify(review))
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);   
    }
}

const processImages = async (req) => {
    const result = await cloudinary.uploadImage(req.files.image)
    return result.secure_url
}

const processAudio = async (req) => {
    const result = await cloudinary.uploadAudio(req.files.audio)
    return result.secure_url
}

const processVideo = async (req) => {
    const result = await cloudinary.uploadVideo(req.files.video)
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
        const { reviewId, isHelpful } = body
        const existingReview = await Review.findOne({ _id: reviewId })
        if(!existingReview){
            throw new ApiError(400, "Review does not exist")
        }
        switch (isHelpful) {
            case true:
                existingReview.helpfulCount = existingReview.helpfulCount + 1
                break;
            case false:
                existingReview.notHelpfulCount = existingReview.notHelpfulCount + 1
                break;
            default:
                throw new ApiError(400, "Invalid review response")
        }
        await existingReview.save()

        const response = { visitorReview, existingReview }
        return JSON.parse(JSON.stringify(response));
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

const getReviews = async (criteria = {}, options = {}) => {
    try {
        const { sort, limit } = options;
        const _limit = parseInt(limit, 10);
        let reviews = await Review.find(criteria)
        .sort(sort)
        .limit(_limit)
        .populate("user", "firstName lastName")
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
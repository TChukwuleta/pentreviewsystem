const ApiError = require("../helpers/ApiError");
const catchAsync = require("../helpers/catchAsync")
const cloudinary = require("../helpers/cloudinary")
const pick = require("../helpers/pick")
const { authService, reviewService } = require("../services")

const createReview = catchAsync(async (req, res) => {
    try {
        await authService.getUserById(req.user._id)
        const { mediaType } = req.body
        if(req.files && req.files.image && mediaType == null){
            throw new ApiError(400, "Please input a valid media type. Media type can be: 'audio', 'image', 'video'")
        }
        const mediaChannelArray = ["audio", "image", "video"]
        const mediaChannel = mediaType.toString().toLowerCase()
        if(!mediaChannelArray.includes(mediaChannel)){
            throw new ApiError(400, "Please input a valid media type. Media type can be: 'audio', 'image', 'video'")
        }
        const reviewBody = {
            ...req.body,
            user: req.user._id
        }
        var review = await reviewService.createReview(req, res, reviewBody, mediaType)
        res.status(201).send({
            message: "Review created successfully",
            data: {
                review
            }
        })
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);   
    }
})

const getSingleReview = catchAsync(async (req, res) => {
    try {
        const { reviewId } = req.params
        const criteria = { _id: reviewId }
        const review = await reviewService.getOneReview(criteria)
        res.status(201).send({
            message: "Review retieval was successfully",
            data: {
                review
            }
        })
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);      
    }
})

const getReviews = catchAsync(async (req, res) => {
    try {
        const filter = pick(req.query, ["recent"])
        const query = pick(req.query, ["recent", "helpful", "limit"])
        const options = { sort: { helpfulCount: -1 }, limit: query.limit }
        const reviews = await reviewService.getReviews({}, options)
        res.status(201).send({
            message: "Reviews retieval was successfully",
            data: {
                reviews
            }
        })
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
})

const getMostHelpful = catchAsync(async (req, res) => {
    try {
        const options = { sort: { helpfulCount: -1 }, limit: req.body.limit }
        const reviews = await reviewService.getReviews({}, options)
        res.status(201).send({
            message: "Most helpful reviews retieval was successfully",
            data: {
                reviews
            }
        })
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error); 
    }
})

const getMostRecent = catchAsync(async (req, res) => {
    try {
        const options = { limit: req.body.limit }
        const reviews = await reviewService.getReviews({}, options)
        res.status(201).send({
            message: "Most recent reviews retieval was successfully",
            data: {
                reviews
            }
        })
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error); 
    }
})

const getAllReviews = catchAsync(async (req, res) => {
    try {
        const reviews = await reviewService.getReviews()
        res.status(201).send({
            message: "Reviews retieval was successfully",
            data: {
                reviews
            }
        })
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error); 
    }
})

module.exports = {
    createReview,
    getSingleReview,
    getMostHelpful,
    getMostRecent,
    getAllReviews
}
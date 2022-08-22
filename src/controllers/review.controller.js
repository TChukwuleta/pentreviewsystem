const ApiError = require("../helpers/ApiError");
const catchAsync = require("../helpers/catchAsync")
const pick = require("../helpers/pick")
const { authService, reviewService } = require("../services")

const createReview = catchAsync(async (req, res) => {
    try {
        await authService.getUserById(req.user._id)
        const reviewBody = {
            ...req.body,
            user: req.user._id
        }
        console.log(reviewBody)
        var review = await reviewService.createReview(req, reviewBody)
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

const addViewerRemark = catchAsync(async (req, res) => {
    try {
        var addRemark = await reviewService.visitorReview(req.body)
        res.status(201).send({
            message: "Review response was successfully",
            data: {
                addRemark
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
        const query = pick(req.query, ["helpful", "limit"])
        let filter = {};
        let options = { sort: { createdAt: -1 }, limit: query.limit }
        if(query.helpful){
            options = { sort: { helpfulCount: -1 }, limit: query.limit }
        }
        
        const reviews = await reviewService.getReviews(filter, options)
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
    getReviews,
    getAllReviews,
    addViewerRemark
}
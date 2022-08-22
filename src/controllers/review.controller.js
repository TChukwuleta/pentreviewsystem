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
        var review = await reviewService.createReview(req, reviewBody)
        res.status(201).send({
            message: "Review created successfully",
            data: {
                review
            } 
        }) 
    } catch (error) {
        const errorCode = error.code || 500
        const errorMessage = error.message || error
        res.status(errorCode).send({
            message: `Review creation failed. ${errorMessage}`,
        })  
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
        const errorCode = error.code || 500
        const errorMessage = error.message || error
        res.status(errorCode).send({
            message: `Adding viewer's remark failed. ${errorMessage}`,
        }) 
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
        const errorCode = error.code || 500
        const errorMessage = error.message || error
        res.status(errorCode).send({
            message: `Fetching single review failed. ${errorMessage}`,
        })       
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
        const errorCode = error.code || 500
        const errorMessage = error.message || error
        res.status(errorCode).send({
            message: `Fetching reviews failed. ${errorMessage}`,
        }) 
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
        const errorCode = error.code || 500
        const errorMessage = error.message || error
        res.status(errorCode).send({
            message: `Getting all reviews failed. ${errorMessage}`,
        })  
    }
})

module.exports = {
    createReview,
    getSingleReview,
    getReviews,
    getAllReviews,
    addViewerRemark
}
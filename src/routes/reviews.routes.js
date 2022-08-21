const express = require("express")
const validate = require("../helpers/validate")
const reviewController = require("../controllers/review.controller")
const reviewPolicy = require("../policies/review.policy")
const { authService } = require("../services")
const router = express.Router()

router.post(
    "/create", 
    [authService.validateToken, validate(reviewPolicy.create)],
    reviewController.createReview
)

router.get(
    "/all",
    reviewController.getAllReviews
)

router.get(
    "/getreviews",
    reviewController.getAllReviews
)

router.get(
    "/:reviewId",
    reviewController.getSingleReview
)

module.exports = router
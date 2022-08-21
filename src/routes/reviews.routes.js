const express = require("express")
const validate = require("../helpers/validate")
const reviewController = require("../controllers/review.controller")
const reviewPolicy = require("../policies/review.policy")
const { authService } = require("../services")
const upload = require('multer')();
const router = express.Router()

router.post(
    "/create", 
    [
        validate(reviewPolicy.create),
        authService.validateToken, 
    ],
    reviewController.createReview
)

router.post(
    "/viewersremark", 
    [
        validate(reviewPolicy.viewerRemark)
    ],
    reviewController.addViewerRemark
)

router.get(
    "/all",
    reviewController.getAllReviews
)

router.get(
    "/getreviews",
    reviewController.getReviews
)

router.get(
    "/:reviewId",
    reviewController.getSingleReview
)

module.exports = router
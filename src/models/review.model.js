const mongoose = require("mongoose")
const moment = require("moment")

const reviewSchema = mongoose.Schema({
    houseAddress: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    reviewRating: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "ReviewRating",
    },
    city: {
        type: String,
        required: true,
    },
    mediaReview: {
        type: String,
    },
    environmentReview: {
        type: String,
    },
    landlordReview: {
        type: String,
    },
    amenitiesReview: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
    },
    helpfulCount: {
        type: Number,
        default: 0
    },
    notHelpfulCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: String,
        default: moment().format(),
    },
    updatedAt: {
        type: String,
        default: moment().format(),
    }
}, { timestamps: true })

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
const mongoose = require("mongoose")
const moment = require("moment")

const reviewRatingSchema = mongoose.Schema({
    isReviewHelpful: {
        type: Boolean,
        required: true
    },
    review: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Review",
        required: true,
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

const ReviewRating = mongoose.model("ReviewRating", reviewRatingSchema);

module.exports = ReviewRating;
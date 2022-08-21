const express = require("express");
const router = new express.Router();
const authRoutes = require("./auth.routes")
const reviewRoutes = require("./reviews.routes")

router.use("/user", authRoutes)
router.use("/review", reviewRoutes)

module.exports = router
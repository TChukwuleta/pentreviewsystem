const express = require("express")
const validate = require("../helpers/validate")
const authController = require("../controllers/auth.controller")
const authValidation = require("../policies/auth.policy")
const { authService } = require("../services")
const router = express.Router()


// Creates a new user
router.post(
    "/register", 
    [validate(authValidation.register)],
    authController.register
)

// Logs in a user
router.post(
    "/login",
    [validate(authValidation.login)],
    authController.login
)

// Get a single user
router.get(
    "/getone",
    [authService.validateToken],
    authController.getUser
)

// Get all user under Pent
router.get(
    "/getall",
    [authService.validateToken],
    authController.getUsers
)

module.exports = router
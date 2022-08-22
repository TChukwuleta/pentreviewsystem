const ApiError = require("../helpers/ApiError");
const catchAsync = require("../helpers/catchAsync")
const { authService, tokenService } = require("../services")
const pick = require("../helpers/pick")

const register = catchAsync(async function(req, res) {
    try {
        const user = await authService.register(req.body)
        const tokens = await tokenService.generateAuthTokens(user, true)
        res.status(201).send({
            message: "User registration was successful",
            data: {
                user,
                token: tokens.access.token
            }
        })
    } catch (error) {
        const errorCode = error.code || 500
        const errorMessage = error.message || error
        res.status(errorCode).send({
            message: `User registration failed. ${errorMessage}`,
        })
    }
})

const login = catchAsync(async(req, res) => {
    try {
        const { email, password } = req.body
        const user = await authService.login(email, password)
        const tokens = await tokenService.generateAuthTokens(user)
        res.status(200).send({
            message: "User login was successful",
            data: {
                user,
                token: tokens.access.token
            }
        })
    } catch (error) {
        const errorCode = error.code || 500
        const errorMessage = error.message || error
        res.status(errorCode).send({
            message: `User registration failed. ${errorMessage}`,
        })
    }
})

const getUser = catchAsync(async (req, res) => {
    try {
        let user
        if(req.query.userId){
            user = JSON.parse(
                JSON.stringify(await authService.getUserById(req.query.userId))
            )
        } else {
            user = JSON.parse(
                JSON.stringify(await authService.getUserById(req.user._id))
            );
        }
        res.status(200).send({
            message: "User details fetched successfully",
            data: {
            user,
            },
        });
    } catch (error) {
        const errorCode = error.code || 500
        const errorMessage = error.message || error
        res.status(errorCode).send({
            message: `User registration failed. ${errorMessage}`,
        })
    }
})

const getUsers = catchAsync(async (req, res) => {
    try {
        const options = pick(req.query, ["sortBy", "limit"]);
        const users = await authService.getUsers({}, options)
        const count = await authService.count()
        res.status(200).send({
            status: "success",
            message: "Users Fetched successfully",
            data: {
            count,
            users: JSON.parse(JSON.stringify(users)),
            },
        });
    } catch (error) {
        const errorCode = error.code || 500
        const errorMessage = error.message || error
        res.status(errorCode).send({
            message: `User registration failed. ${errorMessage}`,
        })
    }
})

module.exports = {
    register,
    login,
    getUser,
    getUsers
}
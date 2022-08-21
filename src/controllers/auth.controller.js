const ApiError = require("../helpers/ApiError");
const catchAsync = require("../helpers/catchAsync")
const { authService, tokenService } = require("../services")
const pick = require("../helpers/pick")

const register = catchAsync(async function(req, res) {
    const user = await authService.register(req.body)
    const tokens = await tokenService.generateAuthTokens(user, true)
    res.status(201).send({
        message: "User registration was successful",
        data: {
            user,
            token: tokens.access.token
        }
    })
})

const login = catchAsync(async(req, res) => {
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
})

const getUser = catchAsync(async (req, res) => {
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
})

const getUsers = catchAsync(async (req, res) => {
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
})

module.exports = {
    register,
    login,
    getUser,
    getUsers
}
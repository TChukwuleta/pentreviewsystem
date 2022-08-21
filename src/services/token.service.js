const jwt = require("jsonwebtoken")
const moment = require("moment")

const { Token, User } = require("../models")
const ApiError = require("../helpers/ApiError");


const generateToken = (user, expires) => {
    const payload = {
      sub: user.id,
      user,
      iat: moment().unix(),
      exp: expires.unix(),
    };
    return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    try {
      const tokenDoc = await Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
      });
      return tokenDoc;
    } catch (error) {
      const message = error.message || error;
      const errCode = error.code || 500;
      throw new ApiError(errCode, message);
    }
};

const generateAuthTokens = async (user, newUser = false) => {
    const accessTokenExpires = moment().add(60, "minutes");
    const accessToken = generateToken(user, accessTokenExpires);
  
    const returnTokens = {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
    };
  
    if (newUser) {
      const emailVerificationToken = generateToken(user, accessTokenExpires);
      await saveToken(
        emailVerificationToken,
        user._id,
        accessTokenExpires,
        "emailToken"
      );
      returnTokens.emailToken = {
        token: emailVerificationToken,
        expires: accessTokenExpires.toDate(),
      };
    }
    return returnTokens;
};

const deleteToken = async (userId, type) => {
    try {
      await Token.findOneAndRemove({
        user: userId,
        type,
      });
    } catch (error) {
      const message = error.message || error;
      const errCode = error.code || httpStatus.INTERNAL_SERVER_ERROR;
      throw new ApiError(errCode, message);
    }
};

module.exports = {
    generateAuthTokens,
    generateToken,
    saveToken,
    deleteToken
}
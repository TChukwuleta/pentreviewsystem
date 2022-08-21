const Joi = require("joi")


const create = {
    body: Joi.object().keys({
      houseAddress: Joi.string().required().messages({
        "string.empty": `House address cannot be an empty field`,
        "any.required": `House address is a required field`,
      }),
      city: Joi.string().required().messages({
        "string.empty": `City cannot be an empty field`,
        "any.required": `City is a required field`,
      }),
      environmentReview: Joi.string().required().messages({
        "string.empty": `Environment review cannot be an empty field`,
        "any.required": `Environment review is a required field`,
      }),
      landlordReview: Joi.string().required().messages({
        "string.empty": `Landlord review cannot be an empty field`,
        "any.required": `Landlord review is a required field`,
      }),
      amenitiesReview: Joi.string().required().messages({
        "string.empty": `Amenities review cannot be an empty field`,
        "any.required": `Amenities review is a required field`,
      }),
      rating: Joi.number().min(1).max(10).required().messages({
        "string.empty": `rating cannot be an empty field`,
        "any.required": `rating is a required field`,
      })
    }),
};

const viewerRemark = {
    body: Joi.object().keys({
      isHelpful: Joi.boolean().required().messages({
        "string.empty": `'isHelpful' remark cannot be an empty field`,
        "any.required": `'isHelpful' remark is a required field`,
      }),
      reviewId: Joi.string().required().messages({
        "string.empty": `reviewId cannot be an empty field`,
        "any.required": `reviewId is a required field`,
      })
    })
};

module.exports = {
    viewerRemark,
    create
}
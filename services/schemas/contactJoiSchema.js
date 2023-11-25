const Joi = require("joi");

const contactJoiSchema = Joi.object({
 name: Joi.string(),
 email: Joi.string(),
 phone: Joi.string(),
 favorite: Joi.boolean(),
});

module.exports = {
  contactJoiSchema,
};
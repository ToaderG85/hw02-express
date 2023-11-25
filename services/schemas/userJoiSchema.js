const Joi = require("joi");

const userJoiSchema = Joi.object({
 email: Joi.string().required(),
 password: Joi.string().min(6).required(),
 subscription: Joi.string().valid("starter", "pro", "business").default("starter"),
 token: Joi.string(),
});

const checkError = (schema, { body }, res, next) => {
  try {
   const { error } = schema.validate(body);
 
   if (error) {
    return res.status(400).json({
     status: "Bad Request",
     code: 400,
     message: error.message.replace(/"/g, ""),
    });
   }
 
   next();
  } catch (error) {
   // Handle any unexpected errors during validation
   console.error("Validation error:", error);
   return res.status(500).json({
    status: "Internal Server Error",
    code: 500,
    message: "Internal Server Error",
   });
  }
 };

module.exports = {
  validUserJoiSchema: (req, res, next) => checkError(userJoiSchema, req, res, next)
};
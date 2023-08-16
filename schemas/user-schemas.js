import Joi from "joi";

export const userSignupSchema = Joi.object({
  email: Joi.string()
    .required()
    .messages({ "any.required": `missing required email field` }),
  password: Joi.string()
    .required()
    .messages({ "any.required": `missing required phone field` }),
});

export const userVerifySchema = Joi.object({
  email: Joi.string()
    .required()
    .messages({ "any.required": `missing required email field` }),
});

export default {
  userSignupSchema,
  userSigninSchema: userSignupSchema,
  userVerifySchema,
};

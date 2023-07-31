import HttpError from "../helpers/HttpError.js";

const isValidatedbody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
      }
      next()
  };

  return func;
};

export default isValidatedbody

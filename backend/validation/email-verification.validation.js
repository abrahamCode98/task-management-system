import Joi from "joi";

const emailVerificationSchema = Joi.object({
  token: Joi.string().hex().length(64).required(),
}).unknown(false);

export default emailVerificationSchema;

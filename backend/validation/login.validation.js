import joi from "joi";

const loginSchema = joi.object({
    email: joi.string().required().email().trim().lowercase(),
    password: joi.string().required()
});

export default loginSchema;
import Joi from "joi";

const title = Joi.string().min(3).custom((value, helper) => {
    if(!/^[A-Z]/.test(value)) {
       return helper.error("any.invalid");
    }

    return value;
}).messages({"any.invalid": "Title must start with a capital letter"});

export default title;
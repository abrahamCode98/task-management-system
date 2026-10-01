import Joi from "joi";
import dueDateValidation from "./helpers/dueDate.validation.js";
import title from "./helpers/title.validation.js";

const updateTaskSchema = Joi.object({
    title: title,
    description: Joi.string().min(10),
    dueDate: dueDateValidation,
    priority: Joi.string().valid("low", "medium", "high"),
    status: Joi.string().valid("pending", "in progress", "completed")
}).min(1).unknown(false);

export default updateTaskSchema;
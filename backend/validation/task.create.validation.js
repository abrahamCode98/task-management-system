import Joi from "joi";
import dueDateValidation from "./helpers/dueDate.validation.js";
import title from "./helpers/title.validation.js";


const createTaskSchema = Joi.object({
  title: title.required(),
  description: Joi.string().min(10).required(),
  dueDate: dueDateValidation.required(),
  priority: Joi.string().valid("low", "medium", "high").required(),
  status: Joi.string().valid("pending", "in progress", "completed").required(),
});

export default createTaskSchema;

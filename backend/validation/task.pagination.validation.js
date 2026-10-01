import Joi from "joi";

const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    priority: Joi.string().valid("low", "medium", "high"),
    status: Joi.string().valid("pending", "in progress", "completed"),
    search: Joi.string().trim()
});

export default paginationSchema;
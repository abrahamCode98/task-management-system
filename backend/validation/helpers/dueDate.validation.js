import Joi from "joi";

const dueDateValidation = Joi.date()
  .custom((value, helpers) => {
    const date = new Date(value).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];

    if (date < today) {
      return helpers.error("date.past");
    };

    return value;
  })
  .message({
    "date.past": "Due date cannot be in the past",
  });

  export default dueDateValidation;

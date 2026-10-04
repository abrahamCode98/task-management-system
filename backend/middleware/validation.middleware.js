import createTaskSchema from "../validation/task.create.validation.js";
import updateTaskSchema from "../validation/task.update.validation.js";
import paginationSchema from "../validation/task.pagination.validation.js";
import registerSchema from "../validation/auth.validation.js";
import loginSchema from "../validation/login.validation.js";
import emailVerificationSchema from "../validation/email-verification.validation.js";

export const validateCreateTask = (req, res, next) => {
  const { error, value } = createTaskSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    next(error);
  } else {
    req.body = value;
    next();
  }
};

export const validateUpdateTask = (req, res, next) => {
  const { error, value } = updateTaskSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    next(error);
  } else {
    req.body = value;
    next();
  }
};

export const validatePagination = (req, res, next) => {
  const { error, value } = paginationSchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    next(error);
  } else {
    req.pagination = value;
    next();
  }
};

export const validateRegister = (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    next(error);
  } else {
    req.body = value;
    next();
  }
};

export const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    next(error);
  } else {
    req.body = value;
    next();
  }
};

export const validateEmailVerification = (req, res, next) => {
  const { error, value } = emailVerificationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    next(error);
  } else {
    req.body = value;
    next();
  }
};

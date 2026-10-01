const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  if (error.details) {
    console.log("JOI ERROR:");
    console.log(JSON.stringify(error, null, 2));

    const errors = {};

    for (const detail of error.details) {
      console.log("DETAILS:", detail);

      errors[detail.path[0]] = detail.message;
    }

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  } else if (error.name === "ValidationError") {
    const errors = {};

    for (const field in error.errors) {
      errors[field] = error.errors[field].message;
    }
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors,
    });
  } else if (error.name === "CastError") {
    res.status(400).json({
      success: false,
      message: "Invalid task ID",
    });
  } else if (error.statusCode) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  } else if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];

    res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  } else if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default errorMiddleware;

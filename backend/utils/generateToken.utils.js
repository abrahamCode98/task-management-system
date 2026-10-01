import "dotenv/config";
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const payload = { id: user._id };

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  };

  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

  const token = jwt.sign(payload, secret, { expiresIn });

  return token;
  
};
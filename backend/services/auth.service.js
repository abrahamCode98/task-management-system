import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import bcrypt from "bcrypt";
import AppError from "../utils/appError.utils.js";
import { generateToken } from "../utils/generateToken.utils.js";
import { generateRefreshToken } from "../utils/generateRefreshToken.utils.js";
import { hashRefreshToken } from "../utils/hashRefreshToken.utils.js";
import { parseDuration } from "../utils/time.utils.js";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateToken(user);

  const refreshToken = generateRefreshToken();

  const hashedRefreshToken = hashRefreshToken(refreshToken);

  const refreshTokenDuration = parseDuration(process.env.REFRESH_TOKEN_EXPIRES_IN)

  const expiryTime = new Date(
    Date.now() + refreshTokenDuration,
  );

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashedRefreshToken,
    expiresAt: expiryTime,
  });

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token: accessToken,
    refreshToken: refreshToken,
    refreshTokenDuration: refreshTokenDuration
  };
};


export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  };

  const hashedRefreshToken = hashRefreshToken(refreshToken);

  const storedToken = await RefreshToken.findOne({
    tokenHash: hashedRefreshToken,
  });

  if (!storedToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (storedToken.revoked === true) {
    throw new AppError("Invalid refresh token", 401);
  };

  if(storedToken.expiresAt < new Date()) {
    throw new AppError("Invalid refresh token", 401);
  };

  const user = await User.findById(storedToken.user);

  if(!user) {
    throw new AppError("Invalid refresh token", 401);
  };

  const accessToken = generateToken(user);

  const newRefreshToken = generateRefreshToken();

  const newRefreshTokenHash =  hashRefreshToken(newRefreshToken);

  storedToken.revoked = true;

  await storedToken.save();

  const refreshTokenDuration = parseDuration(
    process.env.REFRESH_TOKEN_EXPIRES_IN
  );

  const expiryTime = new Date(
    Date.now() + refreshTokenDuration
  );

  await RefreshToken.create({
    user: user._id,
    tokenHash: newRefreshTokenHash,
    expiresAt: expiryTime,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    refreshTokenDuration
  };

};


export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const hashedRefreshToken = hashRefreshToken(refreshToken);

  const storedToken = await RefreshToken.findOne({
    tokenHash: hashedRefreshToken,
  });

  if (storedToken) {
    storedToken.revoked = true;
    await storedToken.save();
  };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  return user;
};

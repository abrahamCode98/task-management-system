import EmailVerification from "../models/emailVerification.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/appError.utils.js";
import { generateEmailVerificationToken } from "../utils/generateEmailVerificationToken.utils.js";
import { generateEmailVerificationTokenHash } from "../utils/hashEmailVerificationToken.utils.js";
import { parseDuration } from "../utils/time.utils.js";
import { sendEmail } from "./email.service.js";

export const sendVerificationEmail = async (user) => {
  if (!user?._id || !user.email) {
    throw new AppError("A user with an email address is required", 400);
  }

  const frontendOrigin = process.env.FRONTEND_ORIGIN;
  const tokenDuration = process.env.EMAIL_VERIFICATION_EXPIRES_IN;

  if (!frontendOrigin || !tokenDuration) {
    throw new Error(
      "FRONTEND_ORIGIN and EMAIL_VERIFICATION_EXPIRES_IN must be configured",
    );
  }

  const rawToken = generateEmailVerificationToken();
  const tokenHash = generateEmailVerificationTokenHash(rawToken);
  const expiresAt = new Date(Date.now() + parseDuration(tokenDuration));

  await EmailVerification.deleteMany({ user: user._id });

  const verificationRecord = await EmailVerification.create({
    user: user._id,
    tokenHash,
    expiresAt,
  });

  const verificationUrl = new URL("/verify-email", frontendOrigin);
  verificationUrl.searchParams.set("token", rawToken);

  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your email address",
      text: `Verify your Task Management System account by opening this link: ${verificationUrl.href}`,
      html: `<p>Verify your Task Management System account by opening this link:</p><p><a href="${verificationUrl.href}">Verify email address</a></p>`,
    });
  } catch (error) {
    await EmailVerification.deleteOne({ _id: verificationRecord._id });
    throw error;
  }

  return { emailSent: true };
};

export const verifyEmailToken = async (rawToken) => {
  if (typeof rawToken !== "string" || rawToken.length === 0) {
    throw new AppError("Invalid or expired email verification token", 400);
  }

  const tokenHash = generateEmailVerificationTokenHash(rawToken);
  const now = new Date();
  const verificationRecord = await EmailVerification.findOne({
    tokenHash,
    expiresAt: { $gt: now },
  });

  if (!verificationRecord) {
    throw new AppError("Invalid or expired email verification token", 400);
  }

  const user = await User.findById(verificationRecord.user);
  if (!user) {
    await EmailVerification.deleteOne({ _id: verificationRecord._id });
    throw new AppError("Invalid or expired email verification token", 400);
  }

  const consumedRecord = await EmailVerification.findOneAndDelete({
    _id: verificationRecord._id,
    expiresAt: { $gt: now },
  });

  if (!consumedRecord) {
    throw new AppError("Invalid or expired email verification token", 400);
  }

  user.emailVerified = true;
  await user.save();

  return { emailVerified: true };
};

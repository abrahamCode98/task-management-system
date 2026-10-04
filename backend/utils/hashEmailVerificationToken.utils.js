import crypto from "crypto";

export const generateEmailVerificationTokenHash = (emailVerificationToken) => {
    return crypto.createHash("sha256").update(emailVerificationToken).digest("hex");
}
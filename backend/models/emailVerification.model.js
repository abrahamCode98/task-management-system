import mongoose from 'mongoose';


const emailVerificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    tokenHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0
    }
});

const EmailVerification = mongoose.model("EmailVerification", emailVerificationSchema);

export default EmailVerification;
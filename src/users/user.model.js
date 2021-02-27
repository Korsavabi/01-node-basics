import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true},
    password: { type: String, required: true },
    avatarURL: { type: String },
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    token: { type: String, default: "" },
    verificationToken: {type: String, required: false},
})

export const userModel = mongoose.model("User", userSchema);
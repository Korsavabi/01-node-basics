import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true},
    passwordHash: { type: String, required: true },
    avatarURL: { type: String },
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    token: { type: String, default: "" },
})

export const userModel = mongoose.model("User", userSchema);
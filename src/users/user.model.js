import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwordHash: { type: String, required: true },
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    token: String,
})

export const userModel = mongoose.model("User", userSchema);
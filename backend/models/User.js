import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    // ===============================
    // SUBSCRIPTION / PLAN
    // ===============================
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free"
    },

    stripeCustomerId: {
      type: String,
      default: null
    },

    stripeSubscriptionId: {
      type: String,
      default: null
    },

    subscriptionStatus: {
      type: String,
      default: "inactive"
    },

    // ===============================
    // AUTH / REFRESH TOKEN
    // ===============================
    refreshToken: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
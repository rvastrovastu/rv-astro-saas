import mongoose from "mongoose";

const authUserSchema = new mongoose.Schema(
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

    // Existing premium flag preserved
    isPremium: {
      type: Boolean,
      default: false
    },

    // New subscription plan system
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

    refreshToken: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("AuthUser", authUserSchema);
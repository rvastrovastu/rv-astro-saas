import mongoose from "mongoose";

const kundaliSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    name: String,
    dob: String,
    time: String,
    place: String,

    data: Object // full kundali JSON
  },
  { timestamps: true }
);

export default mongoose.model("Kundali", kundaliSchema);
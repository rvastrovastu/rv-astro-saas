import mongoose from "mongoose";

const astroSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  dob: String,
  time: String,
  place: String
});

export default mongoose.model("AstroProfile", astroSchema);
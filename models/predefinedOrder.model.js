import mongoose from "mongoose";

const predefinedSchema = new mongoose.Schema(
  {
    pid: String,
    predefined: [mongoose.Schema.Types.Mixed],
  },
  { timestamps: true }
);

const Predefined = mongoose.model("Predefined", predefinedSchema);

export default Predefined;

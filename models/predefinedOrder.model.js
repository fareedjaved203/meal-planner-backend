import mongoose from "mongoose";

const predefinedSchema = new mongoose.Schema(
  {
    pid: String,
    predefined: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders'
      }]
  },
  { timestamps: true }
);

const Predefined = mongoose.model("Predefined", predefinedSchema);

export default Predefined;

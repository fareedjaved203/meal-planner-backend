import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    pid: String,
    date: Date,
    numberLine1: String,
    numberLine2: String,
    levelSpiciness: String,
    diet: String,
    origin: String,
    preparationTime: String,
    levelOfDifficulty: String,
    ingredients: [String],
    steps: [String],
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;

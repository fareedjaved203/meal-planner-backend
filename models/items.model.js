import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    pid: String,
    date: Date,
    nameLine1: String,
    nameLine2: String,
    spiciness: String,
    diet: String,
    origin: String,
    preparationTime: String,
    difficulty: String,
    ingredients: [{
      value: String
    }],
    steps: [{
      value: String
    }],
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    pid: String,
    date: Date,
    orderby: String,
    quantity: String,
    price: String,
    type: String,
    status: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;

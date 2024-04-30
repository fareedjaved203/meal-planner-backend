import Order from "../models/orders.model.js";
import { ApiError } from "../utils/ApiError.js";

const postOrders = async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    console.log(orders);
    if (orders) {
      return res
        .status(200)
        .json({ success: true, message: "Orders fetched", orders });
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.find({ pid: req.params.id });
    if (order) {
      return res
        .status(200)
        .json({ success: true, message: "Order fetched", order });
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.find({ pid: req.params.id });
    if (order) {
      order.status = req.body.status;
    }
    await order.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json({ success: true, message: "Order Updated", order });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

export { postOrders, getOrders, updateOrder, getSingleOrder };

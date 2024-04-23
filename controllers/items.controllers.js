import Item from "../models/items.model.js";

const postItem = async (req, res) => {
  try {
    const item = await Item.create({
      ...req.body,
    });
    if (item) {
      return res
        .status(201)
        .json({ success: true, message: "item Added" });
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Item.find({});
    if (items) {
      return res
        .status(200)
        .json({ success: true, message: "items fetched", items });
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const getSingleItem = async (req, res) => {
  try {
    const item = await Item.find({ pid: req.params.id });
    if (item) {
      return res
        .status(200)
        .json({ success: true, message: "item fetched", item });
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ pid: req.params.id });
    await item.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json({ success: true, message: "item Deleted Successfully" });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { pid: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json({ success: true, message: "item Updated" });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

export { postItem, getItems, updateItem, getSingleItem, deleteItem };

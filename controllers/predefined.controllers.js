import Predefined from "../models/predefinedOrder.model.js";

const postPredefined = async (req, res) => {
  try {
    const { pid, predefined } = req.body;
    console.log(req.body);

    const predefinedDoc = await Predefined.findOneAndUpdate(
      { pid: pid },
      { $addToSet: { predefined: { $each: predefined } } },
      { new: true, upsert: true }
    );

    if (predefinedDoc) {
      return res
        .status(201)
        .json({ success: true, message: "Predefined updated or created" });
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const getPredefined = async (req, res) => {
  try {
    const predefined = await Predefined.findOne({ pid: req.params.id });
    console.log(predefined);
    if (predefined) {
      return res
        .status(200)
        .json({ success: true, message: "predefined fetched", predefined });
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const deletePredefined = async (req, res) => {
  try {
    const predefined = await Predefined.findOneAndUpdate(
      { pid: req.params.pid },
      { $pull: { predefined: req.params.id } },
      { new: true }
    );

    if (predefined) {
      return res.status(200).json({
        success: true,
        message: "Order removed from predefined",
        predefined,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Predefined not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while removing the order from predefined",
      error,
    });
  }
};

export { postPredefined, getPredefined, deletePredefined };

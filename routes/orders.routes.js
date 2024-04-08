import express from "express";
import {
  postOrders,
  getOrders,
  updateOrder,
  getSingleOrder,
} from "../controllers/orders.controllers.js";

import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/order", isAuthenticatedUser, postOrders);
router.get("/order", getOrders);
router.get("/order/:id", getSingleOrder);
router.put("/order/update/:id", isAuthenticatedUser, updateOrder);

export default router;

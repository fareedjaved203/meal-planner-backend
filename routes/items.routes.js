import express from "express";
import {
  postItems,
  getItems,
  updateItem,
  deleteItem,
  getSingleItem,
} from "../controllers/items.controllers.js";

import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/item", isAuthenticatedUser, postItems);
router.get("/items", getItems);
router.get("/item/:id", getSingleItem);
router.put("/item/:id", isAuthenticatedUser, updateItem);
router.delete("/item/:id", isAuthenticatedUser, deleteItem);

export default router;

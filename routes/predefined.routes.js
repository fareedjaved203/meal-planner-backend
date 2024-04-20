import express from "express";
import {
  postPredefined,
  getPredefined,
  deletePredefined
} from "../controllers/predefined.controllers.js";

import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/predefined", isAuthenticatedUser, postPredefined);
router.get("/predefined/:id", getPredefined);
router.put("/predefined/:id/:predefinedId", deletePredefined);

export default router;

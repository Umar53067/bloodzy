import express from "express";
import { protect } from "../middlewares/auth.js";
import { registerDonor, findNearbyDonors, getMyDonor, updateMyDonor } from "../controllers/donorController.js";

const router = express.Router()

// Protected routes for donor self-service
router.post("/donors/register", protect, registerDonor);
router.get("/donors/me", protect, getMyDonor);
router.put("/donors/me", protect, updateMyDonor);

// Public search endpoint
router.get("/donors/nearby", findNearbyDonors);

export default router
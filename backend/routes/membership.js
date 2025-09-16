import { Router } from "express";
import { saveMembershipData, processPayment } from "../controllers/membershipController.js";

const router = Router();

router.post("/save", saveMembershipData);    // For saving membership form data
router.post("/payment", processPayment);     // For handling payment and plan upgrade

export default router;
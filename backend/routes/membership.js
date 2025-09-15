import {Router} from "express";
import { saveMembershipData, processPayment } from "../controllers/membershipController.js";

const router = Router();

router.post("/checkout", saveMembershipData);    // For saving membership form data //* updated by Okile
router.post("/payment", processPayment);         // For handling payment and plan upgrade //* updated by Okile

export default router;
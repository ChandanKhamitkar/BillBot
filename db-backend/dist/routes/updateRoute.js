import express from "express";
import { updateBusinessDetails } from "../controller/updateController.js";
const router = express.Router();
router.post("/updateBusinessDetails", updateBusinessDetails);
export default router;

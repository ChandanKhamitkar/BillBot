import express from "express";
import { getBusinessDetails } from "../controller/readController.js";
const router = express.Router();
router.post("/getBusinessDetails", getBusinessDetails);
export default router;

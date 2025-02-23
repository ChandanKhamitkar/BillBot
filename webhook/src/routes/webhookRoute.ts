import express from "express";
import { webhookController } from "../controller/webhookController.js";

const router = express.Router();
router.post("/webhook", webhookController);

export default router;
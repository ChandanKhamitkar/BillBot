import express from "express";
import { updateBusinessDetails, uploadImage } from "../controller/updateController.js"; 
import { upload } from "../lib/middleware.js";

const router = express.Router();
router.post("/updateBusinessDetails", updateBusinessDetails);
router.post("/updateUploadImage", upload.single("image"), uploadImage);

export default router;
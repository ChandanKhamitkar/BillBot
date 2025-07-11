import { prisma } from "../lib/prisma.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { FirebaseBucket } from "../lib/firebase.js";
import {fileTypeFromBuffer} from 'file-type';

// method: POST
// Desc: Update user's Business Details ( such as : Business Name, Owner Name, email, address, gst, upiid)
export const updateBusinessDetails = async (req: any, res: any) => {
  try {
    let { chatId, data } = req.body;
    let { email, businessName, ownerName, address, UPIID, gstPercent } = data;

    // typecast to avoid errors
    chatId = chatId?.toString();
    email = email?.toString();
    businessName = businessName?.toString();
    ownerName = ownerName?.toString();
    address = address?.toString();
    UPIID = UPIID?.toString();
    gstPercent = gstPercent ? parseInt(gstPercent, 10) : 0;

    if (!chatId) {
      return res
        .status(400)
        .json({ success: false, message: "chatId is required" });
    }

    const response = await prisma.user.update({
      where: {
        chatId,
      },
      data: {
        email,
        businessName,
        ownerName,
        address,
        UPIID,
        gstPercent,
      },
      select: {
        email: true,
        businessName: true,
        ownerName: true,
        address: true,
        UPIID: true,
        logo: true,
        gstPercent: true,
        templateNo: true,
      },
    });

    // update the redis cache as well
    await axios.post(`${process.env.REDIS_URL}/setBusinessDetails`, {
      chatId,
      data: response,
    });

    return res.status(200).json({
      success: true,
      message: "Business Details Updated Successfully",
    });
  } catch (error) {
    console.log("Error while updating Business Details: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating Business Details",
    });
  }
};

// method: POST
// Desc: Store image in Firebase cloud Storage
export const uploadImage = async (req: any, res: any) => {
  try {
    let { chatId, caption } = req.body;

    // console.log("image file received: ", req.file);
    const fileBuffer = req.file?.buffer;

  
    if (!fileBuffer || !chatId || !caption)
      return res.status(400).json({ message: "All Fields are required ( image | chatId | caption )" });
    
    const bufferUpload = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);
    const uuid = uuidv4();
    const fileName = `logos-${chatId}-${Date.now()}-${req.file?.originalname}`;
    const firebaseFile = FirebaseBucket.file(fileName);
    const mimeInfo = await fileTypeFromBuffer(bufferUpload);
    const mime = mimeInfo?.mime || "image/jpeg";
    console.log("Congtent type : ", mime);

    const stream = firebaseFile.createWriteStream({
      metadata: {
        contentType: mime,
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        },
      },
    });

    stream.on("error", (err: any) => {
      console.error("Firebase upload error: ", err);
      return res.status(500).json({ message: "Failed to upload to firebase" });
    });

    stream.on("finish", async () => {
      const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${
        FirebaseBucket.name
      }/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;

      // save URL in DB
      const imageRecord = await prisma.user.update({
        where: {
          chatId,
        },
        data: {
          [caption]: downloadUrl,
        },
        select: {
          email: true,
          businessName: true,
          ownerName: true,
          address: true,
          UPIID: true,
          logo: true,
          gstPercent: true,
          templateNo: true,
        },
      });

      // update the redis cache as well
      await axios.post(`${process.env.REDIS_URL}/setBusinessDetails`, {
        chatId,
        data: imageRecord,
      });

      res.status(200).json({
        message: "Image uploaded successfully.",
        imageUrl: downloadUrl,
        success: true,
      });
    });

    stream.end(bufferUpload);
  } catch (error) {
    console.log(
      "Error while Uploading Image in Firebase Storage Bucket: ",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Error while Uploading Image in Firebase Storage Bucket",
    });
  }
};

import axios from "axios";
import dotenv from "dotenv";
import generateInvoiceImage from "../services/imageGen.js";
import FormData from "form-data";
import { Readable } from "stream";
import { defaultMessage } from "../utils/defaultMessages.js";

dotenv.config();

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

const webhookController = async (req: any, res: any) => {
  try {
    console.log("Full data received : ", req.body);
    const message = req.body?.message?.text || null;
    const chatid = req.body?.message?.chat?.id;

    // Pretend Typing by default to ALL
    await sendTypingAction(chatid);

    // 🖼️ Message empty that means image has been sent
    if (!message && req.body?.message?.photo) {
      // Warning message
      await sendMessage(
        chatid,
        "Uploading in progress...\nAccepted Images: Brand Logo\n If any images received, we will assume it as Brand Logo!"
      );
      // await sendMessage(chatid, "Uploading in progress, WARNING⚠️: If no caption is identified then we consider the image as logo of your brand. \nAccepted Caption: qr, logo");

      await sendTypingAction(chatid);

      // const caption = req.body.message?.caption || "logo";
      const caption = "logo";
      const photos = req.body.message?.photo;
      if (!photos || photos.length === 0) {
        await sendMessage(chatid, "❌ No image received. Please try again.");
        return res.sendStatus(404);
      }

      // Check FIle size
      const rawFileSize = photos[photos.length - 1].file_size;
      console.log("Raw File Size = ", rawFileSize);
      const fileSizeInMB = (rawFileSize / (1024 * 1024)).toFixed(2);
      console.log("File Size = ", fileSizeInMB);
      if (Number(fileSizeInMB) <= 1) {
        await uploadImage(caption, chatid, photos);
      } else {
        // Warning message
        await sendMessage(chatid, "Max File Size Allowed 1MB only ⚠️");
      }
      return res.sendStatus(200);
    }

    //🔸 Send Default Messages
    if (message === "/start") {
      await sendMessage(chatid, defaultMessage["/start"]);
      await axios.post(`${process.env.DATABASE_URL}/createUser`, {
        chatId: chatid.toString(),
      });
      return res.sendStatus(200);
    }
    //🔸 Send Default Messages
    else if (message === "/help") {
      await sendMessage(chatid, "Help commands yet to add");
      return res.sendStatus(200);
    }

    await sendMessage(chatid, "Processing Please wait...");

    // 1. Verify and Extract data ( Data formation state )
    const verifyExtractData = await verifyAndExtract(
      message,
      chatid.toString()
    );
    console.log(
      "after verifaction response  = ",
      verifyExtractData,
      typeof verifyExtractData
    );
    if (
      !verifyExtractData ||
      verifyExtractData.type === "error" ||
      verifyExtractData.type === "notify"
    )
      return sendError(
        res,
        chatid,
        verifyExtractData.message || "Please try again!"
      );

    if (verifyExtractData.type === "extraction") {
      // 2. Generate Invoice image
      const invoiceUrl = `https://bill-bot-invoice-templates.vercel.app/?chatId=${chatid.toString()}&data=${encodeURIComponent(
        JSON.stringify(verifyExtractData?.data)
      )}`;

      console.log("Invoice URL HIT: ", invoiceUrl);

      const imageBuffer = await generateInvoiceImage(invoiceUrl);
      if (!imageBuffer)
        return sendError(res, chatid, "Error generating invoice image.");

      // 3. Send Invoice image
      const imageSent = await sendInvoiceToTelegram(chatid, imageBuffer);
      if (!imageSent) return sendError(res, chatid, "Error sending invoice.");

      // Send extracted text as confirmation message
      await sendMessage(chatid, "Here is your invoice Generated...");
    }

    return res.sendStatus(200);
  } catch (error) {
    console.log("Error : ", error);
    return res.sendStatus(200);
  }
};

// 1🔹 Verify and Extract data using GenAI API
const verifyAndExtract = async (message: string, chatId: string) => {
  try {
    const response = await axios.post(
      "https://bill-bot-genai.vercel.app/verifyMsg",
      { text: JSON.stringify(message), chatId: chatId }
    );
    return response.data.result;
  } catch (error) {
    console.error("Verification and Extraction Error:", error);
    return null;
  }
};

// 🔹 Send the invoice image to Telegram
const sendInvoiceToTelegram = async (chatId: string, imageBuffer: any) => {
  try {
    const form = new FormData();
    form.append("chat_id", chatId);

    // ✅ Convert Uint8Array to a proper Buffer
    const buffer = Buffer.from(imageBuffer);

    // ✅ Convert Buffer to a Readable Stream (for FormData)
    const stream = Readable.from(buffer);

    form.append("photo", stream, {
      filename: "invoice.png",
      contentType: "image/png",
    });

    await axios.post(`${TELEGRAM_API}/sendPhoto`, form, {
      headers: form.getHeaders(),
    });

    console.log("Invoice sent successfully!");
    return true;
  } catch (error) {
    console.error("Error Sending Invoice:", error);
    await sendMessage(
      chatId,
      "Please Try again!!, Unable to Generate Invoice."
    );
    return false;
  }
};

// 🔹Upload image to Cloud Firebase ( hit endpoint )
const uploadImage = async (caption: string, chatid: string, photos: any) => {
  try {
    let verifiedCaption = caption.toLowerCase();
    // verifiedCaption = verifiedCaption.includes("logo") ? "logo" : "logo";
    verifiedCaption = "logo";

    const highResolutionImg = photos[photos.length - 1];
    const fileId = highResolutionImg.file_id;
    console.log("Using file_id:", fileId);

    // Get file path from Telegram API from CDN
    const filePathRes = await axios.get(
      `${TELEGRAM_API}/getFile?file_id=${fileId}`
    );
    if (!filePathRes.data.ok) {
      console.error("Telegram API error:", filePathRes.data);
      await sendMessage(
        chatid,
        "⚠️ Failed to retrieve image from Telegram. Try again."
      );
      return;
    }

    console.log("Telegram filepath response = ", filePathRes.data);
    const filePath = filePathRes.data.result.file_path;

    // Get actual image from Telegram
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${filePath}`;
    const imageResponse = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });
    console.log("image response = ", imageResponse.data);
    const base64Image = Buffer.from(imageResponse.data).toString("base64");

    const form = new FormData();
    form.append("chatId", chatid);
    form.append("caption", verifiedCaption || "logo");
    form.append("image", Buffer.from(base64Image, "base64"), {
      filename: `${chatid}-${verifiedCaption}.jpg`,
      contentType: imageResponse.headers["content-type"] || "image/jpeg",
    });

    // Hit uploadImage endpoint
    await axios.post(`${process.env.DATABASE_URL}/updateUploadImage`, form, {
      headers: form.getHeaders(),
    });

    await sendMessage(
      chatid,
      `${verifiedCaption} stored successfull, Now you can generate invoices to see changes. 🥳 Happy Invoicing`
    );
  } catch (err: any) {
    console.error("Upload failed:", err?.response?.data || err.message);
    await sendMessage(
      chatid,
      "Please Try again!!, Make sure image type must be jpg/png/jpeg & of MAX size 1MB"
    );
    // await sendMessage(chatid, "Please Try again!!, Make sure you gave caption to image while sending and image type must be jpg/png/jpeg.");
  }
};

// 🔹 Send a text message to Telegram
const sendMessage = async (chatId: string, text: string) => {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text });
  } catch (error) {
    console.error("Error Sending Message:", error);
  }
};

// 🔹Pretend Bot as Typing
const sendTypingAction = async (chatId: string) => {
  try {
    await axios.post(`${TELEGRAM_API}/sendChatAction`, {
      chat_id: chatId,
      action: "typing",
    });
  } catch (error) {
    console.error("Error sending typing action:", error);
  }
};

// 🔹 Handle Errors & Send Default Message
const sendError = async (res: any, chatId: string, errorMessage: string) => {
  console.error(errorMessage);
  await sendMessage(chatId, errorMessage ? errorMessage : "Please try again!!");
  res.status(200).json({ error: errorMessage });
};

export { webhookController };

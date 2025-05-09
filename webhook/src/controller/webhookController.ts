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

    // 🖼️ Message empty that means image has been sent
    if(!message && req.body?.message?.photo){

      // Warning message
      await sendMessage(chatid, "Uploading in progress, WARNING⚠️: If no caption is identified then we consider the image as logo of your brand. \nAccepted Caption: qr, logo");
      
      const caption = req.body.message?.caption || "logo";
      const photos = req.body.message?.photo;
      if (!photos || photos.length === 0) {
        await sendMessage(chatid, "❌ No image received. Please try again.");
        return res.sendStatus(404);;
      }
      
      await uploadImage(caption, chatid, photos);
      return res.sendStatus(200);
    } 

    //🔸 Send Default Messages 
    if(message === "/start"){
      await sendMessage(chatid, defaultMessage["/start"]);
      await axios.post(`${process.env.DATABASE_URL}/createUser`, { chatId : chatid.toString() })
      return res.sendStatus(200);
    }
    //🔸 Send Default Messages
    else if(message === "/help"){
      await sendMessage(chatid, "Help commands yet to add");
      return res.sendStatus(200);
    }

    // 1. Verify and Extract data ( Data formation state )
    const verifyExtractData = await verifyAndExtract(message, chatid.toString());
    console.log('after verifaction response  = ', verifyExtractData, typeof(verifyExtractData));
    if (!verifyExtractData || verifyExtractData.type === "error" || verifyExtractData.type === "notify") return sendError(res, chatid, verifyExtractData.message || "Please try again!");

    if(verifyExtractData.type === "extraction"){
        // 2. Generate Invoice image
        const invoiceUrl = `https://bill-bot-invoice-templates.vercel.app/?chatId=${chatid.toString()}&data=${encodeURIComponent(
          JSON.stringify(verifyExtractData?.data)
        )}`;
    
        const imageBuffer = await generateInvoiceImage(invoiceUrl);
        if (!imageBuffer) return sendError(res, chatid, "Error generating invoice image.");
    
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
    return false;
  }
};

// 🔹Upload image to Cloud Firebase ( hit endpoint )
const uploadImage = async(caption: string, chatid: string, photos: any) => {
  try {
    let verifiedCaption = caption.toLowerCase();
      verifiedCaption = verifiedCaption.includes("logo") ? "logo" : "QR";

      const highResolutionImg = photos[photos.length - 1];
      const fileId = highResolutionImg.file_id

      // Get file path from Telegram API from CDN
      const filePathRes = await axios.get(`${TELEGRAM_API}/getFile?file_id=${fileId}`);
      const filePath = filePathRes.data.result.filePath;

      // Get actual image from Telegram
      const fileUrl =  `${TELEGRAM_API}/${filePath}`;
      const imageResponse = await axios.get(fileUrl, { responseType: "arraybuffer"});

      const form = new FormData();
      form.append("chatId", chatid);
      form.append("caption", verifiedCaption || "logo");
      form.append("image", Buffer.from(imageResponse.data), {
        filename: `${chatid}-${verifiedCaption || "logo"}`,
        contentType: imageResponse.headers['content-type']
      });
      
      // Hit uploadImage endpoint
      const uploadRes = await axios.post(
        `${process.env.DATABASE_URL}/updateUploadImage`,
        form,
        { headers: form.getHeaders() }
      );
      await sendMessage(chatid, `${verifiedCaption} stored successfull, Now you can generate invoices to see changes. 🥳 Happy Invoicing`);
  } catch (err:any) {
    console.error("Upload failed:", err?.response?.data || err.message);
    await sendMessage(chatid, "Please Try again!!, Make sure you gave caption to image while sending and image type must be jpg/png/jpeg.");
  }
      
}

// 🔹 Send a text message to Telegram
const sendMessage = async (chatId: string, text: string) => {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text });
  } catch (error) {
    console.error("Error Sending Message:", error);
  }
};

// 🔹 Handle Errors & Send Default Message
const sendError = async (res: any, chatId: string, errorMessage: string) => {
  console.error(errorMessage);
  await sendMessage(chatId, errorMessage ? errorMessage : "Please try again!!");
  res.status(200).json({ error: errorMessage });
};

export { webhookController };

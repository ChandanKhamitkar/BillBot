import express from "express";
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
    const message = req.body?.message?.text;
    const chatid = req.body?.message?.chat?.id;

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

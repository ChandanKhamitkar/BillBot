import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import generateInvoiceImage from "../services/imageGen.js";
import FormData from "form-data";
import { Readable } from "stream";

dotenv.config();

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

const webhookController = async (req: any, res: any) => {
  try {
    console.log("Full data received : ", req.body);
    const message = req.body?.message?.text;
    const chatid = req.body?.message?.chat?.id;

    // 1. Extract data ( Data formation state)
    const extractedData = await extractData(message);
    if (!extractedData) return sendError(res, chatid, "Extraction failed.");

    // 2. Generate Invoice image
    const invoiceUrl = `https://bill-bot-invoice-templates.vercel.app/?data=${encodeURIComponent(
      JSON.stringify(extractedData)
    )}`;

    const imageBuffer = await generateInvoiceImage(invoiceUrl);
    if (!imageBuffer)
      return sendError(res, chatid, "Error generating invoice image.");
    // console.log("Image buffer : ", imageBuffer);

    // 3. Send Invoice image
    const imageSent = await sendInvoiceToTelegram(chatid, imageBuffer);
    if (!imageSent) return sendError(res, chatid, "Error sending invoice.");

    // Send extracted text as confirmation message
    await sendMessage(chatid, "Here is your invoice Generated...");

    return res.sendStatus(200);
  } catch (error) {
    console.log("Error : ", error);
    return res.sendStatus(200);
  }
};

// 1🔹 Extract data using GenAI API
const extractData = async (message: string) => {
  try {
    // const response = await axios.post(
    //   "http://localhost:3002/extractData",
    //   { text: JSON.stringify(message) }
    // );
    const response = await axios.post(
      "https://bill-bot-genai.vercel.app/extractData",
      { text: JSON.stringify(message) }
    );
    return response.data.result;
  } catch (error) {
    console.error("Extraction Error:", error);
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
  await sendMessage(chatId, "Please try again!!");
  res.status(200).json({ error: errorMessage });
};

export { webhookController };

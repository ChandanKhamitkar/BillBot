import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

const webhookController = async (req: any, res: any) => {
  try {
    console.log("Full data received : ", req.body);
    const message = req.body?.message?.text;
    const chatid = req.body?.message?.chat?.id;

    try {
      const extract = await axios.post(
        "https://bill-bot-genai.vercel.app/extractData", message
      );

      try {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatid,
          text: extract.data,
        });

        res.sendStatus(200);
      } catch (error) {

        console.log("Error : ", error);
        res.json({ error: "Error in sending message to user" });
      }
    } catch (error) {

      res.status(500).json({ error: "Extraction failed." });
      console.error("Extraction failed : ", error);
    }
  } catch (error) {

    res.sendStatus(500);
    console.log("Error : ", error);
  }
};

export { webhookController };

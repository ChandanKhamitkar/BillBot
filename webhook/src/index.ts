import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body?.message?.text || "";
    const chatid = req.body?.message?.chat?.id || "";

    console.log(
      "Message received from user ",
      message,
      "and user's chat id = ",
      chatid
    );

    try {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatid,
        text: message,
      });
      res.sendStatus(200);
    } catch (error) {
      console.log("Error : ", error);
      res.json({ error: "Error in sending message to user" });
    }
  } catch (error) {
    res.sendStatus(400);
    console.log("Error : ", error);
  }
});

app.listen(port, () => {
  console.log("Webhook BillBot is running...");
});

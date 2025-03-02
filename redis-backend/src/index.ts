import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { Redis } from "@upstash/redis";

dotenv.config();

const app = express();
const port = process.env.PORT || 3006;
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Upstash Redis connection
const redis = new Redis({
  url: `${process.env.UPSTASH_REDIS_REST_URL}`,
  token: `${process.env.UPSTASH_REDIS_REST_TOKEN}`,
});

const setBDetailFun = async (chatId: string, data: any) => {
  const expiry = 6 * 60 * 60;
  await redis.set(chatId, JSON.stringify(data), { ex: expiry });
};

// Default GET route
app.get("/", (req, res) => {
  res.send(
    "Redis for BillBot is Running"
  );
});

// SET Business Details
app.post("/setBusinessDetails", async (req: any, res: any) => {
  try {
    const { chatId, data } = req.body;

    if (!chatId || !data) {
      return res
        .status(400)
        .json({ error: "chatId and Data are required in the body." });
    }
    await setBDetailFun(chatId, data);
    return res.status(200).json({ message: "Details Set successfully" });
  } catch (error) {
    console.error(
      `[ERROR] ${new Date().toISOString()} - Setting Business Details:`,
      error
    );
    return res
      .status(500)
      .json({ message: "Error in Setting Business Details" });
  }
});

// GET Business Details
app.get("/getBusinessDetails", async (req: any, res: any) => {
  try {
    const { chatId } = req.query;

    if (!chatId) {
      return res
        .status(400)
        .json({ error: "chatId is required as a query parameter." });
    }

    let result = await redis.get(chatId as string);
    if (result) {
      result = typeof result === "string" ? JSON.parse(result) : result;
    } else {
      try {
        const dbResult = await axios.post(
          `${process.env.DATABASE_URL}/getBusinessDetails`,
          { chatId }
        );
        result = dbResult.data.result;
        if (result) await setBDetailFun(chatId as string, result);
      } catch (axiosError) {
        console.error(
          `[ERROR] ${new Date().toISOString()} - Fetching from DB failed:`,
          axiosError
        );
        return res
          .status(500)
          .json({ message: "Error fetching details from DB" });
      }
    }

    return res.status(200).json({ chatId, result });
  } catch (error) {
    console.error(
      `[ERROR] ${new Date().toISOString()} - Getting Business Details:`,
      error
    );
    return res
      .status(500)
      .json({ message: "Error in Getting Business Details" });
  }
});

app.listen(port, () => {
  console.log(`Upstash Redis Server running on ${port}`);
});

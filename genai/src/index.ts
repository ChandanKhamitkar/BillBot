import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
app.use(express.json());
app.use(express.text());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Gemini API setup
const apiKey = process.env.API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-001",
});

app.post("/extractData", async (req, res) => {
  try {
    const message = req.body;
    console.log("req.body = ", message);
    const result = await extractBillingData(message);
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error in extrating data : ", error);
    res.status(500).json({ error: "Extraction failed." });
  }
});

const extractBillingData = async (message: any) => {
  const prompt = `Here is the customer details and items that user requested, details : ${message}, and now extract & format me the details that I've provided to you in clean JSON format. Ensure the output are easy to parse and display in the frontend. Structure it as follows:
    {
        "name": "name of the customer",
        "phone" : "+91 1234567890", // if the country code is not present then keep "+91" as default
        "items" : [
                    {
                        "itemName": "name of the item1",
                        "quantity": "1" // if no quantity is provided keep "1" as default
                        "price" : "100"  // ( multiply this price by quantity, example: qty : 2 & price = 200 then give price as 2x200 = 400 ) if no price is provided keep "100" as default
                    },
                    {
                        "itemName": "name of the item2",
                        "quantity": "1" // if no quantity is provided keep "1" as default
                        "price" : "100"  // ( multiply this price by quantity, example: qty : 2 & price = 200 then give price as 2x200 = 400 ) if no price is provided keep "100" as default
                    },
                ],
        "total" : "sum of prices of all items in the above items array",
        "shipping" : "shipping price" // if shipping price is not provided then keep "0" as default,
        "grandTotal" : "total + shipping"
    }

    Make sure key names of the json object must follow as mentioned above structure.
    `;

  try {
    const result = await model.generateContent([prompt]);
    let extractedData = result.response.text();

    const jsonMatch = extractedData.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      extractedData = jsonMatch[1];
    }
    console.log("Extracted Data : ", JSON.parse(extractedData));
    return JSON.parse(extractedData);
  } catch (error) {
    console.error("Error extracting data: ", error);
    throw error;
  }
};

// Default GET route
app.get("/", (req, res) => {
  res.send(
    "Webhook GenAI is running, I will extract and format the data properly, just chill. ✅"
  );
});

app.listen(port, () => {
  console.log("Webhook GenAi is running...🏃‍➡️", port);
});

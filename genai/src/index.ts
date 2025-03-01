import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
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

// Gemini API setup
const apiKey = process.env.API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-001",
});

app.post("/verifyMsg", async (req, res) => {
  try {
    const message = req.body.text;
    const chatId = req.body.chatId;
    console.log("req.body = ", message);
    const result = await verifyMessageType(message, chatId);
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error in Verifying Message type : ", error);
    res
      .status(500)
      .json({ type: "error", message: "Message Verification Failed" });
  }
});

const verifyMessageType = async (message: any, chatId: string) => {
  const prompt = `Here is the message : ${message}, as per my application requirements there are only two valid message types:
  1. Customer Billing Details
    - Customer Name
    - Phone Number
    - List of items
      - Consists of itemName, Quantity, Unit Price
    - Shipping

  2. Business Details, such as:
    - Business Name
    - Owner Name
    - email
    - address
    - gstPercent
    - UPIID

  It's not neccessary that message consists the fields as mentioned, however mentioned two types are the standard message types.

  Analyze the message based on the two types mentioned and Format the details in a clean JSON format. Ensure the output are easy to parse and display in the frontend. 
  Instruction Analysis:
    - If message is of type 1, then do:
      Extract customer details and items that present in the message.
      Structure it as follows:
        {   
            "type": "customer",
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
        
    - If message is of type 2, then do:
        Extract Business details and that present in the message. 
        Structure it as follows:
          {   
                "type": "business",
                "businessName": "name of the business", // if business name is not present, keep empty string "" as default
                "ownerName": "name of the owner", // if owner name is not present, keep empty string "" as default
                "email" : "email of the business", // if the email is not present, then keep empty string "" as default
                "address" : "address of the business", // if the address is not present, then keep empty string "" as default
                "gstPercent" : "GST percentage of the business", // if the GST Percent is not present, then keep empty string "" as default
                "UPIID" : "UPIID of the business", // if the UPIID is not present, then keep empty string "" as default 
          }
    - If message is neither of type 1 nor 2, then return { type : other }

  Make sure key names of the json object must follow as mentioned in the sample structure.
  `;

  try {
    const result = await model.generateContent([prompt]);
    let verifiedType = result.response.text();

    const jsonMatch = verifiedType.match(/```json\n([\s\S]*?)\n```/);
    const parsedData = jsonMatch
      ? JSON.parse(jsonMatch[1])
      : JSON.parse(verifiedType);
    console.log("Extracted Data + Type:", parsedData);

    // Conditional Checks
    if (!parsedData?.type) {
      return { type: "notify", message: "Message type is not recognized!" };
    }
    switch (parsedData.type) {
      case "customer":
        return {
          type: "extraction",
          data: parsedData,
          message: "Here is your generated Invoice",
        };

      case "business":
        await axios.post(`${process.env.DATABASE_URL}/updateBusinessDetails`, {
          data: parsedData,
          chatId,
        });
        return { type: "notify", message: "Data Stored Successfully ✅" };

      default:
        return {
          type: "notify",
          message: `🚫 Invalid message format!\n\nWe accept only two types of messages:\n
                    1️⃣ *Customer Billing Details*\n*Example:*\nJohn Doe, 9876543210\nItems: Apple-2-50, Orange-1-30\nShipping: 20\n
                    2️⃣ *Business Details*\n*Example:*\nBusiness: ABC Store\nOwner: John Doe\nEmail: abc@email.com\nAddress: XYZ Street\nGST: 18%\nUPI: abc@upi\n\nPlease follow one of these formats and try again. ✅`,
        };
    }
  } catch (error) {
    console.error("Error extracting data: ", error);
    return JSON.stringify({
      type: "notify",
      message: "Error in verifying message ✖️",
    });
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

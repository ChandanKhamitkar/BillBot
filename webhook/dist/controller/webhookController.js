var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import dotenv from "dotenv";
import generateInvoiceImage from "../services/imageGen.js";
import FormData from "form-data";
import { Readable } from "stream";
import { defaultMessage } from "../utils/defaultMessages.js";
dotenv.config();
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;
const webhookController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        console.log("Full data received : ", req.body);
        const message = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.text;
        const chatid = (_e = (_d = (_c = req.body) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.chat) === null || _e === void 0 ? void 0 : _e.id;
        //🔸 Send Default Messages 
        if (message === "/start") {
            yield sendMessage(chatid, defaultMessage["/start"]);
            yield axios.post(`${process.env.DATABASE_URL}/createUser`, { chatId: chatid.toString() });
            return res.sendStatus(200);
        }
        //🔸 Send Default Messages
        else if (message === "/help") {
            yield sendMessage(chatid, "Help commands yet to add");
            return res.sendStatus(200);
        }
        // 1. Verify and Extract data ( Data formation state )
        const verifyExtractData = yield verifyAndExtract(message, chatid.toString());
        console.log('after verifaction response  = ', verifyExtractData, typeof (verifyExtractData));
        if (!verifyExtractData || verifyExtractData.type === "error" || verifyExtractData.type === "notify")
            return sendError(res, chatid, verifyExtractData.message || "Please try again!");
        if (verifyExtractData.type === "extraction") {
            // 2. Generate Invoice image
            // const invoiceUrl = `https://bill-bot-invoice-templates.vercel.app/?chatId=${chatid.toString()}&data=${encodeURIComponent(
            //   JSON.stringify(verifyExtractData?.data)
            // )}`;
            const invoiceUrl = `http://localhost:3000/?chatId=${chatid.toString()}&data=${encodeURIComponent(JSON.stringify(verifyExtractData === null || verifyExtractData === void 0 ? void 0 : verifyExtractData.data))}`;
            const imageBuffer = yield generateInvoiceImage(invoiceUrl);
            if (!imageBuffer)
                return sendError(res, chatid, "Error generating invoice image.");
            // 3. Send Invoice image
            const imageSent = yield sendInvoiceToTelegram(chatid, imageBuffer);
            if (!imageSent)
                return sendError(res, chatid, "Error sending invoice.");
            // Send extracted text as confirmation message
            yield sendMessage(chatid, "Here is your invoice Generated...");
        }
        return res.sendStatus(200);
    }
    catch (error) {
        console.log("Error : ", error);
        return res.sendStatus(200);
    }
});
// 1🔹 Verify and Extract data using GenAI API
const verifyAndExtract = (message, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.post("http://localhost:3002/verifyMsg", { text: JSON.stringify(message), chatId: chatId });
        console.log("response from genai = ", response.data);
        // const response = await axios.post(
        //   "https://bill-bot-genai.vercel.app/verifyMsg",
        //   { text: JSON.stringify(message), chatId: chatId }
        // );
        return response.data.result;
    }
    catch (error) {
        console.error("Verification and Extraction Error:", error);
        return null;
    }
});
// 🔹 Send the invoice image to Telegram
const sendInvoiceToTelegram = (chatId, imageBuffer) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield axios.post(`${TELEGRAM_API}/sendPhoto`, form, {
            headers: form.getHeaders(),
        });
        console.log("Invoice sent successfully!");
        return true;
    }
    catch (error) {
        console.error("Error Sending Invoice:", error);
        return false;
    }
});
// 🔹 Send a text message to Telegram
const sendMessage = (chatId, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text });
    }
    catch (error) {
        console.error("Error Sending Message:", error);
    }
});
// 🔹 Handle Errors & Send Default Message
const sendError = (res, chatId, errorMessage) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(errorMessage);
    yield sendMessage(chatId, errorMessage ? errorMessage : "Please try again!!");
    res.status(200).json({ error: errorMessage });
});
export { webhookController };

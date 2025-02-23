var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;
app.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const message = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.text) || "";
        const chatid = ((_e = (_d = (_c = req.body) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.chat) === null || _e === void 0 ? void 0 : _e.id) || "";
        console.log("Message received from user ", message, "and user's chat id = ", chatid);
        try {
            yield axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: chatid,
                text: message,
            });
            res.sendStatus(200);
        }
        catch (error) {
            console.log("Error : ", error);
            res.json({ error: "Error in sending message to user" });
        }
    }
    catch (error) {
        res.sendStatus(400);
        console.log("Error : ", error);
    }
}));
// Default GET route
app.get("/", (req, res) => {
    res.send("Webhook BillBot is running, do not worry I'll handle the server, you go code...🧑‍💻");
});
app.listen(port, () => {
    console.log("Webhook BillBot is running...");
});

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
dotenv.config();
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;
const webhookController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        console.log("Full data received : ", req.body);
        const message = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.text) || "";
        const chatid = ((_e = (_d = (_c = req.body) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.chat) === null || _e === void 0 ? void 0 : _e.id) || "";
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
});
export { webhookController };

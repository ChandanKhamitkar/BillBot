var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma } from "../lib/prisma.js";
// method: POST
// Desc: Get User's Business Details ( such as : Business Name, Owner Name, email, address, gst, upiid)
export const getBusinessDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { chatId } = req.body;
        // typecast to avoid errors
        chatId = chatId === null || chatId === void 0 ? void 0 : chatId.toString();
        if (!chatId) {
            return res
                .status(400)
                .json({ success: false, message: "chatId is required" });
        }
        const result = yield prisma.user.findUnique({
            where: {
                chatId
            },
            select: {
                email: true,
                businessName: true,
                ownerName: true,
                address: true,
                UPIID: true,
                QR: true,
                logo: true,
                gstPercent: true,
                templateNo: true
            }
        });
        return res
            .status(200)
            .json({
            success: true,
            result,
            message: "Business Details Read Successfully",
        });
    }
    catch (error) {
        console.log("Error while Reading Business Details: ", error);
        return res
            .status(500)
            .json({
            success: false,
            message: "Error while reading Business Details",
        });
    }
});

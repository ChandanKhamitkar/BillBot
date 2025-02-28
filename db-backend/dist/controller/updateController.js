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
// Desc: Update user's Business Details ( such as : Business Name, Owner Name, email, address, gst, upiid)
export const updateBusinessDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { chatId, data } = req.body;
        let { email, businessName, ownerName, address, UPIID, gstPercent } = data;
        // typecast to avoid errors
        chatId = chatId === null || chatId === void 0 ? void 0 : chatId.toString();
        email = email === null || email === void 0 ? void 0 : email.toString();
        businessName = businessName === null || businessName === void 0 ? void 0 : businessName.toString();
        ownerName = ownerName === null || ownerName === void 0 ? void 0 : ownerName.toString();
        address = address === null || address === void 0 ? void 0 : address.toString();
        UPIID = UPIID === null || UPIID === void 0 ? void 0 : UPIID.toString();
        gstPercent = gstPercent ? parseInt(gstPercent, 10) : 0;
        if (!chatId) {
            return res
                .status(400)
                .json({ success: false, message: "chatId is required" });
        }
        yield prisma.user.update({
            where: {
                chatId,
            },
            data: {
                email,
                businessName,
                ownerName,
                address,
                UPIID,
                gstPercent,
            },
        });
        return res
            .status(200)
            .json({
            success: true,
            message: "Business Details Updated Successfully",
        });
    }
    catch (error) {
        console.log("Error while updating Business Details: ", error);
        return res
            .status(500)
            .json({
            success: false,
            message: "Error while updating Business Details",
        });
    }
});

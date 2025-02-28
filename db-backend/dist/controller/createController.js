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
// Desc: Create new user with chatID.
export const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = yield req.body;
        if (!chatId) {
            return res
                .status(400)
                .json({
                success: false,
                message: "ChatId is mandatory to create user",
            });
        }
        yield prisma.user.create({
            data: {
                chatId,
            },
        });
        return res
            .status(200)
            .json({ success: true, message: "User Created Successfully" });
    }
    catch (error) {
        console.log("Error while Creating user: ", error);
        return res
            .status(500)
            .json({ success: false, message: "Error while Creating user" });
    }
});

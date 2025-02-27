import { prisma } from "../lib/prisma.js";

// method: POST
// Desc: Create new user with chatID.
export const createUser = async (req: any, res: any) => {
  try {
    const { chatId } = await req.body;
    if (!chatId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "ChatId is mandatory to create user",
        });
    }

    await prisma.user.create({
      data: {
        chatId,
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "User Created Successfully" });
  } catch (error) {
    console.log("Error while Creating user: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Error while Creating user" });
  }
};



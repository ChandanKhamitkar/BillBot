import { prisma } from "../lib/prisma.js";

// method: POST
// Desc: Get User's Business Details ( such as : Business Name, Owner Name, email, address, gst, upiid)
export const getBusinessDetails = async (req: any, res: any) => {
  try {
    let { chatId } = req.body;

    // typecast to avoid errors
    chatId = chatId?.toString();
    if (!chatId) {
      return res
        .status(400)
        .json({ success: false, message: "chatId is required" });
    }

    const result = await prisma.user.findUnique({
        where: {
            chatId
        },
        select: {
            email: true,
            businessName: true,
            ownerName: true,
            address: true,
            UPIID: true,
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
  } catch (error) {
    console.log("Error while Reading Business Details: ", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error while reading Business Details",
      });
  }
};

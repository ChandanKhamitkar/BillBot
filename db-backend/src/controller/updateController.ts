import { prisma } from "../lib/prisma.js";
import axios from "axios";

// method: POST
// Desc: Update user's Business Details ( such as : Business Name, Owner Name, email, address, gst, upiid)
export const updateBusinessDetails = async (req: any, res: any) => {
  try {
    let { chatId, data } = req.body;
    let { email, businessName, ownerName, address, UPIID, gstPercent } = data;

    // typecast to avoid errors
    chatId = chatId?.toString();
    email = email?.toString();
    businessName = businessName?.toString();
    ownerName = ownerName?.toString();
    address = address?.toString();
    UPIID = UPIID?.toString();
    gstPercent = gstPercent ? parseInt(gstPercent, 10) : 0;

    if (!chatId) {
      return res
        .status(400)
        .json({ success: false, message: "chatId is required" });
    }

    const response = await prisma.user.update({
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
      select: {
        email: true,
        businessName: true,
        ownerName: true,
        address: true,
        UPIID: true,
        QR: true,
        logo: true,
        gstPercent: true,
        templateNo: true,
      },
    });

    // update the redis cache as well
    await axios.post(`${process.env.REDIS_URL}/setBusinessDetails`, {chatId, data: response});
    
    return res.status(200).json({
      success: true,
      message: "Business Details Updated Successfully",
    });
  } catch (error) {
    console.log("Error while updating Business Details: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating Business Details",
    });
  }
};

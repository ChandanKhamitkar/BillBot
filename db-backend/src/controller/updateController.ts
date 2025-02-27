import { prisma } from "../lib/prisma.js";

// method: POST
// Desc: Update user's Business Details ( such as : Business Name, Owner Name, email, address, gst, upiid)
export const updateBusinessDetails = async (req: any, res: any) => {
  try {
    const { chatId, email, businessName, ownerName, address, UPIID, QR, gstPercent } = await req.body;

    await prisma.user.update({
      where: {
        chatId,
      },
      data: {
        email,
        businessName,
        ownerName,
        address,
        UPIID,
        QR,
        gstPercent
      }
    });

    return res
      .status(200)
      .json({ success: true, message: "Business Details Updated Successfully" });
  } catch (error) {
    console.log("Error while updating Business Details: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Error while updating Business Details" });
  }
};



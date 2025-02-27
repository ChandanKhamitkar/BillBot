import { prisma } from "../lib/prisma.js";

// method: POST
// Desc: Update user's Business Details ( such as : Business Name, Owner Name, email, address, gst, upiid)
export const updateBusinessDetails = async (req: any, res: any) => {
  try {
    let { chatId, email, businessName, ownerName, address, UPIID, gstPercent } = await req.body;

    // typecast to avoid errors
    chatId = chatId?.toString();
    email = email?.toString();
    businessName = businessName?.toString();
    ownerName = ownerName?.toString();
    address = address?.toString();
    UPIID = UPIID?.toString();
    gstPercent = gstPercent ? parseInt(gstPercent, 10) : 0;

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



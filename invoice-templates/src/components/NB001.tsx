import { DisplayDataTypes } from "@/types/data";
import { useEffect } from "react";
import generateQRUPI from "@/lib/generaterQR";

export default function NB001(props: DisplayDataTypes) {
  const { data, businessDetails } = props;
  const { name = "", phone = "", items = [], total = "0", shipping = "0", grandTotal = "0" } = data || {};

  useEffect(() => {
    getQR(data.grandTotal);
  }, [data.grandTotal]);

  async function getQR(grandTotal: string) {
    const QR = await generateQRUPI(businessDetails.UPIID || "", businessDetails.ownerName || "", grandTotal);
    if (QR) {
      businessDetails.QR = QR.toString();
    }
  }


  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex justify-center item-center mx-auto text-black">
      {/* main card */}
      <div className="bg-white  w-[999px] min-h-[1000px] py-16 px-14 relative">
        <img
          src={businessDetails.logo ? `${businessDetails.logo}` : "/brandLogo.png"}
          alt="Brand Logo"
          className="w-80 h-80 opacity-15 absolute inset-0 m-auto transform   -translate-y-1"
        />
        {/* div containing logo Invoice title, billed to details, invoiceNO, date */}
        <div className="flex flex-col justify-center items-center space-y-7">
          <div className="w-full flex justify-between items-center mx-auto ">
            <div className="flex justify-center items-center gap-4 flex-row-reverse">
              <div className="text-right space-y-0">
                <p className="font-bold tracking-wide">{businessDetails.businessName || "Your Business/Company name"}</p>
                <p></p>
              </div>
              <img
                src={businessDetails.logo ? `${businessDetails.logo}` : "/brandLogo.png"}
                alt="Brand Logo"
                className="w-16 h-16"
              />
            </div>{" "}
            <p className="text-5xl font-mono tracking-wide uppercase">
              Invoice
            </p>
          </div>

          <div className="w-full flex justify-between items-center mx-auto">
            <ul>
              <li>
                <p className="font-semibold uppercase mb-1">Billed TO:</p>
              </li>
              <li>
                <p>{name ? name : ""}</p>
              </li>
              <li>
                <p>{phone ? phone : ""}</p>
              </li>
              <li>
                <p>--</p>
              </li>
            </ul>

            <ul className="text-right">
              <li>Invoice No. 0000</li>
              <li>{currentDate}</li>
            </ul>
          </div>
        </div>

        <table className="table-auto w-full mt-20">
          <thead>
            <tr className="text-left border-y-2 border-black">
              <th className="py-3 px-2">Item</th>
              <th className="py-3 text-center">Quantity</th>
              <th className="py-3 text-center">Unit Total</th>
            </tr>
          </thead>
          <tbody className="border-b-2 border-black ">
            {items &&
              items.map((row: any, index: number) => (
                <tr key={index}>
                  <td className="pb-2 px-2">{row.itemName}</td>
                  <td className="text-center">{row.quantity}</td>
                  <td className="text-center">
                    <span>{row.price}/-</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Subtotal, total, shipping charges */}
        <div className="float-right min-w-[20%] mt-6 space-y-4 mb-32  ">
          <p className="flex justify-between items-center">
            <span className="font-semibold">Subtotal</span>
            <span>{total}/-</span>
          </p>
          <p className="flex justify-between items-center">
            <span className="font-semibold">GST</span>
            <span>{businessDetails?.gstPercent ?? 18}%</span>
          </p>
          <p className="flex justify-between items-center">
            <span className="font-semibold text-sm">Shipping Charges</span>
            <span>{shipping || 0}/-</span>
          </p>
          <div className="h-0.5 bg-black"></div>
          <p className="flex justify-between items-center font-bold text-xl">
            <span>Total</span>
            <span>{Number(grandTotal) + Number(shipping)}/-</span>
          </p>
        </div>

        <div className="mt-6">
          <div className="w-full flex justify-between items-center">
            <div>
              <p className="text-2xl font-mono mb-20">Thankyou!</p>
              <p className="uppercase font-semibold">payment information</p>
              {/* <p>Bank Name : Swapna Khamitkar</p> */}
              <div className="flex flex-col justify-start items start space-y-2">
                <p>UPI ID: {businessDetails.UPIID || "Payment UPI ID"}</p>
                <img src={businessDetails.QR ? businessDetails.QR : "/SampleQR.png"} alt="Payment QR code" className="h-52" />
              </div>
              {/* <p>Account Holder Name : Swapna Khamitkar</p>
              <p>Account Number : 1234567890</p> */}
            </div>
            <div className="self-end">
              <p className="font-serif text-xl">{businessDetails?.ownerName || "Owner Name"}</p>

              <p>{businessDetails.email || "Business Email"}</p>
              <p>
                {businessDetails.address || "Address"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  let rawData = searchParams.get('data');

  if (!rawData) return <p>Loading invoice...</p>;

  try {
    if (rawData.startsWith('"') && rawData.endsWith('"')) {
      rawData = rawData.slice(1, -1);
    }

    const data = JSON.parse(decodeURIComponent(rawData));

    if (!data.items || !Array.isArray(data.items)) {
      return <p>Error: Invalid data format</p>;
    }

    return (

      <div style={{ padding: "20px", fontFamily: "Arial" }} className="bg-blue-300 text-black">
        <h2>Invoice for {data.name}</h2>
        <table border={1} width="100%">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item: any, index: any) => (
              <tr key={index}>
                <td>{item.itemName}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Total: ₹{data.total}</h3>
        <h3>Shipping: ₹{data.shipping}</h3>
        <h3>Grand Total: ₹{data.grandTotal}</h3>
      </div>
    );
  } catch (error) {
    console.error("Error parsing data:", error);
    return <p>Error: Invalid invoice data</p>;
  }
}

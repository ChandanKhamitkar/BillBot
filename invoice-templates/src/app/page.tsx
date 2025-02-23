'use client';
import NB001 from "@/components/NB001";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  let rawData = searchParams.get('data');

  if (!rawData) return <p>Loading invoice...</p>;

  try {
    if (rawData.startsWith('"') && rawData.endsWith('"')) {
      rawData = rawData.slice(1, -1);
    }

    const data = JSON.parse(decodeURIComponent(rawData));
    // const data = {
    //   name: "Chandan",
    //   phone: "13425643213",
    //   items: [
    //     {
    //       itemName: "Face wash", quantity: "3", price: "300",
    //     },
    //     {
    //       itemName: "Face wash", quantity: "3", price: "300",
    //     },
    //     {
    //       itemName: "Face wash", quantity: "3", price: "300",
    //     },
    //   ],
    //   total: "6789",
    //   shipping: "6789",
    //   grandTotal: "6789",
    // };

    if (!data.items || !Array.isArray(data.items)) {
      return <p>Error: Invalid data format</p>;
    }

    return (
      <NB001 name={data.name} phone={data.phone} items={data.items} total={data.total} shipping={data.shipping} grandTotal={data.grandTotal} />
    );
  } catch (error) {
    console.error("Error parsing data:", error);
    return <p>Error: Invalid invoice data</p>;
  }
}

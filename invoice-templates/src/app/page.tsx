'use client';
import NB001 from "@/components/NB001";
import { BusinessDetailsTypes } from "@/types/data";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  let chatId = searchParams.get('chatId');
  let rawData = searchParams.get('data');

  const [businessDetails, setBusinessDetails] = useState<BusinessDetailsTypes>({});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!chatId) return;

    const fetchBusinessDetails = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_DATABASE_URL}/getBusinessDetails`, { chatId });
        setBusinessDetails(response.data.result);
      } catch (error) {
        console.error('Failed to fetch Business Details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [chatId]);

  if (!rawData || !chatId) return <p>Loading invoice...</p>;

  try {
    if (rawData.startsWith('"') && rawData.endsWith('"')) {
      rawData = rawData.slice(1, -1);
    }

    let data;
    try {
      data = JSON.parse(decodeURIComponent(rawData));

    } catch (error) {
      console.error("Error decoding/parsing data:", error);
      return <p>Error: Invalid invoice data</p>;
    }

    if (!data.items || !Array.isArray(data.items)) {
      return <p>Error: Invalid data format</p>;
    }

    if (loading || !businessDetails) {
      return <p>Loading business details...</p>;
    }

    return (
      <NB001
        businessDetails={businessDetails}
        data={data}
      />
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return <p>Error: Something went wrong</p>;
  }
}

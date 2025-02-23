import puppeteer from "puppeteer";
// import chromium from "chrome-aws-lambda";
import dotenv from "dotenv";
import chromium from "@sparticuz/chromium";
dotenv.config();

export default async function generateInvoiceImage(invoiceUrl: string) {
  
  // console.log("Using Chromium Path:", await chromium.executablePath());
  
  // Production Mode ✅
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  // Development mode ✔️
  // const browser = await puppeteer.launch({
  //   headless: true,
  //   args: [
  //     "--no-sandbox", 
  //     "--disable-setuid-sandbox"
  //   ],
  // });
  const page = await browser.newPage();
  await page.goto(invoiceUrl, { waitUntil: "networkidle0" });

  const image = await page.screenshot({ encoding: "binary", fullPage: true });

  await browser.close();
  return image;
}

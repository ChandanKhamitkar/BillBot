import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

export default async function generateInvoiceImage(invoiceUrl: string) {
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox", 
      "--disable-setuid-sandbox"
    ],
    executablePath: "/home/sbx_user1051/.cache/puppeteer/chrome/linux-133.0.6943.98/chrome-linux64/chrome",
  });
  console.log("Chromium path:", await puppeteer.executablePath());
  const page = await browser.newPage();
  await page.goto(invoiceUrl, { waitUntil: "networkidle0" });

  const image = await page.screenshot({ encoding: "binary", fullPage: true });

  await browser.close();
  return image;
}

import puppeteer from "puppeteer";
// import chromium from "chrome-aws-lambda";
import dotenv from "dotenv";
import chromium from "@sparticuz/chromium";
dotenv.config();

export default async function generateInvoiceImage(invoiceUrl: string) {
  
  // console.log("Chromium path:", await puppeteer.executablePath());
  console.log("Using Chromium Path:", await chromium.executablePath());
  
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });


  // const browser = await puppeteer.launch({
  //   headless: true,
  //   args: [
  //     "--no-sandbox", 
  //     "--disable-setuid-sandbox"
  //   ],
  //   // executablePath: "/home/sbx_user1051/.cache/puppeteer/chrome/linux-133.0.6943.98/chrome-linux64/chrome",
  //   executablePath: puppeteer.executablePath()
  // });
  const page = await browser.newPage();
  await page.goto(invoiceUrl, { waitUntil: "networkidle0" });

  const image = await page.screenshot({ encoding: "binary", fullPage: true });

  await browser.close();
  return image;
}

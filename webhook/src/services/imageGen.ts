import puppeteer from "puppeteer";

export default async function generateInvoiceImage(invoiceUrl: string) {
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox", 
      "--disable-setuid-sandbox"
    ],
    executablePath: process.env.CHROME_EXECUTABLE_PATH || "/tmp/puppeteer-cache/chrome",
  });
  console.log("Chromium path:", await puppeteer.executablePath());
  const page = await browser.newPage();
  await page.goto(invoiceUrl, { waitUntil: "networkidle0" });

  const image = await page.screenshot({ encoding: "binary", fullPage: true });

  await browser.close();
  return image;
}

import puppeteer from "puppeteer";

export default async function generateInvoiceImage(invoiceUrl: string) {
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox", 
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
    executablePath: process.env.CHROME_EXECUTABLE_PATH || "/usr/bin/chromium",
  });

  const page = await browser.newPage();
  await page.goto(invoiceUrl, { waitUntil: "networkidle0" });

  const image = await page.screenshot({ encoding: "binary", fullPage: true });

  await browser.close();
  return image;
}

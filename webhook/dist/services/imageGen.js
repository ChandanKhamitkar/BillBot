var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from "puppeteer";
// import chromium from "chrome-aws-lambda";
import dotenv from "dotenv";
import chromium from "@sparticuz/chromium";
dotenv.config();
export default function generateInvoiceImage(invoiceUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log("Chromium path:", await puppeteer.executablePath());
        console.log("Using Chromium Path:", yield chromium.executablePath());
        // const browser = await puppeteer.launch({
        //   args: chromium.args,
        //   // executablePath: await chromium.executablePath(),
        //   headless: true,
        // });
        const browser = yield puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ],
            // executablePath: "/home/sbx_user1051/.cache/puppeteer/chrome/linux-133.0.6943.98/chrome-linux64/chrome",
            // executablePath: puppeteer.executablePath()
        });
        const page = yield browser.newPage();
        yield page.goto(invoiceUrl, { waitUntil: "networkidle0" });
        const image = yield page.screenshot({ encoding: "binary", fullPage: true });
        yield browser.close();
        return image;
    });
}

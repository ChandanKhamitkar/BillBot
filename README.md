# 📃 **BillBot - AI-powered Invoice Generator**

🚀 BillBot is an AI-powered Telegram bot that extracts structured data from text messages, generates professional invoices using Next.js, and delivers them as images via a webhook. It leverages GenAI for data extraction, Puppeteer for rendering, and is optimized for Vercel deployment.

## 🛠️ **Tech Stack**
[![My Skills](https://skillicons.dev/icons?i=nextjs,redis,prisma,postgresql,express,nodejs,ts,tailwindcss,bots,vercel&perline=5)](https://skillicons.dev)

| Technology                      | Purpose                                                     |
| ------------------------------- | ----------------------------------------------------------  |
| Node.js & Express               | Backend for handling Telegram webhooks                      |
| Puppeteer + @sparticuz/chromium | Generates invoice images using headless Chromium            |
| GenAI ( Google's Gemini )       | Extracts structured data from user messages                 |
| Redis       | Caching of Business Details (To avoid repeated DB requests) |
| Next.js                         | Renders the invoice dynamically                             |
| Telegram Bot API                | Receives & Sends messages from users                        |
| Vercel                          | Deployment for both webhook, invoice rendering and Next.js  |
| TypeScript                      | Ensure Typesafe                                             |

---

# Architecture

<img src="./webhook/assets/BillBot-Architechture-Diagram.png">

# Demo Result

<img src="./webhook/assets/Demo.png">

# Demo Video

https://github.com/user-attachments/assets/004278d6-266a-48e1-abf8-ad5d4c62f1ab

---

## 📌 Features

- ✅ **AI-powered Data Extraction** - Uses GenAI to structure invoice details.
- ✅ **Beautiful Invoice Rendering** - Uses Next.js for frontend rendering.
- ✅ **Real-time Telegram Bot** - Handles messages and replies instantly.
- ✅ **Puppeteer Image Generation** - Converts invoices to high-quality images.
- ✅ **Serverless Deployment** - Runs efficiently on Vercel.

---

## Sample .env

```
# Telegram Bot
TELEGRAM_TOKEN=your-telegram-bot-token

# Gemini API Key (for AI-based data extraction)
API_KEY=your-api-key

```

## How things actually are working in under the hood🤔 ?

- **Step - 1:** At initial user starts sending customer details such as:
  - Customer Name
  - Phone Number
  - Items list ( Item Name, Quantity, Price of each )
  - Shipping cost
- This user entered message will be forwarded to Backend Server which has been attached as a **WebHook** for Telegram-bot-api.
- **Step - 2:** The response message will be forwarded to **Gemini-API** to extract & format into a preferred **JSON format**, however the user types the message of customer details. And sends back the json to Webhook server.
- **Step - 3:** Now this json will be attached as a **query parameter to Next.js Frontend URL**. And this full URL will be passed to Puppeteer.
- **Step - 4:** The Puppeteer will lauch the headless browser via **@sparticuz/chromium - a precompiled chromium binary**. And then Puppeteer will take screen shot and return that screenshot to the user.

That's it.✨

---

## Sample from user

```
Radhe Krishna
+91 1234567890
Face Wash x4 100
Dandruff Shampoo x2 300
Shipping 40

```

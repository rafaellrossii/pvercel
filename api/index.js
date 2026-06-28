const express = require("express");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const app = express();

app.get("/", async (req, res) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
      executablePath: await chromium.executablePath(),
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto("https://vmbro-lt-75.pages.dev/", {
      waitUntil: "networkidle2",
      timeout: 300000,
    });

    const title = await page.title();

    await browser.close();

    res.json({
      success: true,
      title,
    });
  } catch (err) {
    if (browser) {
      await browser.close().catch(() => {});
    }

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  }
});

module.exports = app;
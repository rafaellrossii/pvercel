const express = require("express");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const app = express();

app.get("/api", async (req, res) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto("https://vmbro-lt-75.pages.dev/", {
      waitUntil: "networkidle2",
      timeout: 300000,
    });

    const title = await page.title();

    await browser.close();

    res.send(title);
  } catch (err) {
    if (browser) {
      await browser.close().catch(() => {});
    }

    console.error(err);
    res.status(500).send(err.stack);
  }
});

module.exports = app;

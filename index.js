const express = require("express");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const app = express();

app.get("/api", async (req, res) => {
  let browser;

  try {
    const isVercel = !!process.env.VERCEL;

    browser = await puppeteer.launch({
      args: isVercel
        ? chromium.args
        : ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: isVercel
        ? await chromium.executablePath()
        : undefined,
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto("https://www.google.com", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    const title = await page.title();

    await browser.close();

    res.send(title);
  } catch (err) {
    console.error(err);

    if (browser) await browser.close().catch(() => {});

    res.status(500).send(err.stack);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;

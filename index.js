PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 1;
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer');

exports.handler = async (event, context, callback) => {
  const websiteUrl = event.url;
  if (!websiteUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL is required' }),
    };
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.goto(websiteUrl, { waitUntil: 'networkidle0' });

  const title = await page.title();

  const response = {
    statusCode: 200,
    body: title,
  };

  return response;
};

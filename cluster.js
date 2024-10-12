const fs = require('fs');
const { Cluster } = require('puppeteer-cluster');

const urls = ['https://www.google.com', 'https://www.yahoo.com'];

async function main() {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 10,
    monitor: true,
    puppeteerOptions: {
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: false,
      userDataDir: './tmp',
    },
  });

  cluster.on('taskerror', (err, data) => {
    console.log(`Error on ${data.url}: ${err.message}`);
  });

  await cluster.task(async ({ page, data: { url } }) => {
    await page.goto(url);
    const title = await page.title();
    console.log(`Title of ${url}: ${title}`);
  });

  // Replace cluster.run(urls) with the following:
  for (const url of urls) {
    await cluster.queue({ url });
  }

  // Wait for all tasks to complete
  await cluster.idle();
  await cluster.close();
}

main();

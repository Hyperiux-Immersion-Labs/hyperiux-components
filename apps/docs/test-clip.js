import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3001/osmo-menu');
  await page.waitForTimeout(2000);
  await page.screenshot({path: 'screenshot-closed.png'});
  
  // click menu
  await page.click('.cursor-pointer');
  await page.waitForTimeout(1000);
  await page.screenshot({path: 'screenshot-open.png'});

  await browser.close();
})();

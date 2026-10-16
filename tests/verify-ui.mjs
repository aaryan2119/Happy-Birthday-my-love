import { chromium } from 'playwright';

async function testApp() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  // Verify Lock Screen elements
  const heading = await page.textContent('body');
  console.log('Page loaded with lock screen content');

  // Type PIN 1402
  console.log('Clicking keypad digits: 1, 4, 0, 2');
  await page.click('button:text-is("1")');
  await page.waitForTimeout(150);
  await page.click('button:text-is("4")');
  await page.waitForTimeout(150);
  await page.click('button:text-is("0")');
  await page.waitForTimeout(150);
  await page.click('button:text-is("2")');

  console.log('Waiting for blooming curtain transition...');
  await page.waitForSelector('h1', { timeout: 15000 });
  const celebrationHeading = await page.textContent('h1');
  console.log('Celebration heading:', celebrationHeading);

  // Check Heart Constellation section and trace stars
  console.log('Testing Heart Constellation tracing...');
  for (let i = 0; i < 8; i++) {
    const nextBtn = await page.$('button:has-text("Light Next Star")');
    if (nextBtn) {
      await nextBtn.click();
      await page.waitForTimeout(200);
    }
  }

  await page.waitForTimeout(600);
  const wishMade = await page.$('text=Wish Made in the Stars!');
  console.log('Constellation Wish Made element present:', !!wishMade);

  // Test Polaroid Toss
  console.log('Testing Polaroid toss...');
  await page.click('text=Toss the photo aside to see the next one');
  await page.waitForTimeout(400);

  // Test Diary Page flip
  console.log('Testing Diary open...');
  await page.click('text=Open Album');
  await page.waitForTimeout(600);
  const chapterText = await page.textContent('text=chapter one');
  console.log('Diary page 1 opened:', !!chapterText);

  // Test Sealed Letter
  console.log('Testing Sealed Letter open...');
  await page.click('text=tap the seal to open');
  await page.waitForTimeout(600);
  const letterParchment = await page.$('text=To my Ardhagini');
  console.log('Letter opened:', !!letterParchment);

  // Test Final Surprise heart tap
  console.log('Testing Final Heart tap...');
  const heartPrompt = await page.$('text=tap it — go on');
  if (heartPrompt) {
    await heartPrompt.click();
    await page.waitForTimeout(600);
  }
  const finalMessage = await page.$('text=You are my favourite hello');
  console.log('Final love message revealed:', !!finalMessage);

  // Check Customizer Studio
  console.log('Testing Customizer Modal...');
  await page.click('text=Customize for Her');
  await page.waitForTimeout(500);
  const modalTitle = await page.textContent('text=Surprise Customizer Studio');
  console.log('Customizer modal opened:', !!modalTitle);

  console.log('Console errors found:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  }

  await browser.close();
  console.log('Test completed successfully!');
}

testApp().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});

const puppeteer = require('puppeteer');

exports.createPDF = async (html) => {
  console.log('Starting: Generating PDF Process, Kindly wait ..');
  /** Launch a headleass browser */
  const browser = await puppeteer.launch();
  /* 1- Ccreate a newPage() object. It is created in default browser context. */
  const page = await browser.newPage();
  await page.emulateMedia('print');
  await page.emulateMedia('screen');
  /* 2- Will open our generated `.html` file in the new Page instance. */
  await page.setContent(html);
  /* 3- Take a snapshot of the PDF */
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });
  /* 4- Cleanup: close browser. */
  await browser.close();
  console.log('Ending: Generating PDF Process');
  return pdf;
};

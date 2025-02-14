const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const generateAndSavePDF = async (htmlContent, fileName) => {
    try {
        // console.log(htmlContent);
        // Launch browser and generate PDF as before
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
        });

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '80px',
                right: '80px',
                bottom: '80px',
                left: '80px',
            },
        });

        await browser.close();

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(__dirname, '../public/reports');
        await fs.mkdir(uploadsDir, { recursive: true });
        // Generate unique filename if none provided
        const finalFileName = fileName || `report-${moment(Date.now()).format('hh:mm:ss MM/DD/YYYY')}.pdf`;
        const filePath = path.join(uploadsDir, finalFileName);

        // Save PDF to file
        await fs.writeFile(filePath, pdf);

        return {
            buffer: pdf,
            fileName: finalFileName,
        };
    } catch (error) {
        console.error('PDF Generation and Save failed:', error);
        throw error;
    }
};

module.exports = { generateAndSavePDF };

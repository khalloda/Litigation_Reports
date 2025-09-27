#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF(inputData) {
    let browser = null;

    try {
        const data = JSON.parse(inputData);

        if (!data.filename) {
            throw new Error('Missing required parameter: filename');
        }

        let html;
        if (data.html) {
            html = data.html;
        } else if (data.htmlFile) {
            html = fs.readFileSync(data.htmlFile, 'utf8');
        } else {
            throw new Error('Missing required parameter: html or htmlFile');
        }

        console.log('Starting Puppeteer PDF generation...');

        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--lang=ar'
            ]
        });

        const page = await browser.newPage();

        await page.setViewport({
            width: 1200,
            height: 800,
            deviceScaleFactor: 1
        });

        console.log('Loading HTML content...');

        await page.setContent(html, {
            waitUntil: ['networkidle0', 'domcontentloaded'],
            timeout: 30000
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Generating PDF...');

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: false,
            margin: {
                top: '1cm',
                right: '1cm',
                bottom: '1cm',
                left: '1cm'
            },
            displayHeaderFooter: false,
            timeout: 30000
        });

        const outputPath = path.resolve(data.filename);
        fs.writeFileSync(outputPath, pdfBuffer);

        console.log(`PDF generated successfully: ${outputPath}`);
        console.log(`File size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);

        const response = {
            success: true,
            filename: outputPath,
            size: pdfBuffer.length,
            message: 'PDF generated successfully'
        };

        console.log(JSON.stringify(response));
        process.exit(0);

    } catch (error) {
        console.error('PDF generation failed:', error.message);

        const response = {
            success: false,
            error: error.message,
            message: 'PDF generation failed'
        };

        console.error(JSON.stringify(response));
        process.exit(1);

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

if (process.argv.length > 2) {
    const inputData = process.argv[2];
    generatePDF(inputData);
} else {
    let inputData = '';

    process.stdin.on('data', (chunk) => {
        inputData += chunk;
    });

    process.stdin.on('end', () => {
        generatePDF(inputData.trim());
    });
}
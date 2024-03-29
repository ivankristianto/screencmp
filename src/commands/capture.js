/**
 * Internal dependencies
 */
import puppeteer from 'puppeteer';
import log from '../utils/logger';

exports.command = 'capture <url>';
exports.desc = 'Capture screenshot of given url.';
exports.builder = {};
exports.handler = async function (argv) {
	const { url } = argv;

	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	// Set viewport width and height
	await page.setViewport({ width: 1280, height: 720 });

	await page.setCookie({
		name: 'wordpress_logged_in_cee5cf3b320767853e63e4035d47b9ad',
		value: 'ivan.kristianto%40kaplan.com%7C1712925320%7CVItXw2UNVBYbbLy4xClkkqEV7aidLwbrbliOKHxX9m6%7C58966e42bb01ee5150c4593c99443a6be6722081493f197a4f75c60ee4fab84f',
		domain: 'liverpool.kaplan-dev.altis.cloud',
		path: '/',
	});

	await page.goto(url, { waitUntil: 'load' });

	// Scroll to bottom of the page

	await page.evaluate(() => {
		window.scrollTo(0, document.body.scrollHeight);
	});

	let filename = url
		.replace('https://', '')
		.replace(/[^a-z0-9]/gim, '_')
		.replace(/\s+/g, '_');

	// Ensure total filename length doesn't exceed 255 characters
	const MAX_FILENAME_LENGTH = 255;
	let reservedLength = 1 + 4; // 1 for "_" and 4 for ".png"
	if (reservedLength + filename.length > MAX_FILENAME_LENGTH) {
		filename = filename.substring(0, MAX_FILENAME_LENGTH - reservedLength);
	}

	filename = filename + '.png';

	await page.screenshot({
		path: filename,
		fullPage: true,
	});

	await browser.close();
};

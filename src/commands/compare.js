/**
 * Internal dependencies
 */
import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import puppeteer from 'puppeteer';
// import log from '../utils/logger';

exports.command = 'compare <path>';
exports.desc = 'Compare the 2 URLs.';
exports.builder = {
	base: {
		describe: 'Base URL',
		type: 'string',
		demandOption: true,
	},
	target: {
		describe: 'Target Base URL',
		type: 'string',
		demandOption: true,
	},
};
exports.handler = async function (argv) {
	const { path, base, target } = argv;

	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	// Set viewport width and height
	await page.setViewport({ width: 1280, height: 720 });

	// @TODO: Should come from Environment Variables
	await page.setCookie({
		name: 'wordpress_logged_in_',
		value: 'aaaa',
		domain: 'loclhost',
		path: '/',
	});

	const urlBase = `${base}${path}`;
	const urlTarget = `${target}${path}`;

	const URLs = [urlBase, urlTarget];
	const results = [];

	for (const url of URLs) {
		const filename = await captureScreenshot(page, url);
		results.push(filename);
	}

	await browser.close();

	await compareImages(results[0], results[1]);
};

const compareImages = async (base, target) => {
	const img1 = PNG.sync.read(fs.readFileSync(base));
	const img2 = PNG.sync.read(fs.readFileSync(target));
	const { width, height } = img1;
	const diff = new PNG({ width, height });

	pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.5 });

	fs.writeFileSync('diff.png', PNG.sync.write(diff));
};

const captureScreenshot = async (page, url) => {
	await page.goto(url, { waitUntil: 'load' });

	// Scroll to bottom of the page
	await page.evaluate(() => {
		window.scrollTo(0, document.body.scrollHeight);
	});

	const filename = generateFilename(url);

	await page.screenshot({
		path: filename,
		fullPage: true,
	});

	return filename;
};

const generateFilename = (url) => {
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

	return filename;
};

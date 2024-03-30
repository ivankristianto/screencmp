/**
 * External dependencies
 */
import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import puppeteer from 'puppeteer';

/**
 * Internal dependencies
 */
import { captureScreenshot } from '../utils/helpers';
import log from '../utils/logger';

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

	const browser = await puppeteer.launch({ headless: true });
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
		log.info(`Screenshot captured: ${filename}`);
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
	log.info('Diff image saved as diff.png');
};

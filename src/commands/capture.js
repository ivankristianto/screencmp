/**
 * External dependencies
 */
import puppeteer from 'puppeteer';

/**
 * Internal dependencies
 */
import { captureScreenshot } from '../utils/helpers';
import log from '../utils/logger';

exports.command = 'capture <url>';
exports.desc = 'Capture screenshot of given url.';
exports.builder = {};
exports.handler = async function (argv) {
	const { url } = argv;

	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	// Set viewport width and height
	await page.setViewport({ width: 1280, height: 720 });

	/* await page.setCookie({
		name: 'wordpress_logged_in_cee5cf3b320767853e63e4035d47b9ad',
		value: 'ivan.kristianto%40kaplan.com%7C1712925320%7CVItXw2UNVBYbbLy4xClkkqEV7aidLwbrbliOKHxX9m6%7C58966e42bb01ee5150c4593c99443a6be6722081493f197a4f75c60ee4fab84f',
		domain: 'liverpool.kaplan-dev.altis.cloud',
		path: '/',
	}); */

	const filename = await captureScreenshot(page, url);

	await browser.close();

	log.info(`Screenshot captured: ${filename}`);
};

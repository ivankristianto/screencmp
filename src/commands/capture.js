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

	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	// Set viewport width and height
	await page.setViewport({ width: 1280, height: 720 });

	// @TODO: Should come from Environment Variables
	/* await page.setCookie({
		name: 'cookie_name',
		value: 'cookie_value',
		domain: 'domain.com',
		path: '/',
	}); */

	const filename = await captureScreenshot(page, url);

	await browser.close();

	log.info(`Screenshot captured: ${filename}`);
};

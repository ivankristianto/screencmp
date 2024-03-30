import { Page } from 'puppeteer';

/**
 * Capture screenshot helper.
 *
 * @param {Page} page - The page object.
 * @param {*} url - The URL string.
 * @returns {String} The generated filename.
 */
export async function captureScreenshot(page, url) {
	await page.goto(url, { waitUntil: 'load' });

	// Scroll to bottom of the page
	await scrollToBottom(page);

	const filename = generateFilename(url);

	await page.screenshot({
		path: filename,
		fullPage: true,
	});

	return filename;
}

/**
 * Scroll to bottom helper.
 *
 * @param {Page} page - The page object.
 */
export async function scrollToBottom(page) {
	await page.evaluate(() => {
		return new Promise((resolve) => {
			const innerHeight = Math.max(
				document.body.scrollHeight,
				document.body.offsetHeight,
				document.documentElement.clientHeight,
				document.documentElement.scrollHeight,
				document.documentElement.offsetHeight
			);
			let totalHeight = 0;
			let scrolled_times = 0;
			const distance = 100;
			// window.scrollTo(0, document.body.scrollHeight);

			const timer = setInterval(() => {
				const scrollHeight = innerHeight; //document.body.scrollHeight;
				scrolled_times++;
				window.scrollBy(0, distance);
				totalHeight += distance;

				if (totalHeight >= scrollHeight) {
					window.scrollTo(0, 0);
					console.log('scrolled ' + scrolled_times + ' times');
					clearInterval(timer);
					resolve();
				}
			}, 100);
		});
	});
}

/**
 * Generate filename helper.
 *
 * @param {String} url - The URL string.
 * @returns {String} The generated filename.
 */
export function generateFilename(url) {
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
}

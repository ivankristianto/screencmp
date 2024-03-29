/**
 * Internal dependencies
 */

/**
 * Run Command
 *
 * @param {object} argv Command params
 * @param {string} argv.format Output format
 * @returns {Promise<void>}
 */
async function runCommand(argv) {
	console.table(argv);
}

exports.command = 'get <url>';
exports.desc = 'Get information about a specific account that you are a member of';
exports.builder = {};
exports.handler = runCommand;

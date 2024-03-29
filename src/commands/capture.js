/**
 * Internal dependencies
 */
import log from '../utils/logger';

exports.command = 'capture';
exports.desc = 'Capture screenshot of given url.';
exports.builder = function (yargs) {
	return yargs.commandDir('capture');
};
exports.handler = async function () {
	log.info('Use --help argument to get available subcommands');
};

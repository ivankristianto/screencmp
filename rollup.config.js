import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

export default {
	input: 'src/cli.js',
	output: {
		// file: 'dist/cli.js',
		dir: 'dist',
		format: 'es',
		exports: 'named',
		preserveModules: true, // Keep directory structure and files
	},
	// plugins: [resolve(), commonjs(), babel({ babelHelpers: 'runtime', skipPreflightCheck: true })],
	plugins: [resolve(), babel({ babelHelpers: 'runtime', skipPreflightCheck: true })],
};

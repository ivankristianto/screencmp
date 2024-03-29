module.exports = {
	...require( '@wordpress/prettier-config' ),
	printWidth: 120,
	bracketSpacing: true,
	parenSpacing: true,
	overrides: [
		{
			files: '*.{css,sass,scss}',
			options: {
				singleQuote: false,
			},
		},
		{
			files: '*.{yaml,yml}',
			options: {
				singleQuote: false,
				tabWidth: 2,
				useTabs: false,
			},
		},
	],
};

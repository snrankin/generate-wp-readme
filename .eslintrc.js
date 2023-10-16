/* eslint-env node */
module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname,
	},
	plugins: ['@typescript-eslint'],
	rules: {
		quotes: ['error', 'single'],
		'no-async-promise-executor': 0,
		'no-dupe-else-if': 0,
		'no-import-assign': 0,
		'no-misleading-character-class': 0,
		'no-setter-return': 0,
		'no-useless-catch': 0,
		'no-unused-vars': 0,
		yoda: 0,
		'comma-dangle': [
			'error',
			{
				arrays: 'always-multiline',
				objects: 'always-multiline',
				imports: 'always-multiline',
				exports: 'always-multiline',
				functions: 'ignore',
			},
		],
	},
};

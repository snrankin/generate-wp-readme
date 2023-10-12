module.exports = {
	root: true,
	extends: ['eslint:recommended', 'prettier'],
	parser: '@babel/eslint-parser',
	globals: {
		document: true,
		rwp: true,
		window: true,
	},
	env: {
		es2022: true,
		browser: true,
		jquery: true,
		commonjs: true,
		node: true,
	},
	parserOptions: {
		ecmaFeatures: {
			globalReturn: true,
			generators: false,
			objectLiteralDuplicateProperties: false,
			experimentalObjectRestSpread: true,
		},
		requireConfigFile: false,
		ecmaVersion: 2017,
		allowImportExportEverywhere: true,
		sourceType: 'module',
	},
	settings: {
		'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
	},
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

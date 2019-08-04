module.exports = {
	'parserOptions': {
		parser: 'babel-eslint',
		sourceType: 'module'
	},
	'env': {
		'es6': true,
		'browser': true,
		'node': true,
		'jest': true
	},	
	'extends': [
		'plugin:vue/essential',
		'airbnb-base',
		'plugin:vue/essential',
		'plugin:prettier/recommended'
	],
	'plugins': ['vue'],
	'rules': {
		'eol-last': 'off',
		'no-restricted-globals': ['off', 'window'],
		'object-curly-newline': 'off',
		'arrow-parens': 'off',
		'guard-for-in': 'off',
		'no-restricted-syntax': 'off',
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				trailingComma: 'es5',
			},
		],
	}
};
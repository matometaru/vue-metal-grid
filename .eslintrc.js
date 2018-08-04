module.exports = {
	'parserOptions': {
		parser: 'babel-eslint',
		sourceType: 'module'
	},
	'env': {
		'es6': true,
		'browser': true,
		'node': true
	},	
	'extends': [
		'plugin:vue/essential',
		'airbnb-base'
	],
	'rules': {
		'eol-last': 'off',
		'no-restricted-globals': ['off', 'window'],
		'object-curly-newline': 'off',
		'arrow-parens': 'off',
		'guard-for-in': 'off',
		'no-restricted-syntax': 'off',
	}
};
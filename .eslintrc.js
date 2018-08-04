module.exports = {
	'parserOptions': {
		parser: 'babel-eslint',
		sourceType: 'module'
	},
	'env': {
		'es6': true,
		'browser': true,
		'node': true,
	},	
	'extends': [
		'plugin:vue/essential',
		'airbnb-base'
	],
	'rules': {
		'eol-last': 'off',
	}
};
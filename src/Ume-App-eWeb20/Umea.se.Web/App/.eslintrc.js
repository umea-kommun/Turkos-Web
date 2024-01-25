module.exports = {
	root: true,
	env: {
		node: true,
		'vue/setup-compiler-macros': true,
	},
	extends: [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/typescript/recommended',
		'plugin:prettier/recommended',
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: 'module',
	},
	settings: {
		'import/resolver': {
			typescript: {
				typeCheck: {
					eslint: true,
				},
			},
		},
	},
	rules: {
		'linebreak-style': [
			'error',
			process.platform === 'win32' ? 'windows' : 'unix',
		],
		quotes: ['error', 'single'],
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': ['off'],
		'no-use-before-define': 'off',
		'import/prefer-default-export': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/no-use-before-define': ['error'],
		'@typescript-eslint/explicit-function-return-type': [
			'error',
			{
				allowExpressions: true,
			},
		],
		'max-len': [
			'warn',
			{
				code: 120,
			},
		],
	},
	overrides: [
		{
			files: [
				'**/__tests__/*.{j,t}s?(x)',
				'**/tests/unit/**/*.spec.{j,t}s?(x)',
			],
			env: {
				jest: true,
			},
		},
	],
};

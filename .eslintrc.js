module.exports = {
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module"
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true
  },
  extends: [
    "plugin:vue/essential",
    "airbnb-base",
    "plugin:vue/essential",
    "plugin:prettier/recommended"
  ],
  settings: {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/core-modules": ["app"],
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  plugins: ["vue"],
  rules: {
    "eol-last": "off",
    "no-restricted-globals": ["off", "window"],
    "object-curly-newline": "off",
    "arrow-parens": "off",
    "guard-for-in": "off",
    "no-restricted-syntax": "off",
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        trailingComma: "es5"
      }
    ],
    "import/extensions": [".js", ".jsx", ".json", ".ts", ".tsx"]
  }
};

// @see: http://eslint.cn

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    'vue/setup-compiler-macros': true
  },
  /* 指定如何解析语法 */
  parser: 'vue-eslint-parser',
  /* 优先级低于 parse 的语法解析配置 */
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false
  },
  /* 继承某些已有的规则 */
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'eslint-config-prettier'
  ],
  plugins: [
    'vue',
    'prettier'
  ],
  /*
   * 'off' 或 0    ==>  关闭规则
   * 'warn' 或 1   ==>  打开的规则作为警告（不影响代码执行）
   * 'error' 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
   */
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/multi-word-component-names": "off"
  }
}

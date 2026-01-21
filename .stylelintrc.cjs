/*
 * @Author: changfanhao
 * @Date: 2023-03-06 10:10:35
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-08 09:36:51
 * @FilePath: \geoproject2.0\.stylelintrc.cjs
 * @Description:
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
module.exports = {
  root: true,
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss', 'css-properties-sorting'],
  plugins: ['stylelint-scss', 'stylelint-order'],
  overrides: [
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    'order/order': ['custom-properties', 'declarations'],
    'color-no-invalid-hex': true,
    'unit-no-unknown': true,
    'property-no-unknown': null,
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'comment-no-empty': true,
    'number-leading-zero': 'always',
    'number-no-trailing-zeros': true,
    'declaration-colon-space-after': 'always',
    'declaration-colon-space-before': 'never',
    'font-family-no-missing-generic-family-keyword': null,
    'selector-class-pattern': null,
    'selector-id-pattern': null,
    'custom-property-pattern': null,
    'no-descending-specificity': null,
    // 关闭不认识的:deep之类的伪元素警告
    'selector-pseudo-class-no-unknown': null,
    'color-hex-length': null,
  },
  customSyntax: 'postcss-scss',
};

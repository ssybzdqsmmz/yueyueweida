/*
 * @Author: Lincong-pro
 * @Date: 2023-03-06 17:56:07
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-11-25 11:32:59
 * @FilePath: \Geology-v3\postcss.config.cjs
 * @Description: 实现vw vh转换
 *
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
module.exports = {
  plugins: {
    //! 转化为vw-vh布局
    // "postcss-px-to-viewport-8-plugin": {
    // 	viewportWidth: 1920,
    // 	viewportHeight: 1080,
    // 	unitPrecision: 3,
    // 	viewportUnit: 'vw',
    // 	selectorBlackList: ['.ignore', '.hairlines'],
    // 	minPixelValue: 1,
    // 	mediaQuery: false
    // }
    // 转换为rem布局
    'postcss-pxtorem': {
      rootValue: 192,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
      exclude: /node_modules/i,
    },
  },
};

/*
 * @Author: Lincong-pro
 * @Date: 2023-03-06 18:43:05
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-12 13:41:10
 * @FilePath: \geoproject2.0\src\utils\AvoidDebounce\Rem.js
 * @Description: 动态改变根元素的像素的大小
 *
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
/**
 * @description: resize的监听函数
 * @return {void}
 */
function setRem() {
  // 基准大小
  let baseSize = 192;
  let basePc = baseSize / 1920; // 表示1920的设计图,使用100PX的默认值
  let vW = window.innerWidth; // 当前窗口的宽度
  let vH = window.innerHeight; // 当前窗口的高度
  // 非正常屏幕下的尺寸换算
  // let dueH = (vW * 1080) / 1920;
  // if (vH < dueH) {
  //   // 当前屏幕高度小于应有的屏幕高度，就需要根据当前屏幕高度重新计算屏幕宽度
  //   vW = (vH * 1920) / 1080;
  // }
  if (vW < 1270) {
    return document.documentElement.style.fontSize;
  }
  let rem = vW * basePc; // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应font-size值
  let deviceRatio = detectDeviceRatio(); // PC端不同分辨率屏幕的适配
  document.documentElement.style.transform = `transform(r${deviceRatio},${deviceRatio})`;
  document.documentElement.style.fontSize = rem + 'px';
}
/**
 * @description: 检测用户的DPI像素比 - 设计像素比是在0.8
 * @return {*}
 */
function detectDeviceRatio() {
  let ratio = 0;
  if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio;
  }
  return 1.0 / ratio;
}

// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.addEventListener('resize', setRem);

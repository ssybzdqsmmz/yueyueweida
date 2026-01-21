/*
 * @Author: Lincong-pro
 * @Date: 2024-02-26 12:25:02
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2024-02-26 12:25:05
 * @FilePath: \Geology-V3\src\views\SceneManagement\Layout\Tools\datePrototype.js
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
Date.prototype.Format = function (fmt) {
  // author: meizz
  let o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
};
Date.prototype.getWeekDate = function () {
  let now = new Date();
  let day = now.getDay();
  let weeks = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
  let week = weeks[day];
  return week;
};
String.prototype.RTrim = function (c) {
  if (!c) {
    c = ' ';
  }
  let reg = new RegExp('([' + c + ']*$)', 'gi');
  return this.replace(reg, '');
};
String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, 'gm'), s2);
};
//echart
window.fontSize = (res) => {
  let docEl = document.documentElement,
    clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (!clientWidth) {
    return;
  }
  let fontSize = 100 * (clientWidth / 1920);
  return res * fontSize;
};

export default {
  //深拷贝
  // 定义一个深拷贝函数  接收目标target参数
  deepClone(target) {
    // 定义一个变量
    let result;
    // 如果当前需要深拷贝的是一个对象的话
    if (typeof target === 'object') {
      // 如果是一个数组的话
      if (Array.isArray(target)) {
        result = []; // 将result赋值为一个数组，并且执行遍历
        for (let i in target) {
          // 递归克隆数组中的每一项
          result.push(this.deepClone(target[i]));
        }
        // 判断如果当前的值是null的话；直接赋值为null
      } else if (target === null) {
        result = null;
        // 判断如果当前的值是一个RegExp对象的话，直接赋值
      } else if (target.constructor === RegExp) {
        result = target;
      } else {
        // 否则是普通对象，直接for in循环，递归赋值对象的所有值
        result = {};
        for (let i in target) {
          result[i] = this.deepClone(target[i]);
        }
      }
      // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
      result = target;
    }
    // 返回最终结果
    return result;
  },
  random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
};

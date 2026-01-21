/*
 * @Author: Lincong-pro
 * @Date: 2023-03-10 13:16:25
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-01 18:34:35
 * @FilePath: \geoproject2.0\src\globalPrototype.ts
 * @Description:此处用于定义全局的prototype原型链
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */

/* formdata */
Object.defineProperty(HTMLFormElement.prototype, 'formdata', {
  get() {
    return new FormData(this);
  },
});
/* urldata */
Object.defineProperty(HTMLFormElement.prototype, 'urldata', {
  get() {
    const urldata = [];
    Object.entries(this.jsondata).forEach(([key, value]) => {
      //@ts-ignore
      urldata.push(key + '=' + (value.join ? value.join() : value));
    });
    return urldata.join('&');
  },
});

/* jsondata */
Object.defineProperty(HTMLFormElement.prototype, 'jsondata', {
  get() {
    const jsondata = {};
    const formdata = new FormData(this);
    formdata.forEach((value, key) => {
      if (!jsondata[key]) {
        jsondata[key] = formdata.getAll(key).length > 1 ? formdata.getAll(key) : formdata.get(key);
      }
    });
    return jsondata;
  },
});

//@ts-ignore
Date.prototype.Format = function (fmt) {
  const o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
};

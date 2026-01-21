/*
 * @Author: Lincong-pro
 * @Date: 2023-03-10 12:00:58
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-28 09:08:27
 * @FilePath: \geoproject2.0\src\api\dldz-requst.ts
 * @Description: 具体的请求函数
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */

import { PASSWORD_LOGIN, COOKIE_VERIFY, CAPTCHA_URL, LOGOUT_URL } from './url';
import { request } from '@/utils/NetWork/Request';
// import { User } from './types';

/**
 * @description: cookie验证
 * @return {Promise}
 */
export function cookieVerify() {
  return request({
    url: COOKIE_VERIFY,
    method: 'POST',
  });
}

/**
 * @description: 用户退出登陆
 * @return {Promise}
 */
export function logout() {
  return request({
    url: LOGOUT_URL,
    method: 'POST',
  });
}

/**
 * @description: 用于密码登录
 * @param {FormData} formData
 * @param {string} uuid 用于判断redis中的缓存是否过期
 * @return {Promise}
 */
export function passwordLogin(formData: FormData, uuid: string) {
  formData.append('uuid', uuid);
  return request({
    url: PASSWORD_LOGIN,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
  });
}

/**
 * 获取验证码
 * @returns {Promise}
 */
export function getCode() {
  return request({
    url: CAPTCHA_URL,
    method: 'GET',
  });
}

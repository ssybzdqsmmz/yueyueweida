/*
 * @Author: anganao 1928882425@qq.com
 * @Date: 2024-04-16 16:51:55
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2025-04-08 14:42:53
 * @FilePath: \Geology-v3\src\api\TkyLogin.ts
 * @Description:
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 *
 */
import axios from 'axios';
import AppConfig from '@/config/AppConfig';
const appConfig = new AppConfig().appConfig;

const TkyLoginDomain = 'https://sso.r93535.com/api/v1.0/login'; //1.请求铁科院登陆接口(vite代理)
const EncryptAPI = appConfig.middlewareServer + '/encrypt'; // 2.java后台帮我们加密
const TkyPostProxy = appConfig.middlewareServer + '/proxy/post'; // post代理
class LoginInfo {
  constructor() {
    //
  }

  /**
   * @description: 获取有效的token
   * @return {void}
   */
  async setCookie() {
    return this.login().then((res) => {
      // console.warn(res);
    });
  }
  /**
   * @description: 刷新验证码
   * @return {*}
   */
  private async login() {
    const apiUrl = TkyPostProxy;
    let passwordEncrypted = 'uFtxY2UoudZ57IdfVokl8Q==';

    const jsonData = {
      appname: 'yjjy',
      account: 'czwlj',
      password: passwordEncrypted, // AES加密  St.496413719
      timestamp: Date.now(), //调用登录API时的时间戳
    };
    let encryptedToken = await this.RSAEncrypt(jsonData); // 加密token

    const dataWithToken = {
      ...jsonData,
      token: encryptedToken.data.token,
      realUrl: TkyLoginDomain, // 真正的请求地址
    };

    const axiosConfig = {
      method: 'post',
      url: apiUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: dataWithToken,
    };

    return axios(axiosConfig);
  }
  /**
   * @description: 从Java中进行RSA加密
   * @param {*} jsonData
   * @return {*}
   */
  private RSAEncrypt(jsonData) {
    const axiosConfig = {
      method: 'post',
      url: EncryptAPI,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: jsonData,
    };
    return axios(axiosConfig);
  }
}

function singleTon<T>(classType: { new (...args: any[]): T }) {
  let instance;
  return new Proxy(classType, {
    construct: function (target, args) {
      if (!instance) {
        instance = new target(...args);
        Object.defineProperty(classType.prototype, 'constructor', {
          value: undefined,
          writable: false,
          enumerable: false,
          configurable: true,
        });
      }

      return instance;
    },
  });
}

export default singleTon(LoginInfo);

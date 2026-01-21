/*
 * @Author: Lincong-pro
 * @Date: 2024-02-25 20:49:11
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-25 10:38:10
 * @FilePath: \Geology-V3\src\views\SceneManagement\Batang\Services\ServiceProperties.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import AppConfig from '@/config/AppConfig';

const appConfig = new AppConfig().getConfig();
const ipServer = appConfig.ipServer;
const TkyDomain = 'https://apps.r93535.com'; //1.部署铁科院
const TkyLoginDomain = 'https://sso.r93535.com/api/v1.0/login'; //1.请求铁科院登陆接口(vite代理)
const EncryptAPI = appConfig.middlewareServer + '/encrypt'; // 2.java后台帮我们加密
const TkyGetProxy = appConfig.middlewareServer + '/proxy/get'; // get代理
const TkyPostProxy = appConfig.middlewareServer + '/proxy/post'; // post代理
const rate = 1;

export { ipServer, TkyDomain, TkyLoginDomain, EncryptAPI, TkyGetProxy, TkyPostProxy, rate };

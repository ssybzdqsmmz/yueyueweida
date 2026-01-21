/*
 * @Author: Lincong-pro
 * @Date: 2024-02-27 15:14:30
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-06-21 13:34:40
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Service\ServiceProperties.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import AppConfig from '@/config/AppConfig';

const appConfig = (new AppConfig()).getConfig();
const ipServer = appConfig.ipServer;
const imgServer = appConfig.middlewareServer + '/img/roam/';
const roamServer = appConfig.middlewareServer + '/roam/';
const centerLineUrl = 'FullLine/Line/json/CZ0327_1.json';


export { ipServer, imgServer, roamServer, centerLineUrl };

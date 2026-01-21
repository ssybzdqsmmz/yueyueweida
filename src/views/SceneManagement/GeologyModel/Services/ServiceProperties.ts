/*
 * @Author: Lincong-pro
 * @Date: 2024-02-25 20:49:11
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-13 10:15:49
 * @FilePath: \Geology-V3\src\views\SceneManagement\GeologyModel\Services\ServiceProperties.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import AppConfig from '@/config/AppConfig';

const appConfig = new AppConfig();
const ipServer = appConfig.getConfig().ipServer;
const rate = 1;
const centerLineUrl = 'FullLine/Line/json/CZ0327_1.json';
const regionClipUrl = 'FullLine/Line/json/区域地质范围裁剪坐标.json';

export { ipServer, centerLineUrl, rate, regionClipUrl };

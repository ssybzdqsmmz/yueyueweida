/*
 * @Author: Lincong-pro
 * @Date: 2024-02-25 20:49:11
 * @LastEditors: xingxu-webgis 1833104160@qq.com
 * @LastEditTime: 2024-03-15 10:50:43
 * @FilePath: \Geology-v3\src\views\SceneManagement\EngineerGeoModel\Services\ServiceProperties.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import AppConfig from '@/config/AppConfig';

const appConfig = new AppConfig();
const ipServer = appConfig.getConfig().ipServer;

export { ipServer };

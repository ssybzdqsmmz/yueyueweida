/*
 * @Author: 枫林残忆
 * @Date: 2024-03-09 14:09:32
 * @LastEditors: xingxu-webgis 1833104160@qq.com
 * @LastEditTime: 2024-03-15 10:46:07
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnelOut\Config\url.ts
 * @Description: 
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
 */
import AppConfig from '@/config/AppConfig';

const appConfig = new AppConfig();
const host = appConfig.getConfig().ipServer;
const WATER_POLYGON_URL = host + '/CZSCZQ-3/LINE/json/水面_2.json';

export { host, WATER_POLYGON_URL };

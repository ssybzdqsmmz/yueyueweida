/*
 * @Author: Lincong-pro
 * @Date: 2023-07-09 14:29:25
 * @LastEditors: xingxu-webgis 1833104160@qq.com
 * @LastEditTime: 2024-03-15 10:45:26
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnel\Utils\landslide\url.js
 * @Description:
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import AppConfig from '@/config/AppConfig.ts';
const appConfig = new AppConfig();
const DATA_URL = appConfig.getConfig().ipServer;

// 滑坡模拟数据
const LANDSLIDE_SIMULATION_URL = DATA_URL + '/CZSCZQ-2/hazard/animation/landslide.json';

// 泥石流模拟数据
const MUDSLIDE_SIMULATION_URL = DATA_URL + '/CZSCZQ-2/hazard/animation/mudslide.json';
// 单页面应用数据 - 泥石流
const TRAJECTORY_BUFFER_URL_MUDSLIDE = DATA_URL + '/CZSCZQ-2/hazard/Mudslide/trajectory_buffer_P.json';
const ROAD_BUFFER_URL_MUDSLIDE = DATA_URL + '/CZSCZQ-2/hazard/Mudslide/road_B_P.json';
const BUILDING_BUFFER_URL_MUDSLIDE = DATA_URL + '/CZSCZQ-2/hazard/Mudslide/building_P_A.json';
const PROFLIES_LINE_URL_MUDSLIDE = DATA_URL + '/CZSCZQ-2/hazard/Mudslide/proflies_LINE.json';
const PROFLIES_POINT_URL_MUDSLIDE = DATA_URL + '/CZSCZQ-2/hazard/Mudslide/proflies_POINT_1.json';
export {
  LANDSLIDE_SIMULATION_URL,
  MUDSLIDE_SIMULATION_URL,
  TRAJECTORY_BUFFER_URL_MUDSLIDE,
  ROAD_BUFFER_URL_MUDSLIDE,
  BUILDING_BUFFER_URL_MUDSLIDE,
  PROFLIES_LINE_URL_MUDSLIDE,
  PROFLIES_POINT_URL_MUDSLIDE,
};

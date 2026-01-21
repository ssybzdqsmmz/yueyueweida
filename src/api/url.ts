/*
 * @Author: Lincong-pro
 * @Date: 2023-03-10 11:57:42
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2025-03-28 14:48:54
 * @FilePath: \Geology-v3\src\api\url.ts
 * @Description: 地理地质后台服务器地址
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */

const BASE_URL = import.meta.env.MODE == 'development' ? 'https://vgetestpro.shop:8080' : 'https://localhost:8080';
// const BASE_URL = import.meta.env.MODE == 'production' ? 'https://vgetestpro.shop:8080' : 'http://localhost:8080';
const COOKIE_VERIFY = '/user/cookie-verify';

const PASSWORD_LOGIN = '/user/login';

// 二维码的请求路径
const CAPTCHA_URL = '/user/code';
// 用户退出登陆
const LOGOUT_URL = '/user/logout';

// monitor url
const VITE_DATA_URL = import.meta.env.VITE_DATA_URL;

// 监测点位数据 + 天气监测点位数据
const MONITOR_URL = VITE_DATA_URL + '/DTCZML/monitor/monitor_all.json';
const WEATHER_MONITOR_URL = VITE_DATA_URL + '/DTCZML/monitor/weathermonitor.json';

const LANDSLIDE_TRACK_URL = VITE_DATA_URL + '/DTCZML/hazard/animation/trajectory_p1.json';
const LANDSLIDE_SIMULATION_URL = VITE_DATA_URL + '/DTCZML/hazard/animation/中印边界.json';
const STONE_SIMULATION_URL = VITE_DATA_URL + '/DTCZML/hazard/animation/trajectory_P.json';

const WATER_POLYGON_URL = VITE_DATA_URL + '/DTCZML/hazard/water.json';

// 单页面应用数据
const TRAJECTORY_BUFFER_URL = VITE_DATA_URL + '/DTCZML/hazard/Landslide/trajectory_buffer_P.json';
const ROAD_BUFFER_URL = VITE_DATA_URL + '/DTCZML/hazard/Landslide/road_B_P.json';
const BUILDING_BUFFER_URL = VITE_DATA_URL + '/DTCZML/hazard/Landslide/building_P_A.json';
// const TRAJECTORY_POINT_URL = VITE_DATA_URL + '/DTCZML/hazard/Lanslide/trajectory_P.json';

// 漫游路径
const TWELVE_BUREAU_ROAMING = VITE_DATA_URL + '/DTCZML/viewPort/12局漫游路径.json';
const EIGHTTEEN_BUREAU_ROAMING = VITE_DATA_URL + '/DTCZML/viewPort/18局漫游路径.json';

export {
  BASE_URL,
  COOKIE_VERIFY,
  PASSWORD_LOGIN,
  CAPTCHA_URL,
  LOGOUT_URL,
  MONITOR_URL,
  WEATHER_MONITOR_URL,
  LANDSLIDE_TRACK_URL, // 滑坡轨迹数据标识
  LANDSLIDE_SIMULATION_URL, // 滑坡灾害模拟数据
  STONE_SIMULATION_URL, // 滚石模拟数据
  TRAJECTORY_BUFFER_URL, // 影响范围缓冲区，面矢量数据
  ROAD_BUFFER_URL, // 对周围道路的影响，重叠分析结果，面矢量数据
  BUILDING_BUFFER_URL, // 对周围建筑的影响，叠置分析结果，面矢量数据，其中每个面都有对应的建筑高度和轨迹叠置个数（可以分为两类，等于0和大于0）
  // TRAJECTORY_POINT_URL, // 轨迹点数据，线矢量数据；
  WATER_POLYGON_URL, // 水体数据
  TWELVE_BUREAU_ROAMING, // 十二局漫游路径
  EIGHTTEEN_BUREAU_ROAMING, // 十八局漫游路径
};

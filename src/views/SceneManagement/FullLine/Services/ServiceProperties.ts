/*
 * @Author: Lincong-pro
 * @Date: 2024-02-25 20:49:11
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-12-04 15:23:34
 * @FilePath: \Geology-v3\src\views\SceneManagement\FullLine\Services\ServiceProperties.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import AppConfig from '@/config/AppConfig';

const appConfig = new AppConfig();
const ipServer = appConfig.getConfig().ipServer;
const rate = 0.2;
const centerLineUrl = 'FullLine/Line/json/CZ0327_1.json';
const regionClipUrl = 'FullLine/Line/json/区域地质范围裁剪坐标.json';

const initialViewPort = {
  ViewPoint: {
    Orientation: {
      heading: 6.283185307179586,
      pitch: -1.5684763687412544,
      roll: 0,
    },
    Position: {
      longitude: 97.0045916,
      latitude: 30.5222762,
      height: 1476096.4078466,
    },
  },
  duration: 2,
};

export { ipServer, centerLineUrl, rate, regionClipUrl, initialViewPort };

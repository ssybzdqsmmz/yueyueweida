/*
 * @Author: Lincong-pro
 * @Date: 2024-02-25 20:49:11
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-12-04 15:23:34
 * @FilePath: \Geology-v3\src\views\SceneManagement\TunnelDisaster\Services\ServiceProperties.ts
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
      heading: 351.85721296620795,
      pitch: -29.691608779361474,
      roll: 0.007824741862085139,
    },
    Position: {
      longitude: 98.53972746943906,
      latitude: 20.3251755108089,
      height: 584936.5125528347,
    },
  },
  duration: 2,
};

export { ipServer, centerLineUrl, rate, regionClipUrl, initialViewPort };

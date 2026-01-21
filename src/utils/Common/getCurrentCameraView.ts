import Cesium from 'Cesium';
import { DTScopeEngine } from './Viewer';

/*
 * @Author: fuweiaa 2567873016@qq.com
 * @Date: 2025-03-26 14:53:32
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2025-03-26 14:54:55
 * @FilePath: \Geology-v3\src\utils\Common\getCurrentCameraView.ts
 * @Description: 封装getCurrentCameraView函数用于获取当前视角的相机位置、朝向、角度等信息，方便选取某些初始化视角直接调用此函数即可
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
function getCurrentCameraView() {
  let viewer = DTScopeEngine.viewer;
  if (viewer) {
    let camera = viewer.camera;
    let cartographic = Cesium.Cartographic.fromCartesian(camera.position);
    let view = {
      position: {
        longitude: Cesium.Math.toDegrees(cartographic.longitude),
        latitude: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height,
      },
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll,
    };
    // 输出为 JSON 字符串
    let jsonString = JSON.stringify(view, null, 2);
    console.log(jsonString);
    console.log('当前相机视角:', view);
    alert(`当前相机视角: ${JSON.stringify(view, null, 2)}`);
  } else {
    console.warn('无法获取当前相机视角，viewer未定义');
  }
}

export { getCurrentCameraView };

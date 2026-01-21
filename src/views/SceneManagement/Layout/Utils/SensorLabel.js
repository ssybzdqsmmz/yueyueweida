/*
 * @Author: 枫林残忆 2997534654@qq.com
 * @Date: 2024-03-04 07:30:04
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-17 13:15:50
 * @FilePath: \Geology-V3\src\views\SceneManagement\Layout\Utils\SensorLabel.js
 * @Description:
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 *
 */
import * as Cesium from 'Cesium';
import { ElMessage } from 'element-plus';
export default class SensorLabel {
  viewer = undefined;
  labelControl = undefined;
  constructor(viewer) {
    this.viewer = viewer;
  }
  async loadLabel(res) {
    const marks = [];
    let positions = [];

    res.forEach((element) => {
      positions.push(Cesium.Cartographic.fromDegrees(element.lon, element.lat));
    });

    await this.viewer.terrainProvider.readyPromise;
    let promise = Cesium.sampleTerrain(this.viewer.terrainProvider, 10, positions);

    Cesium.when(promise, (updatedPositions) => {
      updatedPositions.forEach((cartographic, index) => {
        marks.push({
          position: Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height),
          text: res[index].name,
          height: 30,
          imagData: {
            topIcon: 'img/top.png',
            bodyIcon: 'img/blueline.png',
            backIcon: 'img/pointBack.png',
            isRoate: false,
            color: [25 / 255, 255 / 255, 236 / 255, 1],
          },
        });
      });
      // label控制
      this.labelControl = this.viewer.scene.primitives.add(
        //@ts-ignore
        new Cesium.DTMarkIcons({
          marks: marks,
          markSize: 5,
          bodyLen: 5,
        })
      );
      ElMessage.success('加载标段传感器成功');
    });
  }
  clearLabel() {
    if (this.labelControl !== undefined) {
      this.labelControl.destroy();
    }
  }
}

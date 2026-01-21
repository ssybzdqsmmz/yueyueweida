/*
 * @Author: 枫林残忆
 * @Date: 2024-03-04 14:20:49
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-20 09:06:52
 * @FilePath: \Geology-V3\src\views\SceneManagement\Layout\Tools\PostRender.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
//@ts-ignore
import { Viewer, EllipsoidGeodesic, getTimestamp, Cartesian2, defined } from 'Cesium';
import WEventBus from './WEventBus';

let eventBus = new WEventBus();
/**
 * @description: 比例尺改变的回调
 * @return {void}
 */
const scaleChange = (() => {
  // 自己定义比例尺的LOD
  const scaleMap = new Map<number, number>([
    [6, 30000],
    [5, 60000],
    [4, 300000],
    [3, 600000],
    [2, 1000000],
    [1, Number.MAX_VALUE],
  ]);
  let lastLOD = -1;
  let lastLegendUpdate = getTimestamp();

  return (viewer: Viewer) => {
    let now = getTimestamp();
    if (now < lastLegendUpdate + 250) {
      // 防止多次调用造成卡顿
      return;
    }
    let cameraHeight = viewer.scene.camera.positionCartographic.height;
    let scaleLOD = -1;

    for (let [key, value] of scaleMap) {
      if (cameraHeight <= value) {
        scaleLOD = key;
        break;
      }
    }
    if (!(lastLOD != -1 && scaleLOD == lastLOD)) {
      lastLOD = scaleLOD;
      eventBus.emit('updateLabel', 'LOD' + scaleLOD); // 改变标签的显示与隐藏
    }
  };
})();

/**
 * @description: 用于更新比例尺
 * @param {*} param1
 * @return {*}
 */
const updateScale = (() => {
  let geodesic = new EllipsoidGeodesic();
  // 所有的比例尺
  let distances = [
    1, 2, 3, 5, 10, 20, 30, 50, 100, 200, 300, 500, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000,
    2000000, 3000000, 5000000, 10000000, 20000000, 30000000, 50000000,
  ];
  let lastLegendUpdate = getTimestamp();
  return {
    callback: (viewer: Viewer) => {
      let now = getTimestamp();
      if (now < lastLegendUpdate + 250) {
        // 防止多次调用造成卡顿
        return;
      }
      lastLegendUpdate = now;
      // 左右侧像素
      let width = viewer.scene.canvas.clientWidth;
      let height = viewer.scene.canvas.clientHeight;

      // 获取左右视窗的距离
      let left = viewer.scene.camera.getPickRay(new Cartesian2((width / 2) | 0, height - 1));
      let right = viewer.scene.camera.getPickRay(new Cartesian2((1 + width / 2) | 0, height - 1));
      let globe = viewer.scene.globe;
      let leftPosition = globe.pick(left, viewer.scene);
      let rightPosition = globe.pick(right, viewer.scene);

      // 不在地球上
      if (!defined(leftPosition) || !defined(rightPosition)) {
        return;
      }
      let leftCartographic = globe.ellipsoid.cartesianToCartographic(leftPosition);
      let rightCartographic = globe.ellipsoid.cartesianToCartographic(rightPosition);

      geodesic.setEndPoints(leftCartographic, rightCartographic);
      let pixelDistance = geodesic.surfaceDistance; // 大地距离
      let maxBarWidth = 100; // 判断的方式是第一个满足为100像素的为准确比例尺

      let distance;
      for (let i = distances.length - 1; !defined(distance) && i >= 0; --i) {
        if (distances[i] / pixelDistance < maxBarWidth) {
          distance = distances[i];
        }
      }

      let labelText;
      let barWidth;
      // 创建label并为其重新赋值
      if (defined(distance)) {
        if (distance >= 1000) {
          labelText = (distance / 1000).toString() + ' km';
        } else {
          labelText = distance.toString() + ' m';
        }
        barWidth = (distance / pixelDistance) | 0;
      }

      let distanceLegendLabel = document.getElementsByClassName('distance-legend-label')[0];
      let distanceLegendBar = document.getElementsByClassName('distance-legend-scale-bar')[0];
      if (distanceLegendLabel) {
        distanceLegendLabel.textContent = labelText; //@ts-ignore
        distanceLegendBar.style.left = 5 + (125 - barWidth) / 2 + 'px'; //@ts-ignore
        distanceLegendBar.style.width = barWidth + 'px';
      } else {
        let divStr = `<div class="distance-legend" style="bottom: 4px; right: 117px;">
      		<div class="distance-legend-label">${labelText}</div>
      	<div class="distance-legend-scale-bar" style="width: ${barWidth}'px'"></div>
      </div>`;
        let container = document.createElement('div');
        container.innerHTML = divStr;
        document.body.appendChild(container);
      }
    },
    clearTrash: () => {
      console.log('清理');
      let distanceLegend = document.getElementsByClassName('distance-legend')[0].parentNode;
      document.body.removeChild(distanceLegend);
    },
  };
})();

export { scaleChange, updateScale };

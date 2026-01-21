/*
 * @Author: Lincong-pro
 * @Date: 2023-04-02 21:34:22
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-04 09:08:01
 * @FilePath: \geoproject2.0\src\utils\Common\BasicShape.ts
 * @Description: 基础图形绘制
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import { Cartesian3, Color, HeightReference, CallbackProperty, ColorMaterialProperty } from 'Cesium';
import { DTScopeEngine } from './Viewer';
/**
 * @description: 根据笛卡尔坐标绘制点
 * @param {Cartesian3} cartesian3 绘制的点的位置
 * @param {Color} color 点的颜色
 * @return {number} 点的id
 */
export function drawPoint(cartesian3: Cartesian3, color: Color): number {
  let viewer = DTScopeEngine.viewer;
  return viewer.entities.add({
    position: cartesian3,
    point: {
      color: color,
      pixelSize: 5,
      heightReference: HeightReference.CLAMP_TO_GROUND, // 贴地
    },
  }).id;
}

/**
 * @description: 根据点位 + 材质绘制多边形
 * @param {Cartesian3[] | CallbackProperty} pnts
 * @param {Color | ColorMaterialProperty} material
 * @return {number} 多边形的id
 */
export function drawPolygon(pnts: Cartesian3[] | CallbackProperty, material: Color | ColorMaterialProperty): number {
  let viewer = DTScopeEngine.viewer;
  return viewer.entities.add({
    polygon: {
      hierarchy: pnts,
      material: material,
    },
  });
}

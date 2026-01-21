/*
 * @Author: Lincong-pro
 * @Date: 2023-04-01 21:36:27
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-22 12:17:53
 * @FilePath: \geoproject2.0\src\utils\Common\OnlineEdit.ts
 * @Description: 在线编辑板块功能实现
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */

import {
  LabelStyle,
  CustomDataSource,
  Entity,
  VerticalOrigin,
  Cartesian3,
  HorizontalOrigin,
  PolygonGeometry,
  GeometryInstance,
  Material,
  Color,
  EllipsoidSurfaceAppearance,
  PolygonHierarchy,
  Primitive,
  //@ts-ignore
} from 'Cesium';
import { DTScopeEngine } from './Viewer';

import monitorBlue from '@/assets/images/dtglobe/monitor-blue.png';
import monitorYellow from '@/assets/images/dtglobe/monitor-yellow.png';
import monitorLine from '@/assets/images/dtglobe/monitor-line.png';
import pointBack from '@/assets/images/dtglobe/pointBack.png';
import waterNormal from '@/assets/materials/waterNormal.jpg';

enum MonitorIcon { //@ts-ignore
  warning = monitorBlue, //@ts-ignore
  normal = monitorYellow, //@ts-ignore
  bodyIcon = monitorLine, //@ts-ignore
  bgIcon = pointBack,
}

/**
 * @description: 根据笛卡尔坐标的位置添加标注【空间直角坐标系】
 * @param {Cartesian3} position 笛卡尔坐标
 * @param {any} icon 图标
 * @return {void}
 */
export const addMarker = (position: Cartesian3, icon) => {
  let viewer = DTScopeEngine.viewer;
  let dataSource = viewer.dataSources.getByName('markers')[0];
  if (!dataSource) {
    dataSource = new CustomDataSource('markers');
    viewer.dataSources.add(dataSource);
  }
  dataSource.entities.add(
    new Entity({
      position: position,
      billboard: {
        image: icon,
        style: LabelStyle.FILL,
        showBackground: true,
        //@ts-ignore
        verticalOrigin: VerticalOrigin.BOTTOM,
        //@ts-ignore
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        //@ts-ignore
        horizontalOrigin: HorizontalOrigin.CENTER,
      },
    })
  );
};

/**
 * @description: 根据笛卡尔坐标的位置添加标注【空间直角坐标系】
 * @param {string} text label标签
 * @param {Cartesian3} position 笛卡尔坐标
 * @param {Object[]} marks 引用->返回mark
 * @return {void}
 */
export const addMarkerPrimitive = (text: string, position: Cartesian3, marks) => {
  marks.push({
    position: position,
    text: text,
    height: 50,
    imagData: {
      topIcon: MonitorIcon.normal,
      bodyIcon: MonitorIcon.bodyIcon,
      backIcon: MonitorIcon.bgIcon,
      isRoate: false,
      color: [255 / 255, 215 / 255, 0 / 255, 1],
    },
  });
};

/**
 * @description: 添加水面
 * @param {number} data 表面数据
 * @param {number} height 水面高度
 * @return {void}
 */
export const addWaterFace = (data: number[], height: number) => {
  // 几何属性
  let geometry = new PolygonGeometry({
    polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArray(data)),
    height: height,
  });
  let geometryInstance = new GeometryInstance({
    geometry: geometry,
  });
  // 材质属性
  let material = new Material({
    fabric: {
      type: 'Water',
      uniforms: {
        baseWaterColor: new Color(8 / 255.0, 28 / 255.0, 47 / 255.0, 0.5),
        normalMap: waterNormal,
        frequency: 1000.0,
        animationSpeed: 0.1,
        amplitude: 4,
        specularIntensity: 10,
      },
    },
  });

  let appearance = new EllipsoidSurfaceAppearance({
    material: material,
  });
  return new Primitive({
    geometryInstances: geometryInstance,
    appearance: appearance,
  });
};

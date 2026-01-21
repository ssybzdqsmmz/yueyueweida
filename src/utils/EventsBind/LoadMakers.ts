/*
 * @Author: Lincong-pro
 * @Date: 2023-04-04 09:07:50
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-22 12:15:17
 * @FilePath: \geoproject2.0\src\utils\EventsBind\LoadMakers.ts
 * @Description: 加载监测点位信息
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import {
  Resource,
  Cartographic,
  //@ts-ignore
  DTMarkIcons,
} from 'Cesium';
import { addMarkerPrimitive } from '../Common/OnlineEdit';
import { cartographicToCartesian3 } from '../Common/Transform';
import { DTScopeEngine } from '../Common/Viewer';

enum MonitorType {
  Inclinator = 'Inclinator', // 倾斜监测
  GNSSSurface = 'GNSS-surface', // 表面沉降
  DeformedPile = 'Deformed-pile', // 形变桩
  DeepDisplacement = 'Deep-displacement', // 深度位移
  BPGNSS = 'BP_GNSS', // BP GNSS
  GroundSAR = 'Ground-SAR', // 地面SAR
  Microseismic = 'Microseismic', // 微震监测
  MeteorologicalStation = 'Meteorological-station', // 气象站
  LinearDisplacement = 'Linear-displacement', // 线性位移
}

/**
 * @description: 加载Json监测点位数据R
 * @param {string} jsonUrl
 * @return {void}
 */
export default function LoadMarker(jsonUrl: string) {
  this._resource = jsonUrl;
  // primitive
  this._labels = undefined;
  // store the information of some a monitor { name: 名称, position: 位置[经纬度], type: 传感器类型 }
  this._marksInfo = [];
}

/**
 * @description: 加载点位数据
 * @return {void}
 */
LoadMarker.prototype.load = function () {
  // concrete operation
  const fetchPromise = Resource.fetchJson({ url: this._resource });
  const resolve = (monitorData) => {
    let marks = [];
    // 多种监测数据类型
    for (let i = 0; i < monitorData.data.length; i++) {
      let monitors = monitorData.data[i];
      for (let j = 0; j < monitors.length; j++) {
        let cartographic = Cartographic.fromDegrees(monitors[j].x, monitors[j].y, monitors[j].z - 30);
        let type: MonitorType = getMonitorTypeByName(monitors[j].name);
        this._marksInfo.push({
          position: {
            longitude: monitors[j].x,
            latitude: monitors[j].y,
            height: monitors[j].z,
          },
          name: monitors[j].name,
          type: type,
        });
        addMarkerPrimitive(monitors[j].name, cartographicToCartesian3(cartographic), marks);
      }
    }
    // create the DTMarkIcons
    let viewer = DTScopeEngine.viewer;
    this._labels = viewer.scene.primitives.add(
      new DTMarkIcons({
        marks: marks,
        markSize: 15,
        bodyLen: 15,
      })
    );
  };
  fetchPromise.then(resolve);
};

/**
 * @description: 获取监测点位信息
 * @param {number} index 监测点索引
 * @return {void}
 */
LoadMarker.prototype.getMarkInfo = function (index: number) {
  return this._marksInfo[index];
};

/**
 * @description: 显示marker
 * @return {void}
 */
LoadMarker.prototype.activate = function () {
  this._labels.show = true;
};

/**
 * @description: 恢复三维场景
 * @return {void}
 */
LoadMarker.prototype.deactivate = function () {
  this._labels.show = false;
};

/**
 * @description: 释放内存
 * @return {void}
 */
LoadMarker.prototype.destroy = function () {
  let viewer = DTScopeEngine.viewer;
  viewer.scene.primitives.remove(this._labels);
  this._marksInfo = [];
};

/**
 * @description: 根据传感器名称返回对应的类型
 * @param {string} monitorName
 * @return {MonitorType} type
 */
function getMonitorTypeByName(monitorName: string): MonitorType {
  let type: MonitorType;
  for (let key in MonitorType) {
    if (monitorName.startsWith(MonitorType[key])) {
      type = MonitorType[key];
      break;
    }
  }
  return type;
}

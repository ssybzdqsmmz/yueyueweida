/*
 * @Author: Lincong-pro
 * @Date: 2023-04-07 15:06:54
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2025-03-26 16:16:08
 * @FilePath: \Geology-v3\src\utils\EventsBind\LoadMarkersBind.ts
 * @Description: Load Marker的鼠标事件绑定-原生Cesium事件
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import CesiumBind from './CesiumBind';
import { ScreenSpaceEventType, defined } from 'Cesium';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import LoadMarker from './LoadMakers';
// import { MONITOR_URL } from '@/api/url';
import store from '@/store/index';
import { UIType, LeftClickMode } from '@/store/modules/types';

/**
 * @description:
 * @return {void}
 */
export default function LoadMarkersBind() {
  if (!LoadMarkersBind.prototype.instance) {
    // construct inheritance
    this._parent = new CesiumBind();
    this.setPropetiesData = undefined; // External Vue components that need to change properties, here is to click on the monitoring point to display the property value
    // this._markerTool = new LoadMarker(MONITOR_URL);
    this.load();
    LoadMarkersBind.prototype.instance = this;
  }
  return this.instance;
}

LoadMarkersBind.prototype.instance = undefined;

/**
 * @description: 外部的vue响应式变量
 * @param {object} setPropetiesData 响应式数据函数（闭包实现）
 * @return {void}
 */
LoadMarkersBind.prototype.bindVueProperty = function (setPropetiesData) {
  this.setPropetiesData = setPropetiesData;
};

/**
 * @description: 加载
 * @return {void}
 */
LoadMarkersBind.prototype.load = function () {
  this._markerTool.load();
  this._parent.bindEvent(this.bindLeftClick.bind(this), ScreenSpaceEventType.LEFT_CLICK);
};

/**
 * @description: 绑定键盘事件
 * @return {void}
 */
LoadMarkersBind.prototype.activate = function () {
  this._parent.bindEvent(this.bindLeftClick.bind(this), ScreenSpaceEventType.LEFT_CLICK);
  this._markerTool.activate();
};

/**
 * @description: 取消键盘事件绑定
 * @return {void}
 */
LoadMarkersBind.prototype.deactivate = function () {
  this._parent.deactivate();
  this._markerTool.deactivate();
};

/**
 * @description: 释放当前页面内存
 * @return {void}
 */
LoadMarkersBind.prototype.destroy = function () {
  this._parent.destroy();
  this._markerTool.destroy();
};

//* /////////////////////////////////////////// affiliated functions /////////////////////////////////////////////
/**
 * @description: 绑定左键
 * @param {*} event
 * @return {void}
 */
LoadMarkersBind.prototype.bindLeftClick = function (event) {
  if (store.getters['ui_store/leftClickMode'] != LeftClickMode.MonitorBarInfo) {
    return;
  }
  let viewer = DTScopeEngine.viewer;
  // get the screen coordinate
  let screenPosition = event.position;
  // company primitive with properties { index: xx }
  let pickedFeature = viewer.scene.pick(screenPosition);
  if (!defined(pickedFeature)) {
    return;
  }
  let index = pickedFeature.index;
  let markInfo = this._markerTool.getMarkInfo(index);
  if (!store.getters['ui_store/monitorPopUp']) {
    store.commit('ui_store/setUIStatus', { ui: UIType.MonitorPopUp, status: true });
  }
  // 执行后续的绕点环绕 || 面板显示对应的属性
  this.setPropetiesData({
    name: markInfo.name,
    latitude: markInfo.position.latitude,
    longitude: markInfo.position.longitude,
    height: markInfo.position.height,
    descrip: markInfo.type,
  });
};

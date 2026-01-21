/*
 * @Author: Lincong-pro
 * @Date: 2023-04-03 08:40:11
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-09-02 09:27:49
 * @FilePath: \GeoProject\src\utils\EventsBind\CesiumBind.ts
 * @Description: 实现顶级的抽象机制
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import { ScreenSpaceEventHandler, ScreenSpaceEventType } from 'Cesium';
import { DTScopeEngine } from '@/utils/Common/Viewer';

/**
 * @description: 顶级父类，用于实现事件的绑定、解绑
 * @return {void}
 */
export default function CesiumBind() {
  this._handler = new ScreenSpaceEventHandler(DTScopeEngine.viewer.canvas);
  this._registerEvents = new Array<ScreenSpaceEventType>();
}

/**
 * @description: 注册对应的案件->实现Cesium对应操作的绑定
 * @param {Function} callback
 * @param {ScreenSpaceEventType} mouseType
 * @return {void}
 */
CesiumBind.prototype.bindEvent = function (callback: any, mouseType: ScreenSpaceEventType) {
  this._handler.setInputAction(callback, mouseType);
  this._registerEvents.push(mouseType);
};

/**
 * @description: 取消注册的绑定事件
 * @param {ScreenSpaceEventType} mouseType
 * @return {void}
 */
CesiumBind.prototype.unbindEvent = function (mouseType: ScreenSpaceEventType) {
  this._handler.removeInputAction(mouseType);
  // remove the specified mouse type from the colllection
  this._registerEvents = this._registerEvents.filter((eventType) => eventType !== mouseType);
};

/**
 * @description: 取消绑定 Cesium 原生的键盘事件
 * @return {void}
 */
CesiumBind.prototype.deactivate = function () {
  // unbind all the events handle function
  this._registerEvents.forEach((mouseType) => {
    this._handler.removeInputAction(mouseType);
  });
};

/**
 * @description: 摧毁handler
 * @return {void}
 */
CesiumBind.prototype.destroy = function () {
  // unbind all the events handle function
  this._registerEvents.forEach((mouseType) => {
    this._handler.removeInputAction(mouseType);
  });
  this._handler.destroy();
  this._handler = undefined;
};

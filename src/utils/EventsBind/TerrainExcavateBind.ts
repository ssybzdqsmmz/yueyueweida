/*
 * @Author: Lincong-pro
 * @Date: 2023-04-02 21:17:56
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-12 14:48:16
 * @FilePath: \geoproject2.0\src\utils\EventsBind\TerrainExcavateBind.ts
 * @Description: 向Cesium添加动态地形绘制绑定逻辑
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import { Color, CallbackProperty, PolygonHierarchy, ColorMaterialProperty, ScreenSpaceEventType, defined } from 'Cesium';
import { screenToCartesian3 } from '../Common/Transform';
import { drawPoint, drawPolygon } from '../Common/BasicShape';
import { TerrainExcavate } from './TerrainExcavate';
import CesiumBind from './CesiumBind';

/**
 * @description:
 * @return {void}
 */
export default function TerrainExcavateBind() {
  // construct inheritance
  this._parent = new CesiumBind();
  this._shapePoints = [];
  this._shapePntsEntityId = [];
  this._shapePolygonId = undefined;
  this._terrainObjects = [];
  this.load();
}

TerrainExcavateBind.prototype.load = function () {
  this.activate();
};

/**
 * @description: 清空场景
 * @return {void}
 */
TerrainExcavateBind.prototype.clear = function () {
  this._terrainObjects.forEach((terrainObj) => {
    terrainObj.destroy();
  });
  this._terrainObjects = [];
};

/**
 * @description: 绑定键盘事件
 * @return {void}
 */
TerrainExcavateBind.prototype.activate = function () {
  this._parent.bindEvent(this.bindLeftClick.bind(this), ScreenSpaceEventType.LEFT_CLICK);
  this._parent.bindEvent(this.bindMouseMove.bind(this), ScreenSpaceEventType.MOUSE_MOVE);
  this._parent.bindEvent(this.bindRightClick.bind(this), ScreenSpaceEventType.RIGHT_CLICK);
};

/**
 * @description: 取消绑定
 * proxy the deactivate function
 * @return {void}
 */
TerrainExcavateBind.prototype.deactivate = function () {
  this._parent.deactivate();
};

/**
 * @description: 释放内存
 * @return {void}
 */
TerrainExcavateBind.prototype.destroy = function () {
  this._parent.destroy();
};

//* /////////////////////////////////////////// affiliated functions /////////////////////////////////////////////

/**
 * @description: 鼠标左键绘制点 + 动态改变悬浮点[改变polygon]
 * @param {any} event 屏幕点击事件
 * @return {void}
 */
TerrainExcavateBind.prototype.bindLeftClick = function (event) {
  let screenPosition = event.position;
  let cartesian = screenToCartesian3(screenPosition);
  if (defined(cartesian)) {
    // step0:binding the dynamic property
    if (this._shapePoints.length === 0) {
      // step1:change the dynamic positions
      let entityId = drawPoint(cartesian, Color.WHITE);
      // step2:create point
      this._shapePntsEntityId.push(entityId);
      this._shapePoints.push(cartesian);
      // create callback property used to dynamic draw the polygon
      let dynamicPositions = new CallbackProperty(() => {
        return new PolygonHierarchy(this._shapePoints);
      }, false);
      this._shapePolygonId = drawPolygon(dynamicPositions, new ColorMaterialProperty(Color.WHITE.withAlpha(0.7)));
    }
    // step1:change the dynamic positions
    this._shapePoints.push(cartesian);
    // step2:create point
    let entityId = drawPoint(cartesian, Color.WHITE);
    this._shapePntsEntityId.push(entityId);
  }
};
/**
 * @description: 动态改变悬浮点
 * @param {any} event 屏幕点击事件
 * @return {void}
 */
TerrainExcavateBind.prototype.bindMouseMove = function (event) {
  if (this._shapePoints.length === 0) {
    return;
  }
  let screenPosition = event.endPosition;
  let cartesian = screenToCartesian3(screenPosition);
  if (defined(cartesian)) {
    // step0:pop the floating value
    this._shapePoints.pop();
    // step1:change the dynamic positions
    this._shapePoints.push(cartesian);
  }
};

/**
 * @description: 用户点击右键
 * @param {any} event 屏幕点击事件
 * @return {void}
 */
TerrainExcavateBind.prototype.bindRightClick = function (event) {
  // step0:terrain excavate
  let terrainObj = new TerrainExcavate(Array.from(this._shapePoints), 30, 100);
  // step1:sample entity point binding to the terrain object
  terrainObj.bindSampleIds(this._shapePntsEntityId);
  this._terrainObjects.push(terrainObj);
  // step2:remove the polygon created by the dynamic propert
  this._shapePoints = [];
  this._shapePntsEntityId = [];
};

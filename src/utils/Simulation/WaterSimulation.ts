/*
 * @Author: Lincong-pro
 * @Date: 2023-04-18 20:05:13
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-19 21:45:54
 * @FilePath: \geoproject2.0\src\utils\Simulation\WaterSimulation.ts
 * @Description: 控制水流模拟的演进效果
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */

import { Resource, Primitive } from 'Cesium';
import { WATER_POLYGON_URL } from '@/api/url';
import { addWaterFace } from '@/utils/Common/OnlineEdit';
import { DTScopeEngine } from '../Common/Viewer';

/**
 * @description: 河流演进模拟
 */
class WaterSimulation {
  /**
   * @description: 传入对应的初始化参数
   * @param {Object} options
   * @return {void}
   */
  constructor(options) {
    this._frameCount = options.frameCount;
    this._primitives = [];
  }

  /**
   * @description: 初始化操作
   * @return {void}
   */
  async load() {
    let viewer = DTScopeEngine.viewer;
    // step1: request data from server
    let originWaterPolygon = await Resource.fetchJson({
      url: WATER_POLYGON_URL,
    });
    // reshape points
    let points = [];
    // @ts-ignore
    for (let item of originWaterPolygon.data) {
      points.push(item.x);
      points.push(item.y);
    }
    let pointsLength = points.length / 2;
    // step2: compute count
    this._numParticles = Math.floor(pointsLength / this._frameCount);
    // step3: draw primitive at every frame
    // for (let i = 0; i < this._frameCount; i++) {
    //   let end = points.length;
    //   let waterPolygon = points.slice(0, end);
    //   let primitive = addWaterFace(waterPolygon, 1320 + 1 * i);
    //   // @ts-ignore
    //   this._primitives.push(primitive);
    //   // add to scene
    //   viewer.scene.primitives.add(primitive);
    //   primitive.show = false;
    // }
    let waterPolygon = points.slice(0, points.length);
    let primitive = addWaterFace(waterPolygon, 1280);
    viewer.scene.primitives.add(primitive);
    this._primitives.push(primitive);
    primitive.show = false;
  }

  /**
   * @description: 显示水面
   * @return {void}
   */
  activate() {
    this._primitives.forEach((primitive) => {
      primitive.show = true;
    });

    // this.deactivate();
    // this._currentFrame = 0;
    // let timerId = setInterval(() => {
    //   let preFrame = this._currentFrame - 1;
    //   if (preFrame < 0) {
    //     preFrame = preFrame + this._frameCount;
    //   }
    //   this._primitives.at(this._currentFrame).show = true;
    //   this._primitives.at(preFrame).show = false;
    //   this._currentFrame++;
    //   if (this._currentFrame === this._frameCount) {
    //     this._currentFrame = 0;
    //     clearInterval(timerId);
    //   }
    // }, 100);
  }

  /**
   * @description: 关闭水面显示
   * @return {void}
   */
  deactivate() {
    this._primitives.forEach((primitive) => {
      // @ts-ignore
      primitive.show = false;
    });
  }

  /**
   * @description: 释放内存
   * @return {void}
   */
  destroy() {
    let viewer = DTScopeEngine.viewer;
    this._primitives.forEach((primitive) => {
      viewer.scene.primitives.remove(primitive);
    });
    this._primitives = [];
  }

  public _currentFrame: number; // current frame
  public _frameCount: number; // water flow evolution frame rate
  public _numParticles: number; // the number of points to draw each frame surface
  public _primitives: Primitive[]; // the whole primitives to draw
}

export default WaterSimulation;

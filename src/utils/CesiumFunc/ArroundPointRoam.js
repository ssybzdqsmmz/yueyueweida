/*
 * @Author: WouRaoyu
 * @Date: 2021-05-17 14:29:07
 * @LastEditors: changfanhao
 * @LastEditTime: 2023-02-28 13:34:21
 * @Description: file content
 * @FilePath: \GeoProject\src\utils\ArroundPointRoam.js
 * @Copyright (c) : 2021 VrLab
 */

import * as Cesium from 'Cesium';

class ArroundPointRoam {
  constructor(options) {
    this._viewer = options.viewer;
    this._center = options.center;
    this._initview = options.initview;
    this._duration = options.duration;
    this._distance = undefined;
    this._interval = undefined;
    this._hprange = undefined;
    this._step = undefined;
  }

  /**
   * @description: 绕点环绕-创建
   * @return {void}
   */
  create() {
    this._step = (2 * Math.PI) / (this._duration * 50);
    let pnta = this._center;
    let pntb = this._initview.position;
    this._distance = Cesium.Cartesian3.distance(pnta, pntb);
    let heading = this._initview.orientation.heading;
    let pitch = this._initview.orientation.pitch;
    this._hprange = new Cesium.HeadingPitchRange(heading, pitch, this._distance);
  }

  /**
   * @description: 开始播放动画
   * @return {void}
   */
  start() {
    this._interval = setInterval(() => {
      this._viewer.camera.lookAt(this._center, this._hprange);
      this._hprange.heading += this._step;
    }, 20);
  }

  /**
   * @description: 停止播放动画
   * @return {void}
   */
  stop() {
    clearInterval(this._interval);
    this._viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    this._interval = undefined;
  }
}

export default ArroundPointRoam;

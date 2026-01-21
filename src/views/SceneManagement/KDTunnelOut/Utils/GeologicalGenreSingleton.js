/*
 * @Descripttion: 地质体漫游工具
 * @version: 1.0.0
 * @Author: tmz
 * @Date: 2020-12-18 15:59:10
 * @LastEditors: anganao
 * @LastEditTime: 2024-02-29 19:20:35
 */

import { getCameraViewPoint, setCameraViewPoint } from './DTGlobe.js';

class GeologicalGenreSingleton {
  constructor(viewer) {
    if (GeologicalGenreSingleton.instance) {
      return GeologicalGenreSingleton.instance;
    }
    this._viewer = viewer;
    this._pointLocalSearchEvent = undefined;
    this._timeout = undefined;
  }

  // 开始地图漫游
  startMapRoam(json) {
    // 每次开始前先回到一个合适的相机下
    let indexViewPoint = 0;
    let maxViewPointNum = 0;
    let that = this;
    let viewPointList = json;

    let startViewPoint = viewPointList[indexViewPoint];
    indexViewPoint++;

    // 对当前视点情况进行判断
    let cvp = getCameraViewPoint(this._viewer);
    let londiff = cvp.Position.longitude - startViewPoint.Position.longitude;
    let latdiff = cvp.Position.latitude - startViewPoint.Position.latitude;
    let heidiff = cvp.Position.height - startViewPoint.Position.height;
    if (Math.abs(londiff) < 0.001 && Math.abs(latdiff) < 0.001 && Math.abs(heidiff) < 10) {
      satrtCallback();
    } else {
      setCameraViewPoint(this._viewer, startViewPoint, 3, satrtCallback);
    }

    function satrtCallback() {
      maxViewPointNum = viewPointList.length;
      function callback() {
        if (maxViewPointNum === indexViewPoint) {
          // 重新开始
          that.startMapRoam(viewPointList);
          return;
        }
        let vpnext = viewPointList[indexViewPoint];
        if (vpnext.timeout) {
          that._timeout = setTimeout(() => {
            return 0;
          }, vpnext.timeout);
        }
        satrt();
      }

      function satrt() {
        let vp = viewPointList[indexViewPoint];
        indexViewPoint++;
        setCameraViewPoint(that._viewer, vp.ViewPoint, vp.duration, callback);
      }

      satrt();
    }
  }

  stopMapRoam() {
    let scene = this._viewer.scene;
    if (scene && scene.tweens.length > 0) {
      scene.tweens.removeAll();
    }
    if (!this._timeout) {
      return;
    }
    clearTimeout(this._timeout);
  }
}

GeologicalGenreSingleton.getInstance = function (viewer) {
  if (GeologicalGenreSingleton.instance) {
    return GeologicalGenreSingleton.instance;
  }
  GeologicalGenreSingleton.instance = new GeologicalGenreSingleton(viewer);
  return GeologicalGenreSingleton.instance;
};

GeologicalGenreSingleton.destroyInstance = function () {
  if (GeologicalGenreSingleton.instance) {
    GeologicalGenreSingleton.instance = null;
  }
};

export default GeologicalGenreSingleton;

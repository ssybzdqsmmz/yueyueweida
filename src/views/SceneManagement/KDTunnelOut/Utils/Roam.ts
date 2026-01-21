/*
 * @Author: anganao
 * @Date: 2024-02-29 18:52:17
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-23 14:23:38
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnelOut\Utils\Roam.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import { Resource } from 'Cesium';
import GeologicalGenreSingleton from './GeologicalGenreSingleton.js';
import { setCameraViewPoint } from './DTGlobe.js';
import PathlineRoaming from './PathlineRoaming.js';
export default class Roam {
  viewer = undefined;
  constructor(viewer) {
    this.viewer = viewer;
  }
  fieldRoam(state, type, dataUrl) {
    Resource.fetchJson({
      url: dataUrl,
    }).then((res) => {
      const data = res.roam[type];
      let geological = GeologicalGenreSingleton.getInstance(this.viewer);
      if (!state) {
        geological.stopMapRoam();
        return;
      }
      let camerapt = data.StartViewPoint;
      if (camerapt) {
        setCameraViewPoint(this.viewer, camerapt, 3, () => {
          setTimeout(() => {
            geological.startMapRoam(data.path);
          }, 1000);
        });
      } else {
        geological.startMapRoam(data.path);
      }
    });
  }
  tunnelRoam(url) {
    Resource.fetchJson({
      url,
    }).then((res) => {
      let option = {
        viewer: this.viewer,
        positions: res,
        speed: 100,
      };
      for (let i = 0; i < option.positions.length; i++) {
        option.positions[i][2] -= 7;
      }
      setTimeout(() => {
        let pathlineroaming = new PathlineRoaming(option);
        pathlineroaming.startRoamingWithoutOri();
      }, 2000);
    });
  }
}

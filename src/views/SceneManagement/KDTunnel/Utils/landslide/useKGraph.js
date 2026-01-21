/*
 * @Author: Lincong-pro
 * @Date: 2023-07-10 10:18:55
 * @LastEditors: anganao 1928882425@qq.com
 * @LastEditTime: 2024-04-18 00:06:19
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnel\Utils\landslide\useKGraph.js
 * @Description:
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import DisasterGraphics from './DisasterGraph';
import { DTTerrainTransparent } from 'Cesium';

class GraphicsService {
  /* eslint-disable  */
  _terrainTransparent; // 公司的地形透明API
  _disasterGraphic; // 绘制受影响的房屋
  /* eslint-enable */
  loadingPromise;

  constructor(viewer) {
    this.viewer = viewer;
    this.load();
    this.bind();
  }

  /**
   * @description: 绑定键盘事件
   * @return {void}
   */
  bind() {
    let viewer = this.viewer;
    document.onkeyup = (event) => {
      switch (event.code) {
        case 'KeyA': {
          viewer.scene.skyBox.show = true;
          // alpha的实质是改变imagery的透明度
          this._terrainTransparent = new DTTerrainTransparent({
            viewer,
            alpha: 0.7,
          });
          break;
        }
        case 'KeyB': {
          viewer.scene.skyBox.show = false;
          // alpha的实质是改变imagery的透明度
          this._terrainTransparent.closeTerrainTransparent();
          delete this._terrainTransparent;
          this._terrainTransparent = undefined;
          break;
        }
      }
    };
  }

  /**
   * @description: 绘制物体
   * @return {void}
   */
  load() {
    this._disasterGraphic = new DisasterGraphics(this.viewer); // 灾害数据绘制
    this.loadingPromise = this._disasterGraphic.load(this.viewer);
  }

  activate() {
    this.viewer.scene.globe.depthTestAgainstTerrain = false;
  }

  deactivate() {
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    this._disasterGraphic?.deactivate();
    this._terrainTransparent?.closeTerrainTransparent();
    delete this._terrainTransparent;
    this._terrainTransparent = undefined;
  }
  /**
   * @description: 房屋闪烁
   * @param {boolean} status
   */
  flashing(status) {
    if (status) {
      this._disasterGraphic?.houseFlash();
    } else {
      this._disasterGraphic?.stopFlash();
    }
  }

  destroy() {
    this._disasterGraphic?.destroy();
    this._disasterGraphic = undefined;
  }
}

export default function useKGraphics(viewer) {
  return new GraphicsService(viewer);
}

/*
 * @Author: Lincong-pro
 * @Date: 2023-03-12 15:35:57
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-05-11 16:58:29
 * @FilePath: \Geology-v3\src\mixins\GlobeController.js
 * @Description: 将Vue2中的mixin替换为vue3的composition api
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import { MenusInfo } from '@/components/information/GlobeInfo';
import DaduheView from '@/components/information/Daduhe.ts';
import { setCameraViewPoint } from '@/utils/Common/CameraControl';

/**
 * @description: 场景的切换模式
 */
const ChooseSceneMode = {
  ParentScene: 'ParentScene',
  DaduheScene: 'DaduheScene',
};

export default class GlobeController {
  /**
   * 构造器
   * @param {CeisumViewer} viewer
   */
  constructor(viewer) {
    if (!GlobeController.instance) {
      this.DTGlobe = [];
      this.DTGlobe.push(viewer);
      GlobeController.instance = this;
    }
    this._chooseSceneMode = 'ParentScene';
    return GlobeController.instance;
  }

  /**
   * @description: 开启固定的图层
   * @param {Array} labelArray 图层数组
   * @return {void}
   */
  chooseLayers(labelArray) {
		this.DTGlobe[0].DTScene.layers.forEach((layers) => {
			console.log(this.DTGlobe[0].DTScene.layers,'chooselayers')
      layers.values.forEach((layer) => {
        let show = labelArray.indexOf(layer._label) !== -1;
        if (layer._visible !== show) {
          this.DTGlobe[0].DTScene.setLayerVisiability(layer, show);
        }
      });
    });
  }

  /**
   * @description: 采用策略模式执行内部切换逻辑
   * @param {*} mode
   */
  setChooseSceneMode(mode) {
    this._chooseSceneMode = mode;
  }

  /**
   * @description: 加载对应的场景数据
   * @param {string} name
   * @param {number} duration
   * @return {void}
   */
  chooseScene(name, duration = 3) {
    // camera view point setting
    let viewpnt = undefined;
    let layers = undefined;
    switch (this._chooseSceneMode) {
      // 顶级场景的图层数据获取
      case ChooseSceneMode.ParentScene: {
        if (MenusInfo[name]) {
          viewpnt = MenusInfo[name].viewPnt;
          layers = MenusInfo[name].layers;
        }
        break;
      }
      // 大渡河场景的图层数据获取
      case ChooseSceneMode.DaduheScene: {
        if (DaduheView[name]) {
          viewpnt = DaduheView[name].viewPnt;
          layers = DaduheView[name].layers;
        }
        break;
      }
    }

    let promise = undefined;
    // set camera view and layers
    if (viewpnt) {
      promise = setCameraViewPoint(this.DTGlobe[0], viewpnt, duration);
    }
    if (layers) {
      this.chooseLayers(layers);
    }
    return promise;
  }

  /**
   * @description: 从某个场景中删除某个图层【关闭】
   * @param {*} name
   * @param {Array} addLayers
   * @return {void}
   */
  addLayer(name, ...addLayers) {
    let layers = MenusInfo[name].layers;
    addLayers.map((val) => {
      layers.push(val);
    });
  }

  /**
   * @description: 从某个场景中移除某个图层【关闭】
   * @param {string} name
   * @param {Array} removeLayers
   * @return {void}
   */
  removeLayer(name, ...removeLayers) {
    let layers = MenusInfo[name].layers;

    layers.map((val, index) => {
      if (removeLayers.indexOf(val) !== -1) {
        layers.splice(index, 1);
      }
    });
  }

  /**
   * @description: 用户操作完图层数据之后刷新场景
   * @param {string} name
   * @return {void}
   */
  refreshLayers(name) {
    let layers = MenusInfo[name].layers;
    // refresh layers
    if (layers) {
      this.chooseLayers(layers);
    }
  }
}

/*
 * @Author: Lincong-pro
 * @Date: 2023-04-03 13:29:26
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-18 17:03:23
 * @FilePath: \geoproject2.0\src\utils\Common\LayerControl.ts
 * @Description: 图层控制
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import { DTScopeEngine } from './Viewer';
import { defined, Color, Cartesian3 } from 'Cesium';
import { cartesian3ToScreen } from '@/utils/Common/Transform';
import store from '@/store/index';
import { LeftClickMode } from '@/store/modules/types';

/**
 * @description: 根据图层名字获取对应的图层
 * @param {string[]} layerNames
 * @return {*}
 */
export function getLayersByName(layerNames: string[]) {
  let dtScene = DTScopeEngine.viewer.DTScene;
  let res = [];
  dtScene.layers.forEach((layers) => {
    for (let j = 0; j < layers.values.length; ++j) {
      const layer = layers.values[j];
      if (layerNames.indexOf(layer._label) != -1) {
        // @ts-ignore
        res.push(layer);
      }
    }
  });

  return res;
}

/**
 * @description: 开启图层属性的查询
 * @param {string[]} layerNames 图层名
 * @param {any} propertiesData 界面接收到的响应式数据
 * @param {Proxy} popUpVisible 响应式变量
 * @return {void}
 */
export function QueryLayer(layerNames: string[], propertiesData: any, popUpVisible) {
  const layers = getLayersByName(layerNames);
  // click position
  this._clickPosition = undefined;
  this._presetLayer = undefined;
  this._eventListener = undefined;

  if (layers.length != 0) {
    let viewer = DTScopeEngine.viewer;
    layers.forEach((layer) => {
      layer.clickEvent((featureInfo, feature, click) => {
        if (defined(feature) && store.getters['ui_store/leftClickMode'] == LeftClickMode.BIMInfo) {
          let position = viewer.scene.pickPosition(click.position);
          if (this._presetLayer != undefined) {
            // remove the color set by the viewer
            this._presetLayer.highlightManager.removeAllFeatureColor();
          } else {
            // open the PopUp
            popUpVisible.value = true;
          }
          // set the color
          layer.highlightManager.setFeatureColorByIDs([featureInfo[layer.UIDName]], new Color(1.0, 127 / 255, 0.0, 1.0));
          this._presetLayer = layer;
          // initialize the position
          this._clickPosition = position;
          propertiesData.splice(0, propertiesData.length);
          for (let key in featureInfo) {
            propertiesData.push({
              property: key,
              descrip: featureInfo[key],
            });
          }
          this._eventListener = viewer.clock.onTick.addEventListener(() => {
            this.render(this._clickPosition, 'popup');
          });
        }
      });
    });
  }
}

/**
 * @description: ESC 执行模型颜色清除
 * @return {void}
 */
QueryLayer.prototype.deactivate = function () {
  if (typeof this._presetLayer != 'undefined') {
    // remove the color set by the viewer
    this._presetLayer.highlightManager.removeAllFeatureColor();
    this._presetLayer = undefined;
  }
};
/**
 * @description: 离开界面->清除事件绑定
 * @return {void}
 */
QueryLayer.prototype.destroy = function () {
  let viewer = DTScopeEngine.viewer;
  viewer.clock.onTick.removeEventListener(this._eventListener);
  this._eventListener = undefined;
};

/**
 * @description: 根据三维点的位置更新屏幕面板
 * @param {Cartesian3} position
 * @param {string} id DOM唯一的id
 * @return {void}
 */
QueryLayer.prototype.render = function (position: Cartesian3, id: string) {
  let domNode = document.getElementById(id);
  if (typeof domNode == 'undefined' || domNode == null) {
    return;
  }
  let screenPosition = cartesian3ToScreen(position);
  if (!screenPosition) {
    return;
  }
  // update position timely
  domNode.style.left = screenPosition.x + 'px';
  domNode.style.top = screenPosition.y + 'px';
};

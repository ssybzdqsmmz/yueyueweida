/*
 * Filename: d:\Project_Web\DTGlobe\src\utils\Flatten\TerrainFlatten.js
 * Path: d:\Project_Web\DTGlobe
 * Created Date: Thursday, March 23th 2021, 4:14:57 pm
 * Author: WouRaoyu
 *
 * Copyright (c) 2020 VrLab
 */

import { defined, DTViewerSpliter } from 'Cesium';
import * as Cesium from 'Cesium';

function ExploreObject(event) {
  this._event = event;
}

ExploreObject.prototype.FetchPropertyTypes = function (tile) {
  let content = tile.content;
  let featuresLength = content.featuresLength;
  let properties = new Array();
  for (let i = 0; i < featuresLength; i += 1) {
    // content.getFeature(i).color = Cesium.Color.fromRandom();
    let feature = content.getFeature(i);
    let pnames = feature.getPropertyNames();
    pnames.forEach((element) => {
      if (properties.indexOf(element) === -1) {
        properties.push(element);
      }
    });
  }
  alert(properties);
  this._event.removeEventListener(this.FetchPropertyTypes, this);
};
// 类型名称
ExploreObject.prototype.FetchProperties = function (tile) {
  let content = tile.content;
  let featuresLength = content.featuresLength;
  let types = new Array();
  for (let i = 0; i < featuresLength; i += 1) {
    let feature = content.getFeature(i);
    feature.color = Cesium.Color.fromRandom();
    let type = feature.getProperty('类型名称');
    types.push(type);
  }
  // this._event.removeEventListener(this.FetchProperties, this)
};

class ExploreLayers {
  constructor(options) {
    if (defined(ExploreLayers.instance)) {
      return ExploreLayers.instance;
    }
    ExploreLayers.instance = this;
    this._viewer = options.viewer;
    this._layerNew = undefined;
    this._layerOld = undefined;
    this._splitter = undefined;
  }

  recover() {
    if (this._splitter !== undefined) {
      this._splitter = this._splitter.destroy();
      this._viewer.DTScene.imageLayers.values[0].featureSet.splitDirection = Cesium.ImagerySplitDirection.NONE;

      this._layerNew.dtAEM.dtTilesSpliter.isActive = false;
      this._layerOld.dtAEM.dtTilesSpliter.isActive = false;
    }
  }

  initDSM(newDSM, oldDSM) {
    this._viewer.DTScene.layers.forEach((layers) => {
      layers.values.forEach((layer) => {
        if (layer._label === newDSM) {
          this._layerNew = layer;
        }
        if (layer._label === oldDSM) {
          this._layerOld = layer;
        }
      });
    });
  }

  initTunnel() {
    this._viewer.DTScene.layers.forEach((layers) => {
      layers.values.forEach((layer) => {
        if (layer._label === '斜井施工模型') {
          this._layerNew = layer;
          layer._featureSet.style = new Cesium.Cesium3DTileStyle({
            color: "color('rgba(255,255,255,0.5)')",
          });
        }
        // if (layer._label === '斜井施工模型钢架高亮') {
        //   layer._featureSet.style = new Cesium.Cesium3DTileStyle({
        //     color: "color('rgba(255,255,255,0.5)')",
        //   });
        //   layer.brightness = 10000;
        //   layer.constrast = 10000;
        // }
        if (layer._label === '斜井施工模型钢架未变更') {
          this._layerOld = layer;
        }
      });
    });
  }

  compare() {
    const that = this;
    this._layerNew.dtAEM.dtTilesSpliter.isActive = true;
    this._layerOld.dtAEM.dtTilesSpliter.isActive = true;

    //激活分栏
    if (typeof this._splitter == 'undefined') {
      this._splitter = new DTViewerSpliter({
        viewer: this._viewer,
      });
      this._splitter.onDragEvent.addEventListener((rate) => {
        that._layerNew.dtAEM.dtTilesSpliter.slideX = -rate;
        that._layerOld.dtAEM.dtTilesSpliter.slideX = rate;
      });
      this._layerNew.dtAEM.dtTilesSpliter.slideX = -this._splitter.currentRate;
      that._layerOld.dtAEM.dtTilesSpliter.slideX = this._splitter.currentRate;
      this._layerNew.dtAEM.dtTilesSpliter.showRightUP = true;
    }
  }
}

export { ExploreLayers };

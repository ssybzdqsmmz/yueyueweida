/*
 * @Author: WouRaoyu
 * @Date: 2021-05-05 15:46:57
 * @LastEditors: fuwei
 * @LastEditTime: 2023-09-07 14:26:54
 * @Description: file content
 * @FilePath: \GeoProject\src\utils\Common\CompareLayers.ts
 * @Copyright (c) : 2021 VrLab
 */

import {
  defined, //@ts-ignore
  DTViewerSpliter, //@ts-ignore
  DT3DTilesTransformer, //@ts-ignore
  ImagerySplitDirection,
} from 'Cesium';

import { DTScopeEngine } from '@/utils/Common/Viewer';

/**
 * @description: digital twin types
 * @return {*}
 */
export enum CompareMode {
  SplitV1 = 'split',
  SplitV2 = 'split_',
  SplitV3 = 'split__',
  Default = '',
}

export class CompareLayers {
  constructor(options) {
    if (defined(CompareLayers.instance)) {
      return CompareLayers.instance;
    }
    CompareLayers.instance = this;
    this.layerNew = [];
    this.layerOld = [];
    this.splitter = undefined;
  }

  recover() {
    if (this.splitter) {
      this.splitter = this.splitter.destroy();
      DTScopeEngine.viewer.DTScene.imageLayers.values[0].featureSet.splitDirection = ImagerySplitDirection.NONE;
    }
    this.layerNew.forEach((layer) => {
      DT3DTilesTransformer(layer, 0, 0, 0);
      layer.dtAEM.dtTilesSpliter.isActive = false;
    });

    this.layerOld.forEach((layer) => {
      DT3DTilesTransformer(layer, 0, 0, 0);
      layer.dtAEM.dtTilesSpliter.isActive = false;
    });
  }

  destroy() {
    DTScopeEngine.viewer.DTScene.imageLayers.values[0].featureSet.splitDirection = ImagerySplitDirection.NONE;
    this.recover();
  }
  /**
   * @description: 初始化图层-开启 ---> 后续做一个图层控制器
   * @param {string} label_new
   * @param {string} label_old
   * @return {void}
   */
  initLayers(label_new: string[], label_old: string[]) {
    DTScopeEngine.viewer.DTScene.layers.forEach((layers) => {
      layers.values.forEach((layer) => {
        if (label_new.indexOf(layer._label) >= 0) {
          this.layerNew.push(layer);
        } else if (label_old.indexOf(layer._label) >= 0) {
          this.layerOld.push(layer);
        }
      });
    });
  }
  /**
   * @description: 采用默认的方法进行卷帘
   */
  compare() {
    this.layerNew.forEach((layer) => {
      layer.dtAEM.dtTilesSpliter.isActive = true;
    });
    this.layerOld.forEach((layer) => {
      layer.dtAEM.dtTilesSpliter.isActive = true;
    });
    //激活分栏
    if (typeof this.splitter == 'undefined') {
      this.splitter = new DTViewerSpliter({
        viewer: DTScopeEngine.viewer,
      });
      this.splitter.onDragEvent.addEventListener((rate) => {
        //@ts-ignore
        this.layerOld.forEach((layer) => {
          layer.dtAEM.dtTilesSpliter.slideX = -rate;
        });
        this.layerNew.forEach((layer) => {
          layer.dtAEM.dtTilesSpliter.slideX = rate;
        });
      }); //@ts-ignore

      this.layerOld.forEach((layer) => {
        layer.dtAEM.dtTilesSpliter.slideX = -this.splitter.currentRate;
        layer.dtAEM.dtTilesSpliter.slideY = 1.0;
      });
      this.layerNew.forEach((layer) => {
        layer.dtAEM.dtTilesSpliter.slideX = this.splitter.currentRate;
        layer.dtAEM.dtTilesSpliter.slideY = 1.0;
      });
    }
  }

  compare_with_2viewer__() {
    //@ts-ignore
    this.layerOld.dtAEM.dtTilesSpliter.isActive = true; //@ts-ignore
    this.layerNew.dtAEM.dtTilesSpliter.isActive = true; //@ts-ignore
    this.layerOld.dtAEM.dtTilesSpliter.slideY = 0.35; //@ts-ignore
    this.layerNew.dtAEM.dtTilesSpliter.slideY = -0.35; //@ts-ignore
    this.layerOld.dtAEM.dtTilesSpliter.slideX = -0.3; //@ts-ignore
    this.layerNew.dtAEM.dtTilesSpliter.slideX = -0.3;
  }

  compare_with_2viewer() {
    DT3DTilesTransformer(this.layerOld, 0, 0, 6);
    DT3DTilesTransformer(this.layerNew, 0, 0, -10);
    //@ts-ignore
    this.layerOld.dtAEM.dtTilesSpliter.isActive = true; //@ts-ignore
    this.layerNew.dtAEM.dtTilesSpliter.isActive = true;

    // 激活分栏
    if (typeof this.splitter == 'undefined') {
      this.splitter = new DTViewerSpliter({
        viewer: DTScopeEngine.viewer,
      });
      this.splitter.onDragEvent.addEventListener((rate) => {
        //@ts-ignore
        this.layerOld.dtAEM.dtTilesSpliter.slideX = -rate; //@ts-ignore
        this.layerNew.dtAEM.dtTilesSpliter.slideX = -rate;
      }); //@ts-ignore
      this.layerOld.dtAEM.dtTilesSpliter.slideX = -this.splitter.currentRate; //@ts-ignore
      this.layerNew.dtAEM.dtTilesSpliter.slideX = -this.splitter.currentRate; //@ts-ignore
      this.layerOld.dtAEM.dtTilesSpliter.slideY = 0.5; //@ts-ignore
      this.layerNew.dtAEM.dtTilesSpliter.slideY = -0.5;
    }
  }

  compare_with_2viewer_() {
    DT3DTilesTransformer(this.layerOld, 0, 0, 15); //@ts-ignore
    this.layerOld.dtAEM.dtTilesSpliter.isActive = true; //@ts-ignore
    this.layerNew.dtAEM.dtTilesSpliter.isActive = true; //@ts-ignore
    this.layerOld.dtAEM.dtTilesSpliter.slideY = 0.35; //@ts-ignore
    this.layerNew.dtAEM.dtTilesSpliter.slideY = -0.35;
  }

  public static instance: CompareLayers;
  public layerNew: any[]; // 新图层
  public layerOld: any[]; // 旧图层
  public splitter: any;
}

/*
 * @Author: Lincong-pro
 * @Date: 2023-03-13 11:01:42
 * @LastEditors: Lincong-pro lincong_pro@163.com
 * @LastEditTime: 2024-05-07 14:26:09
 * @FilePath: \Geology-v3\src\utils\Common\Viewer.ts
 * @Description: 拆分Viewer创建类
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import * as Cesium from 'Cesium';
import { GetCameraPosition } from '@/utils/Common/CameraControl';
import AppConfig from '@/config/AppConfig';

//函数部分
export function DTScopeEngine(vueGlobalConfig) {
  DTScopeEngine.loading = true;
  if (vueGlobalConfig == null) {
    return;
  }
  // create Cesium Viewer
  // @ts-ignore
  let viewer = Cesium.DTGlobeViewer.createViewer(Cesium, 'cesiumContainer', false, {
    geocoder: false,
    useDefaultRenderLoop: false,
    targetFrameRate: 60,
    timeline: true, // 是否显示时间线控件
    animation: true, // 是否显示动画控件
    shouldAnimate: true,
    shadows: false,
    terrainShadows: Cesium.ShadowMode.DISABLED,
    contextOptions: {
      webgl: {
        preserveDrawingBuffer: true, // 启用Cesium缓冲区
        alpha: true,
        stencil: true,
        antialias: true,
        depth: true,
        powerPreference: 'high-performance', // 高性能
      },
    },
  });
  console.log('DTScopeEngine.viewer初始化');

  viewer.scene.globe.enableLighting = true;

  let appConfig = new AppConfig().appConfig;
  if (!appConfig.debugMode) {
    viewer.animation.container.style.visibility = 'hidden';
    viewer.timeline.container.style.visibility = 'hidden';
  }

  // adapter to company api
  DTScopeEngine.viewer = viewer;
  this._vueGlobalConfig = vueGlobalConfig;

  //config the global viewer
  if (Cesium.defined(viewer)) {
    // Configure viewer parameters
    viewer.enviromentBrightness = 1.2;
    viewer._cesiumWidget._creditContainer.style.display = 'none';
    // Smooth the earth edge
    viewer.scene.postProcessStages.fxaa.enabled = true;
    //@ts-ignore
    viewer._cesiumWidget._supportsImageRenderingPixelated = Cesium.FeatureDetection.supportsImageRenderingPixelated();
    viewer._cesiumWidget._forceResize = true;
    //@ts-ignore
    if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
      let vtxfDpr = window.devicePixelRatio;
      while (vtxfDpr >= 2.0) {
        vtxfDpr /= 2.0;
      }
      viewer.resolutionScale = vtxfDpr;
    }
    if (appConfig.openlayerControl) {
      //@ts-ignore
      new Cesium.DTLayerControl({ viewer });
    }
    if (appConfig.openFPS) {
      //@ts-ignore
      new Cesium.DTFPS(viewer);
    }
  } else {
    vueGlobalConfig.$Message({
      showClose: true,
      message: 'DTScope引擎初始化失败!',
      type: 'error',
    });
    throw new Cesium.DeveloperError('Init DTScope Engine Failed !');
  }

  if (appConfig.debugMode) {
    GetCameraPosition(viewer); // 右键可输出视角信息
  }

  // Init DTScene
  // this.loadClip.apply(this);
}

/**
 * 供js/ts进行调用
 * @returns {Cesium.Viewer}
 */
DTScopeEngine.viewer = undefined;

/**
 * 通过传入一个回调函数执行getViewer回调的过程
 * @param {function} callback
 */
DTScopeEngine.getViewer = (callback) => {
  let timerId = undefined;
  timerId = setTimeout(function monitor() {
    // ;
    if (typeof DTScopeEngine.viewer == 'undefined') {
      timerId = setTimeout(monitor, 300);
    } else {
      clearTimeout(timerId);
      callback();
    }
  }, 100);
};

// DTScopeEngine.get

// 是否仍然处于初始化引擎中
DTScopeEngine.loading = true;

// 静态属性
DTScopeEngine.instance = null;

/**
 * es5单例模式
 * @param {appContext.config.globalProperties} vueGlobalConfig
 * @returns { DTScopeEngine} instance
 */
DTScopeEngine.getInstance = (vueGlobalConfig) => {
  if (!DTScopeEngine.instance) {
    DTScopeEngine.instance = new DTScopeEngine(vueGlobalConfig);
  }

  return DTScopeEngine.instance;
};

DTScopeEngine.destroy = () => {
  DTScopeEngine.viewer.DTScene.destroyAllLayers(false);
  DTScopeEngine.viewer.destroy();
  DTScopeEngine.instance = null;
};

// /**
//  * @description: Load terrain clip
//  * @return {void}
//  */
// DTScopeEngine.prototype.loadClip = function () {
//   let viewer = DTScopeEngine.viewer;
//   let points = Cesium.Cartesian3.fromDegreesArrayHeights(DZInfo.ZDClipLine);
//   //@ts-ignore
//   let clipping = new Cesium.DTTerrainClippingPrimitive({
//     geometryInstances: new Cesium.GeometryInstance({
//       geometry: new Cesium.PolygonGeometry({
//         polygonHierarchy: new Cesium.PolygonHierarchy(points),
//       }),
//     }),
//     scene: viewer.scene, //必须添加此属性
//   });
//   //TODO set the global instance variable
//   // add the clipping terrain to globe
//   viewer.scene.primitives.add(clipping);
// };

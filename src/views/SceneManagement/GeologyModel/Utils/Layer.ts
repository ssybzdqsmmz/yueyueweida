/*
 * @Author: Lincong-pro
 * @Date: 2024-02-24 20:25:15
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-07-20 11:14:50
 * @FilePath: \Geology-v3\src\views\SceneManagement\GeologyModel\Utils\Layer.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import { v4 as uuidv4 } from 'uuid';
import { Viewer, KmlDataSource, UrlTemplateImageryProvider, WebMercatorTilingScheme, CesiumTerrainProvider } from 'Cesium';

function joinPath(prefix: string, latter: string) {
  return prefix + '/' + latter;
}

interface Viewport {
  destination: {
    x: number;
    y: number;
    z: number;
  };
  orientation: {
    heading: number;
    pitch: number;
    roll: number;
  };
}

interface CustomLayerDefine {
  name: string;
  type: number;
  visible: boolean;
  datastore: string;
  url: string;
  translation?: number[];
  displayView?: Viewport;
}

interface CustomModelLayerDefine extends CustomLayerDefine {
  modelType: number;
  isUnderground: boolean;
  brightness: number;
  scale: number[];
}

interface CustomTerrainLayerDefine extends CustomLayerDefine {
  lat: number;
  lon: number;
}

interface CustomImageLayerDefine extends CustomLayerDefine {
  lat: number;
  lon: number;
  maximumLevel: number;
  minimumLevel: number;
  extent: number[];
  tilingScheme: number;
  format: string;
  index: number;
}

/**
 * @description: 生成配置
 * @param {string} ipServer
 * @param {CustomModelLayerDefine} config
 * @return {*}
 */
function generateConfig<T>(ipServer, config: CustomLayerDefine) {
  return {
    ...config, // TODO 返回的json必须包含
    uid: uuidv4(),
    label: config.name,
    folderPath: config.datastore,
    property: 'private',
    url: joinPath(ipServer, config.url),
  };
}
/**
 * @description: 更新生成DTGlobe的配置文件
 * @param {string} ipServer
 * @param {string} sceneConfig
 * @return {*}
 */
function generateDTGlobeConfig(ipServer: string, sceneConfig: string | any[]) {
  const dtglobeCzml = [];
  let layerUids = [];

  let jsonConfig;
  if (typeof sceneConfig === 'string') {
    jsonConfig = JSON.parse(sceneConfig);
  } else {
    jsonConfig = sceneConfig;
  }
  jsonConfig.forEach((item, index) => {
    let layerConfig;
    if (index == 0) {
      dtglobeCzml.push(item); // 元数据信息
      return;
    }
    if (item.type == 0) {
      layerConfig = generateConfig<CustomImageLayerDefine>(ipServer, item);
    }
    if (item.type == 1) {
      layerConfig = generateConfig<CustomTerrainLayerDefine>(ipServer, item);
    }
    if (item.type == 2) {
      layerConfig = generateConfig<CustomModelLayerDefine>(ipServer, item);
    }
    dtglobeCzml.push(layerConfig);
    layerUids.push(layerConfig.uid);
  });

  return { dtglobeCzml, layerUids };
}
/**
 * @description: 丛配置文件中加载图层到DTGlobe
 * @param {Viewer} viewer
 * @param {string} sceneConfig
 * @return {*}
 */
function loadFromDTGlobeConfig(viewer: Viewer, sceneConfig: string | any[]) {
  let jsonConfig = [];
  if (typeof sceneConfig === 'string') {
    jsonConfig = JSON.parse(sceneConfig);
  } else {
    jsonConfig = sceneConfig;
  }

  let promises = [];

  jsonConfig.forEach((layerConfig, index) => {
    if (index == 0) {
      return;
    }
    let promise;
    if (layerConfig.type == 1) {
      //@ts-ignore
      promise = viewer.DTScene.loadLayer(layerConfig).then(() => {
        //@ts-ignore
        let layer = viewer.DTScene.getLayerByUId(layerConfig.uid);
      });
    } else {
      //@ts-ignore
      promise = viewer.DTScene.loadLayer(layerConfig);
    }

    promises.push(promise);
  });
  return Promise.all(promises);
}
/**
 * @description: 从配置文件中移除所有图层
 * @param {Viewer} viewer
 * @param {any} layerUids
 * @return {void}
 */
function removeFromDTGlobeConfig(viewer: Viewer, layerUids: any[]) {
  layerUids.map((layerUid) => {
    //@ts-ignore
    if (!viewer.DTScene.destroyLayerByUId(layerUid)) {
      console.warn('场景图层', layerUid, '清除失败');
    }
  });
}

/**
 * @description: 加载纯白底图
 * @param viewer
 * @return {void}
 */
function loadWorldOcean(viewer: Viewer) {
  //@ts-ignore
  let imgLayer = viewer.DTScene.createImagerLayer({
    name: 'baseImageLayer',
    label: 'World Ocean Base',
    url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer',
    // @ts-ignore
    serviceType: Cesium.DTIMAGELAYERSERVICETYPE.ARCGISIMAGESERVICE,
    format: 'image/jpeg',
    maximumLevel: '18',
    tileMatrixSetID: 'GoogleMapsCompatible',
    style: 'default',
    layer: 'BasicLayer',
    tilingScheme: 1,
    visible: true,
  });
  return () => {
    imgLayer.destroy();
  };
}

function loadGaodeMarker(viewer: Viewer) {
  //@ts-ignore
  let gaodeLabel = viewer.DTScene.createImagerLayer({
    name: 'GaoDeLabel',
    label: '高德地图注记',
    url: 'http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
    minimumLevel: 4,
    maximumLevel: 18, //@ts-ignore
    serviceType: Cesium.DTIMAGELAYERSERVICETYPE.TempURL,
    format: 'image/jpeg',
    tileMatrixSetID: 'GoogleMapsCompatible',
    style: 'default',
    layer: 'BasicLayer',
    tilingScheme: 1,
  });

  return () => {
    gaodeLabel.destroy();
  };
}

function loadOpenStreetMap(viewer: Viewer) {
  let layer = viewer.imageryLayers.addImageryProvider(
    new UrlTemplateImageryProvider({
      url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    })
  );
  layer.alpha = 0.8;
  layer.brightness = 1.0;
  return () => {
    viewer.imageryLayers.remove(layer, true);
  };
}

// kml图层的解析方式
/**
 * @description: 生成kml图层配置文件
 * @param {string} ipServer
 * @param {any} sceneConfig
 * @return {void}
 */
function generateKmlConfig(ipServer: string, sceneConfig: any[]) {
  let config = [];
  sceneConfig.forEach((kmlLayerConfig) => {
    config.push({
      ...kmlLayerConfig,
      url: joinPath(ipServer, kmlLayerConfig.url),
    });
  });
  return config;
}

function loadFromKmlConfig(viewer: Viewer, sceneConfig: any[]) {
  let dataSources = [];
  for (let i = 0; i < sceneConfig.length; i++) {
    let layerConfig = sceneConfig[i];
    requestIdleCallback(() => {
      KmlDataSource.load(layerConfig.url, {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true,
      }).then((dataSource) => {
        dataSource.name = layerConfig.name;
        dataSource.show = layerConfig.visible;

        viewer.dataSources.add(dataSource);
        dataSources.push(dataSource);
      });
    });
  }
  return () => {
    for (let i = 0; i < dataSources.length; i++) {
      viewer.dataSources.remove(dataSources[i], true);
    }
  };
}

function generateInsarConfig(ipServer, config) {
  if (!config[0].kml.startsWith('http://')) {
    config.forEach((item) => {
      item.kml = ipServer + '/' + item.kml;
    });
  }
}

function controlLayer(viewer: Viewer, layerName: string, status: boolean) {
  //@ts-ignore
  let dtScene = viewer.DTScene;
  dtScene.layers.forEach((layers) => {
    for (let j = 0; j < layers.values.length; ++j) {
      const layer = layers.values[j];
      if (layer._label == layerName) {
        layer.visible = status;
        return;
      }
    }
  });
}

export {
  generateDTGlobeConfig,
  loadFromDTGlobeConfig,
  loadFromKmlConfig,
  removeFromDTGlobeConfig,
  loadWorldOcean,
  generateKmlConfig,
  generateInsarConfig,
  controlLayer,
  loadGaodeMarker,
  loadOpenStreetMap,
};

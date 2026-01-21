/*
 * @Author: Lincong-pro
 * @Date: 2024-02-24 20:25:15
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-09 08:17:44
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnelOut\Utils\Layer.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import { v4 as uuidv4 } from 'uuid';
import { Viewer, UrlTemplateImageryProvider, WebMercatorTilingScheme, CesiumTerrainProvider } from 'Cesium';

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

/**
 * @description: 生成配置
 * @param {string} ipServer
 * @param {CustomModelLayerDefine} config
 * @return {*}
 */
function generateConfig<T>(ipServer, config: CustomLayerDefine) {
  return {
    ...config,
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
  let jsonConfig = Array.isArray(sceneConfig) ? sceneConfig : JSON.parse(sceneConfig as string);
  // 提前过滤掉第一个元素
  const validConfigs = jsonConfig.slice(1);

  const promises = validConfigs.map((layerConfig) => {
    if (layerConfig.type === 1) {
      //@ts-ignore
      return viewer.DTScene.loadLayer(layerConfig).then(() => {
        //@ts-ignore
        viewer.DTScene.getLayerByUId(layerConfig.uid);
      });
    }
    //@ts-ignore
    return viewer.DTScene.loadLayer(layerConfig);
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

export { generateDTGlobeConfig, loadFromDTGlobeConfig, removeFromDTGlobeConfig };

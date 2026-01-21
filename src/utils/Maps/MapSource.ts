/*
 * @Author: 枫林残忆 2997534654@qq.com
 * @Date: 2024-04-09 07:25:00
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-23 11:07:43
 * @FilePath: \Geology-v3\src\utils\Maps\MapSource.ts
 * @Description: 封装所有的map加载方法
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 *
 */
import Cesium from 'Cesium';
import AppConfig, { AppConfigInterface } from '@/config/AppConfig';

const IonWorldImageryStyle = {
  /**
   * Aerial imagery.
   *
   * @type {number}
   * @constant
   */
  AERIAL: 2,

  /**
   * Aerial imagery with a road overlay.
   *
   * @type {number}
   * @constant
   */
  AERIAL_WITH_LABELS: 3,

  /**
   * Roads without additional imagery.
   *
   * @type {number}
   * @constant
   */
  ROAD: 4,
};

/**
 * @description: 谷歌地图-已失效
 * @param {Cesium} viewer
 * @return {void}
 */
function loadGoogleMap(viewer: Cesium.Viewer) {
  return viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}',
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      minimumLevel: 0,
      maximumLevel: 20,
    })
  );
}

function loadArcGIS(viewer: Cesium.Viewer) {
  const esri = new Cesium.ArcGisMapServerImageryProvider({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
  });
  return viewer.imageryLayers.addImageryProvider(esri);
}

function loadTdT(viewer: Cesium.Viewer, appConfig: AppConfigInterface) {
  //@ts-ignore
  return viewer.DTScene.createImagerLayer({
    name: 'baseImageLayer',
    label: '基础影像',
    url:
      'https://t0.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
      appConfig.tdtToken,
    //@ts-ignore
    serviceType: Cesium.DTIMAGELAYERSERVICETYPE.WMTS,
    format: 'image/jpeg',
    maximumLevel: '18',
    tileMatrixSetID: 'GoogleMapsCompatible',
    style: 'default',
    layer: 'BasicLayer',
    tilingScheme: 1,
  });
}

function loadBingMap(viewer: Cesium.Viewer, appConfig: AppConfigInterface, option: number) {
  //@ts-ignore
  return viewer.imageryLayers.addImageryProvider(
    new Cesium.IonImageryProvider({
      assetId: option,
      accessToken: appConfig.ionToken,
      server: 'https://api.cesium.com',
    })
  );
}

function loadBingMapAerial(viewer: Cesium.Viewer, appConfig: AppConfigInterface) {
  return loadBingMap(viewer, appConfig, IonWorldImageryStyle.AERIAL);
}

function loadWCB(viewer: Cesium.Viewer) {
  //@ts-ignore
  return viewer.DTScene.createImagerLayer({
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
}

function loadBingMapAerialWithLabel(viewer: Cesium.Viewer, appConfig: AppConfigInterface) {
  return loadBingMap(viewer, appConfig, IonWorldImageryStyle.AERIAL_WITH_LABELS);
}

function loadRoad(viewer: Cesium.Viewer, appConfig: AppConfigInterface) {
  return loadBingMap(viewer, appConfig, IonWorldImageryStyle.ROAD);
}

function loadMap(viewer: Cesium.Viewer) {
  let appConfig = new AppConfig().appConfig;
  type noTokenCallback = (viewer: Cesium.Viewer) => Cesium.ImageryLayer;
  type tokenCallback = (viewer: Cesium.Viewer, appConfig: AppConfigInterface) => Cesium.ImageryLayer;

  const providerMap = new Map([
    ['ArcGIS Map', loadArcGIS],
    ['Google Map', loadGoogleMap],
    ['Tianditu Map', loadTdT],
    ['Bing Map', loadBingMapAerial],
    // ['Bing Label Map', loadBingMapAerialWithLabel],
    // ['Road Map', loadRoad]
  ]);
  let notTokenMaps = ['ArcGIS Map', 'Google Map']; // 不需要token的地图

  let key = appConfig.mapProvider.trim();
  let loadCallback = providerMap.get(key);

  let layer;
  if (notTokenMaps.includes(key)) {
    layer = (<noTokenCallback>loadCallback)(viewer);
  } else {
    layer = (<tokenCallback>loadCallback)(viewer, appConfig);
  }
  return () => {
    // viewer.imageryLayers.remove(layer, true)
  };
}

export { loadMap };

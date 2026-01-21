/*
 * @Author: 枫林残忆
 * @Date: 2024-03-01 14:33:23
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-07-11 11:06:29
 * @FilePath: \Geology-v3\src\views\SceneManagement\GeologyModel\Services\InitScene.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import {
  GeoJsonDataSource,
  Viewer,
  PolylineOutlineMaterialProperty,
  Color,
  KmlDataSource,
  Cartesian3,
  GeometryInstance,
  PolygonGeometry,
  PolygonHierarchy, //@ts-ignore
  DTTerrainClippingPrimitive,
} from 'Cesium';

/**
 * @description: 加载黄色中心线路
 * @param {Viewer} viewer
 * @param {string} ipServer
 * @param {string} url
 * @return {*}
 */
function loadCenterLine(viewer: Viewer, ipServer: string, url: string) {
  let _dataSource;
  GeoJsonDataSource.load(ipServer + '/' + url, { clampToGround: true }).then((dataSource) => {
    _dataSource = dataSource;
    viewer.dataSources.add(dataSource);
    dataSource.show = true;
    dataSource.name = 'centerLine';

    // 样式设置
    let entities = dataSource.entities.values;
    entities.forEach((entity) => {
      entity.polyline.width = 16;
      entity.polyline.material = new PolylineOutlineMaterialProperty({
        //@ts-ignore
        color: Color.ORANGE, //@ts-ignore
        outlineWidth: 4, //@ts-ignore
        outlineColor: Color.BLACK,
      });
    });

    return dataSource;
  });

  return () => {
    viewer.dataSources.remove(_dataSource, true);
  };
}
/**
 * @description: 加载裁剪面
 * @param {Viewer} viewer
 * @param clippingData 裁剪数据
 * @return {*}
 */
function loadClip(viewer: Viewer, clippingData: any[]) {
  // @ts-ignore
  const clipping = new DTTerrainClippingPrimitive({
    geometryInstances: new GeometryInstance({
      geometry: new PolygonGeometry({
        polygonHierarchy: new PolygonHierarchy(clippingData),
      }),
    }),
    scene: viewer.scene, // 必须添加此属性
  });
  // TODO set the global instance variable
  // add the clipping terrain to globe
  viewer.scene.primitives.add(clipping);

  return () => {
    viewer.scene.primitives.remove(clipping);
    clipping.destroy();
  };
}

/**
 * @description: 从配置文件中加载kml数据
 * @param {*} viewer
 * @param {*} sceneConfig
 * @return {*}
 */
function loadKml(viewer, sceneConfig) {
  let dataSources = [];
  for (let i = 0; i < sceneConfig.length; i++) {
    let layerConfig = sceneConfig[i];
    try {
      KmlDataSource.load(layerConfig.url, {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true,
      }).then((dataSource) => {
        dataSource.name = layerConfig.name;
        dataSource.show = true;

        viewer.dataSources.add(dataSource);
        dataSources.push(dataSource);
      });
    } catch (e) {
      console.warn(e);
    }
  }
  return () => {
    dataSources.forEach((dataSource) => {
      viewer.dataSources.remove(dataSource, true);
    });
  };
}

export { loadCenterLine, loadClip, loadKml };

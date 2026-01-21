/*
 * @Author: Lincong-pro
 * @Date: 2024-02-27 11:11:57
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-20 09:13:20
 * @FilePath: \Geology-V3\src\views\SceneManagement\DaduRiver\Services\DisasterLayer.ts
 * @Description:控制地灾场景
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import { Viewer, GeoJsonDataSource, Color, DataSource } from 'Cesium'; //@ts-ignore

/**
 * @description: 加载geojson数据
 * @param {Viewer} viewer
 * @param {string} url
 * @param {Color} color
 * @return {DataSource}
 */
function loadGeojson(viewer: Viewer, url: string, color: Color) {
  return viewer.dataSources.add(
    GeoJsonDataSource.load(url, {
      fill: color,
      clampToGround: true,
    })
  );
}

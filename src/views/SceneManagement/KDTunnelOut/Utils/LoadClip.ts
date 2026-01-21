/*
 * @Author: anganao 1928882425@qq.com
 * @Date: 2024-04-13 10:16:36
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-23 14:22:16
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnelOut\Utils\LoadClip.ts
 * @Description:
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 *
 */
import line from './clip';
import { Cartesian3, GeometryInstance, PolygonGeometry, PolygonHierarchy } from 'Cesium';
function loadClip(viewer) {
  let points = Cartesian3.fromDegreesArrayHeights(line);
  //@ts-ignore
  let clipPrimitive = new DTTerrainClippingPrimitive({
    geometryInstances: new GeometryInstance({
      geometry: new PolygonGeometry({
        polygonHierarchy: new PolygonHierarchy(points),
      }),
    }),
    scene: viewer.scene, //必须添加此属性
  });
  viewer.scene.primitives.add(clipPrimitive);
  return clipPrimitive;
}
function removeClip(viewer, clipPrimitive) {
  if (clipPrimitive !== undefined && clipPrimitive !== null) {
    viewer.scene.primitives.remove(clipPrimitive);
  }
}
export { loadClip, removeClip };

/*
 * @Author: anganao 1928882425@qq.com
 * @Date: 2024-04-13 10:16:36
 * @LastEditors: Lincong-pro lincong_pro@163.com
 * @LastEditTime: 2024-05-06 12:59:33
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnel\Utils\LoadClip.ts
 * @Description: 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * 
 */
import { DZInfo } from "./GlobeInfo";
import * as Cesium from "Cesium";
function loadClip(viewer) {
	let points = Cesium.Cartesian3.fromDegreesArrayHeights(
		DZInfo.ZDClipLine
	);
	//@ts-ignore
	let clipPrimitive = new Cesium.DTTerrainClippingPrimitive({
		geometryInstances: new Cesium.GeometryInstance({
			geometry: new Cesium.PolygonGeometry({
				polygonHierarchy: new Cesium.PolygonHierarchy(points),
			}),
		}),
		scene: viewer.scene, //必须添加此属性
	});
	viewer.scene.primitives.add(clipPrimitive);
	return clipPrimitive
};
function removeClip(viewer, clipPrimitive) {
	if (clipPrimitive !== undefined && clipPrimitive !== null) {
		viewer.scene.primitives.remove(clipPrimitive);
	}
}
export {
	loadClip,
	removeClip
}
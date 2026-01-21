/*
 * @Author: 枫林残忆
 * @Date: 2024-03-01 14:33:23
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-12-04 15:10:13
 * @FilePath: \Geology-v3\src\views\SceneManagement\FullLine\Services\InitScene.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import {
  GeoJsonDataSource,
  Viewer,
  StripeMaterialProperty,
  PolylineOutlineMaterialProperty,
  DistanceDisplayCondition,
  StripeOrientation,
  Color,
  KmlDataSource,
  Cartesian3,
  GeometryInstance,
  PolygonGeometry,
  PolygonHierarchy, //@ts-ignore
  DTTerrainClippingPrimitive,
} from 'Cesium';
import lineData from '../Config/CZ0327.json';
import * as turf from '@turf/turf';

/**
 * @description: 加载黑白相间的中心线路
 * @param {Viewer} viewer
 * @param {string} ipServer
 * @param {string} url
 * @return {*}
 */

// 加载黑白相间的中心线路
// function loadCenterLine(viewer: Viewer) {
// 	let _dataSource;

// 	let line1 = lineData.features[1].geometry.coordinates;
// 	let line2ALl = lineData.features[0].geometry.coordinates;
// 	let line2 = [];
// 	line2ALl.forEach((element) => {
// 		element.forEach((e) => {
// 			line2.push(e);
// 		});
// 	});
// 	let line1Turf = turf.lineString(line1);
// 	let line2Turf = turf.lineString(line2);
// 	let length1 = turf.length(line1Turf, { units: 'miles' });
// 	let length2 = turf.length(line2Turf, { units: 'miles' });

// 	// 定义步长
// 	const step = 18;

// 	// 初始化一个数组来存储结果
// 	let multiples1 = [];

// 	let multiples2 = [];

// 	let linedata1 = [];
// 	let linedata2 = [];

// 	// 使用for循环从0开始，每次增加步长step，直到超过上限
// 	for (let i = 0; i <= length1; i += step) {
// 		multiples1.push(i);
// 	}
// 	multiples1.push(length1);
// 	for (let i = 0; i <= length2; i += step) {
// 		multiples2.push(i);
// 	}
// 	multiples2.push(length2);

// 	let railwayLine1 = [];
// 	let railwayLine2 = [];
// 	let height = 1000;

// 	for (let index = 0; index < multiples1.length - 1; index++) {
// 		let element0 = multiples1[index];
// 		let element1 = multiples1[index + 1];
// 		const sliced = turf.lineSliceAlong(line1Turf, element0, element1, {
// 			units: 'miles',
// 		});
// 		let addHeight = [];
// 		sliced.geometry.coordinates.forEach((element) => {
// 			addHeight.push(element[0], element[1], height);
// 		});
// 		railwayLine1.push(addHeight);
// 	}
// 	for (let index = 0; index < multiples2.length - 1; index++) {
// 		let element0 = multiples2[index];
// 		let element1 = multiples2[index + 1];
// 		let sliced = turf.lineSliceAlong(line2Turf, element0, element1, {
// 			units: 'miles',
// 		});
// 		let addHeight = [];
// 		sliced.geometry.coordinates.forEach((element) => {
// 			addHeight.push(element[0], element[1], height);
// 		});
// 		railwayLine2.push(addHeight);
// 	}
// 	for (let index = 0; index < railwayLine1.length; index++) {
// 		if (index % 2 == 0) {
// 			viewer.entities.add({
// 				polyline: {
// 					// @ts-ignore
// 					positions: Cesium.Cartesian3.fromDegreesArrayHeights(railwayLine1[index]),
// 					width: 10,
// 					// @ts-ignore
// 					material: Cesium.Color.WHITE,
// 				},
// 			});
// 		} else {
// 			viewer.entities.add({
// 				polyline: {
// 					// @ts-ignore
// 					positions: Cesium.Cartesian3.fromDegreesArrayHeights(railwayLine1[index]),
// 					width: 10,
// 					// @ts-ignore
// 					material: Cesium.Color.BLACK,
// 				},
// 			});
// 		}
// 	}

// 	for (let index = 0; index < railwayLine2.length; index++) {
// 		if (index % 2 == 0) {
// 			viewer.entities.add({
// 				polyline: {
// 					// @ts-ignore
// 					positions: Cesium.Cartesian3.fromDegreesArrayHeights(railwayLine2[index]),
// 					width: 10,
// 					// @ts-ignore
// 					material: Cesium.Color.WHITE,
// 				},
// 			});
// 		} else {
// 			viewer.entities.add({
// 				polyline: {
// 					// @ts-ignore
// 					positions: Cesium.Cartesian3.fromDegreesArrayHeights(railwayLine2[index]),
// 					width: 10,
// 					// @ts-ignore
// 					material: Cesium.Color.BLACK,
// 				},
// 			});
// 		}
// 	}
// 	return () => {
// 		viewer.entities.removeAll();
// 	};
// }

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

export { loadClip, loadKml };

/*
 * @Author: Lincong-pro
 * @Date: 2024-02-25 15:47:09
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2024-02-25 17:07:19
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnel\Services\Label.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import { Viewer, ScreenSpaceEventHandler, Cartesian3, GeometryInstance, PolygonGeometry, PolygonHierarchy } from 'Cesium';
import scenesBuilding from '../Assets/scenes-building.json';
import { ScenesContainer } from '../Utils/ScenesContainer';
import RoamControl from '../Utils/Roaming';

/**
 * @description: 加载Building的标签
 * @param viewer
 * @return {buildingctner} 让用户关闭标签
 */
async function loadBLabel(viewer: Viewer) {
  let buildingctner = new ScenesContainer({
    handler: new ScreenSpaceEventHandler(viewer.canvas),
    type: ScenesContainer.LabelType.Custom,
    jsonData: scenesBuilding,
    scenes: [],
  });

  buildingctner.initialize();
  await buildingctner.create(viewer);
  buildingctner.activate(viewer, 0);
  return Promise.resolve(buildingctner);
}

const clippingAreaMaping = new Map([
  [
    '12Ju',
    [
      101.8780173, 29.9930645, 3267.16, 101.8792882, 29.9937276, 3204.25, 101.8811336, 29.99303, 3210.96, 101.8878452, 29.9929649, 3194.1, 101.887532,
      29.989903, 3199.45, 101.8784218, 29.9908171, 3211.6,
    ],
  ],
  [
    '18Ju',
    [
      101.778577, 30.0360071, 3556.6, 101.7864728, 30.0321497, 3470.37, 101.7908095, 30.0300559, 3468.31, 101.7944573, 30.0282611, 3455.49,
      101.8147485, 30.0183258, 3385.86, 101.8274632, 30.0121154, 3343.86, 101.8432057, 30.0044189, 3299.06, 101.850831, 30.0006779, 3285.78,
      101.8524338, 29.9999358, 3293.72, 101.85941, 29.9973628, 3283.61, 101.8640209, 29.995663, 3272.32, 101.8682741, 29.9945453, 3254.13, 101.87295,
      29.9933564, 3208.95, 101.8788558, 29.992398, 3177.48,
    ],
  ],
]);

const roamingAreaMapping = new Map([
  [
    '12Ju',
    [
      {
        //最后一帧
        ViewPoint: {
          Orientation: {
            heading: 2.974484733883829,
            pitch: -0.4659910714851403,
            roll: 0.0005397659641896979,
          },
          Position: {
            longitude: 101.8789515,
            latitude: 29.9945247,
            height: 3362.4773616,
          },
        },
        duration: 5,
      },
      {
        // 第一帧
        ViewPoint: {
          Orientation: {
            heading: 4.880451542144375,
            pitch: -0.4476783782242997,
            roll: 6.280009501716258,
          },
          Position: {
            longitude: 101.8899426,
            latitude: 29.9910029,
            height: 3368.7515628,
          },
        },
        duration: 5,
      },
      {
        // 第二帧
        ViewPoint: {
          Orientation: {
            heading: 4.798684069296415,
            pitch: -0.3133980067183122,
            roll: 6.280144654015714,
          },
          Position: {
            longitude: 101.886137,
            latitude: 29.9916445,
            height: 3349.7013812,
          },
        },
        duration: 5,
      },
      {
        // 第san帧
        ViewPoint: {
          Orientation: {
            heading: 4.810399335132221,
            pitch: -0.25846259713764796,
            roll: 6.280196610170911,
          },
          Position: {
            longitude: 101.8826854,
            latitude: 29.9920588,
            height: 3300.1210668,
          },
        },
        duration: 5,
      },
      {
        // 第san帧
        ViewPoint: {
          Orientation: {
            heading: 4.150096185288552,
            pitch: -0.26456639504131685,
            roll: 6.280641598094899,
          },
          Position: {
            longitude: 101.8817894,
            latitude: 29.993517,
            height: 3301.7528409,
          },
        },
        duration: 5,
      },
    ],
  ],
]);

/**
 * @description: Load terrain clip
 * @param viewer
 * @param clippingArea
 * @return {void}
 */
function loadClip(viewer: Viewer, clippingArea: string) {
  let points = Cartesian3.fromDegreesArrayHeights(clippingAreaMaping.get(clippingArea));
  //@ts-ignore
  let clipping = new Cesium.DTTerrainClippingPrimitive({
    geometryInstances: new GeometryInstance({
      geometry: new PolygonGeometry({
        polygonHierarchy: new PolygonHierarchy(points),
      }),
    }),
    scene: viewer.scene, //必须添加此属性
  });
  //TODO set the global instance variable
  // add the clipping terrain to globe
  viewer.scene.primitives.add(clipping);
}

/**
 * @description: 实现漫游
 * @param {Viewer} viewer
 * @param {string} location
 * @return {void}
 */
function loadTunnelRoaming(viewer: Viewer, location: string) {
  let roam: RoamControl = RoamControl.getInstance(viewer);
  roam.setPlayNextStage(() => {
    return;
  });
  roam.startMapRoam(roamingAreaMapping.get(location));
}

export { loadBLabel, loadClip, loadTunnelRoaming };

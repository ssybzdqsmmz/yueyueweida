/*
 * File: TerrainFlatten.js
 * Project: kd
 * File Created: Friday, 26th March 2021 10:44:57 am
 * Author: WouRaoyu
 * Last Modified: Friday, 26th March 2021 12:02:59 pm
 * Modified By: WouRaoyu
 * Copyright 2021 vge lab
 */

import * as Cesium from 'Cesium';
import * as turf from 'turf';

const line = [
  101.7005378, 30.0877162, 3732.37, 101.7017888, 30.0872996, 3732.8, 101.7030479, 30.0868607, 3733.08, 101.7042671, 30.0863915, 3733.45, 101.7054372,
  30.0858758, 3735.36, 101.7066241, 30.0853419, 3733.99, 101.7077555, 30.0847703, 3734.04, 101.7088737, 30.0841127, 3735.61, 101.7099836, 30.0834478,
  3736.01, 101.7110524, 30.0827676, 3735.62, 101.7121341, 30.0819846, 3736.3, 101.7131746, 30.0811949, 3736.38, 101.7141991, 30.0803503, 3735.45,
  101.7151992, 30.0794428, 3733.87, 101.716223, 30.0784504, 3731.98, 101.7172223, 30.0774094, 3730.08, 101.7181877, 30.0762921, 3727.34, 101.7191622,
  30.0750801, 3723.26, 101.7201081, 30.0738, 3719.15, 101.7210874, 30.0724859, 3714.83, 101.7220919, 30.0711606, 3710.46, 101.723133, 30.0698591,
  3705.4, 101.72423, 30.0685541, 3699.94, 101.7253569, 30.0673099, 3694.88, 101.7264819, 30.0661039, 3689.3, 101.7276812, 30.064925, 3684.58,
  101.7289046, 30.0637383, 3679.26, 101.7301753, 30.0625741, 3673.75, 101.731467, 30.061452, 3668.45, 101.7328045, 30.060347, 3663.05, 101.7342123,
  30.0592447, 3657.88, 101.735626, 30.058191, 3652.24, 101.7370805, 30.0571605, 3646.69, 101.7385926, 30.0561641, 3641.37, 101.7401652, 30.0551738,
  3635.75, 101.7417619, 30.0541821, 3629.22, 101.7434097, 30.0532985, 3624.43, 101.745091, 30.0523906, 3618.74, 101.7468044, 30.0515348, 3613.01,
  101.7485715, 30.050685, 3607.15, 101.7503495, 30.0498003, 3601.3, 101.7521272, 30.0489291, 3596.19, 101.7539776, 30.0480322, 3589.67, 101.7559024,
  30.0470692, 3582.77, 101.7577949, 30.0461589, 3577.31, 101.7597506, 30.0452067, 3571.34, 101.7616969, 30.0442682, 3565.2, 101.7637561, 30.0432483,
  3558.56, 101.7657587, 30.0422714, 3551.42, 101.7678089, 30.0412988, 3544.9, 101.7699138, 30.0402621, 3538.06, 101.7720461, 30.0392109, 3530.73,
  101.7741884, 30.0381721, 3523.57, 101.7763718, 30.0371153, 3516.51, 101.778577, 30.0360071, 3556.6, 101.7864728, 30.0321497, 3470.37, 101.7908095,
  30.0300559, 3468.31, 101.7944573, 30.0282611, 3455.49, 101.8147485, 30.0183258, 3385.86, 101.8274632, 30.0121154, 3343.86, 101.8432057, 30.0044189,
  3299.06, 101.850831, 30.0006779, 3285.78, 101.8524338, 29.9999358, 3293.72, 101.85941, 29.9973628, 3283.61, 101.8640209, 29.995663, 3272.32,
  101.8682741, 29.9945453, 3254.13, 101.87295, 29.9933564, 3208.95, 101.8788558, 29.992398, 3177.48,
];

function ClippingPolygon(viewer, points) {
  let primitive = new Cesium.DTTerrainClippingPrimitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(points),
      }),
    }),
    scene: viewer.scene, //必须添加此属性
  });
  return viewer.scene.primitives.add(primitive);
}

function Draw3dPolygonOpen(viewer, entityId, pnts, height, material) {
  if (pnts.length < 3) {
    return;
  }
  let polygon = viewer.entities.add({
    id: entityId,
    polygon: {
      hierarchy: pnts,
      extrudedHeight: height,
      perPositionHeight: true,
      material: material,
      closeTop: false,
      closeBottom: true,
    },
  });
  return polygon;
}

function Resample(positions, sampling) {
  let resamplePoints = new Array(); // 重采样导出点
  for (let i = 0; i < positions.length - 1; ++i) {
    let p1 = new Cesium.Cartographic.fromCartesian(positions[i]),
      p2 = new Cesium.Cartographic.fromCartesian(positions[i + 1]); // 获取经纬度坐标系
    let geodesic = new Cesium.EllipsoidGeodesic(p1, p2); // 线段球面距离
    let d = geodesic.surfaceDistance;
    let k = Math.floor(d / sampling); // 重采样点的个数-1(除去起点)
    for (let j = 0; j <= k; ++j) {
      let p = geodesic.interpolateUsingSurfaceDistance(sampling * j);
      resamplePoints.push(p);
    }
  }
  return resamplePoints;
}

function ExtendPolyLine(viewer, lineString) {
  // var offsetLine = turf.lineOffset(lineString, 0.075);
  let buffered = turf.buffer(lineString, 0.005);
  return Turf2Cartesian(viewer, buffered);
}

// 将二维turf多边形重采样为三维
function Turf2Cartesian(viewer, polygonTurf) {
  let pntsTurf2d = polygonTurf.geometry.coordinates[0];
  let pntsCartesian3d = new Array();
  pntsTurf2d.forEach((pnt) => {
    let pntCartographic = Cesium.Cartographic.fromRadians(pnt[0], pnt[1]);
    pntCartographic.height = viewer.scene.globe.getHeight(pntCartographic);
    pntsCartesian3d.push(Cesium.Cartographic.toCartesian(pntCartographic));
  });
  return pntsCartesian3d;
}

function llHArray2Turf(array) {
  let arytmp = new Array();
  for (let i = 0; i < array.length; i += 3) {
    arytmp.push([array[i] / 57.295779513082, array[i + 1] / 57.295779513082]);
  }
  let pln = turf.lineString(arytmp);
  return pln;
}

class TerrainFlatten {
  constructor(options) {
    this._viewer = options.viewer;
    this._points = options.points;
    this._length = options.length;
    this._height = options.height;
    // this._url = options.url;
    this._clipping = undefined;
    this._extrusion = undefined;
  }

  generate() {
    let linestring = llHArray2Turf(line);
    return ExtendPolyLine(this._viewer, linestring);
  }

  activate() {
    let that = this;
    this._clipping = ClippingPolygon(this._viewer, this._points);
    let terrainProvider = this._viewer.terrainProvider; //new Cesium.CesiumTerrainProvider({ url: this._url });
    let resamples = Resample(this._points, this._length);
    let promise = Cesium.sampleTerrainMostDetailed(terrainProvider, resamples); // 弧度
    Cesium.when(promise, function (updatedPositions) {
      let pnts_cartesian = new Array();
      updatedPositions.forEach((element) => {
        pnts_cartesian.push(Cesium.Cartographic.toCartesian(element));
      });
      let dynamicHeight = new Cesium.CallbackProperty(function () {
        return that._height;
      }, false);

      that._extrusion = Draw3dPolygonOpen(that._viewer, Cesium.createGuid(), pnts_cartesian, dynamicHeight, Cesium.Color.DIMGREY);
    });
  }

  /**
   * 移除 polygon
   */
  destory() {
    if (this._clipping) {
      this._viewer.scene.primitives.remove(this._clipping);
    }
    if (this._extrusion) {
      this._viewer.entities.remove(this._extrusion);
    }
    this._clipping = undefined;
    this._extrusion = undefined;
  }
}

export default TerrainFlatten;

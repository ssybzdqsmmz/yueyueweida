import { cartesian3ToCartographic, cartographicToCartesian3 } from '../Common/Transform';
import { DTScopeEngine } from '../Common/Viewer';

import {
  Cartesian3,
  CallbackProperty,
  ImageMaterialProperty,
  sampleTerrainMostDetailed,
  when,
  GeometryInstance,
  PolygonGeometry,
  PolygonHierarchy,
  EllipsoidGeodesic,
  //@ts-ignore
  DTTerrainClippingPrimitive,
} from 'Cesium';

// 标注的图像
import markPNG from '@/assets/materials/marble.jpg';

/**
 * @description: 实现地形的动态开挖
 * @param { Cartesian3[] } positions 三维笛卡尔
 * @param { number } sampling 采样点间距
 * @param { number } height 初始开挖高度
 * @return {void}
 */
export function TerrainExcavate(positions: Cartesian3[], sampling: number, height: number): void {
  //* properties
  this._clipping = undefined;
  this._extrusionId = undefined;
  this._height = height;
  this._pointIds = [];
  // generate the terrain polygon primitive
  let viewer = DTScopeEngine.viewer;
  //! Terrain Clipping
  this.clipping(positions);
  //! resample the points on every edge to fit the arc line
  const resamplePoints = this.resample(positions, sampling);
  //! 地形采样(弧度)
  const promise = sampleTerrainMostDetailed(viewer.terrainProvider, resamplePoints);
  // define polygon material
  const imageMaterial = new ImageMaterialProperty({
    //@ts-ignore
    image: markPNG,
    //@ts-ignore
    transparent: true,
  });
  // updatedPositions 查询结果
  when(promise, (updatedPositions) => {
    let pnts = [];
    updatedPositions.forEach((point) => {
      pnts.push(cartographicToCartesian3(point));
    });
    // dynamic change of excavation height
    let dynamicHeight = new CallbackProperty(() => {
      return this._height;
    }, false);
    //TODO excavate the terrain[替换侧面和底部的材质]
    // this.excavate(pnts, dynamicHeight, Cesium.Color.DIMGREY);
    this.excavate(pnts, dynamicHeight, imageMaterial);
  }).otherwise((err) => {
    console.log('------------------------------------debug---------------------------------------', err);
  });
}
//* ///////////////////////////////////////////////// 暴露用于实现蓝图参数接口 //////////////////////////////////////////////////////////

/**
 * @description: 动态改变开挖高度
 * @param {number} height ->改变内置变量，进而实现 CallbackProperty 改变
 * @return {void}
 */
TerrainExcavate.prototype.setHeight = function (height: number) {
  this._height = height;
};

//TODO 纹理接口，后续进行实现

//* ///////////////////////////////////////////////// 一些辅助函数用于实现绘制 //////////////////////////////////////////////////////////
/**
 * @description: step1 地形裁剪
 * @param {*} positions 笛卡尔坐标
 * @return {void}
 */
TerrainExcavate.prototype.clipping = function (positions) {
  let viewer = DTScopeEngine.viewer;
  let primitive = new DTTerrainClippingPrimitive({
    geometryInstances: new GeometryInstance({
      geometry: new PolygonGeometry({
        polygonHierarchy: new PolygonHierarchy(positions),
      }),
    }),
    scene: viewer.scene, //必须添加此属性
  });
  // add primitive to viewer
  viewer.scene.primitives.add(primitive);
  this._clipping = primitive;
};

/**
 * @description: step2 地形表面裁剪区域采样
 * @param {*} positions 笛卡尔坐标
 * @param { number } sampling 采样点间距
 * @return {void}
 */
TerrainExcavate.prototype.resample = function (positions, sampling) {
  let p1 = undefined;
  let resamplePoints = [];
  let p2 = cartesian3ToCartographic(positions[0]);
  for (let i = 0; i < positions.length - 1; i++) {
    p1 = p2;
    p2 = cartesian3ToCartographic(positions[i + 1]);
    // 测地线
    let geodesic = new EllipsoidGeodesic(p1, p2);
    let distance = geodesic.surfaceDistance;
    let k = Math.floor(distance / sampling); // number of sampled paragraphs
    for (let j = 0; j <= k; j++) {
      let p = geodesic.interpolateUsingSurfaceDistance(j * sampling);
      resamplePoints.push(p);
    }
  }
  return resamplePoints;
};

/**
 * @description: 绘制多边形立方体
 * @param {Cartesian3} positions 笛卡尔坐标
 * @param {number} height
 * @param {*} material 自定义材质
 * @return {void}
 */
TerrainExcavate.prototype.excavate = function (positions, height, material) {
  let viewer = DTScopeEngine.viewer;
  if (positions.length < 3) {
    return;
  }
  this._extrusionId = viewer.entities.add({
    polygon: {
      hierarchy: positions,
      extrudedHeight: height,
      perPositionHeight: true,
      material: material,
      closeTop: false, // open top
      closeBottom: true,
    },
  }).id;
};

/**
 * @description: 绑定对应的采样点【AOC控制反转】
 * @param {number} entityIds
 * @return {void}
 */
TerrainExcavate.prototype.bindSampleIds = function (entityIds: number[]) {
  this._pointIds = entityIds;
};

/**
 * @description: 清空开挖的地形
 * @return {void}
 */
TerrainExcavate.prototype.destroy = function () {
  let viewer = DTScopeEngine.viewer;
  // remove the sample points
  this._pointIds.forEach((id) => {
    viewer.entities.removeById(id);
  });

  // remove the extrusion
  if (typeof this._extrusionId != 'undefined') {
    viewer.entities.removeById(this._extrusionId);
  }

  // remove clipping primitive according to the index
  if (this._clipping != undefined) {
    viewer.scene.primitives.remove(this._clipping);
  }

  this._extrusionId = undefined;
  this._clipping = undefined;
  this._pointIds = [];
};

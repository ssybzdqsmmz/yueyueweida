/*
 * @Author: Lincong-pro
 * @Date: 2023-11-04 19:55:39
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2024-02-25 21:47:15
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnel\Shader\Property.ts
 * @Description: volume相关的调节参数
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import { Resource, Quaternion, Matrix4, Cartesian3, Transforms } from 'Cesium';

export default class Property {
  /**
   * @description: 从json文件中初始化Property
   * @param {string} jsonPath
   * @return {*}
   */

  static async initFromFile(jsonPath: string, image: any) {
    const data = await Resource.fetchJson({ url: jsonPath });
    let property = new Property();

    property.rotate = data.rotate;
    property.scale = data.scale;
    property.center = data.center;
    property.resolution = data.resolution;

    property.slices = [image.width / property.resolution[0], image.height / property.resolution[1]];

    property.colours = data.colours;

    return property;
  }

  /**
   * @description: 返回模型坐标系下的变换矩阵
   * @return {*}
   */

  getScaleRotateENUMat() {
    const rotationQuaternion = new Quaternion(this.rotate[0], this.rotate[1], this.rotate[2], this.rotate[3]);

    //Divide all by the highest resolution
    let maxn = Math.max.apply(null, this.resolution);
    this.scale = [
      (this.resolution[0] / maxn) * this.scale[0],
      (this.resolution[1] / maxn) * this.scale[1],
      (this.resolution[2] / maxn) * this.scale[2],
    ];

    const rotationMat4 = Matrix4.fromTranslationQuaternionRotationScale(
      new Cartesian3(0, 0, 0),
      rotationQuaternion,
      new Cartesian3(this.scale[0], this.scale[1], this.scale[2]),
      new Matrix4()
    );
    // 局部到全局的变换
    let center = Cartesian3.fromDegrees(this.center[0], this.center[1], this.center[2]);
    const modelMatrix = Transforms.eastNorthUpToFixedFrame(center);

    let resModelMatrix = Matrix4.multiply(modelMatrix, rotationMat4, new Matrix4());
    return resModelMatrix;
  }

  getCenter() {
    return Cartesian3.fromDegrees(this.center[0], this.center[1], this.center[2]);
  }

  samples: number = 256; // 定义步长
  maxSamples: number = 1024; //最大采样Samples
  isovalue: number = 0.5;
  isowalls: boolean = true;
  isoalpha: number = 1.0;
  isosmooth: number = 1.0;
  colour: Array<number> = [149 / 255, 125 / 255, 82 / 255];
  xmin: number = 0.0; // 以指定的坐标点为中心，用于确定体素化的边界
  ymin: number = 0.0;
  zmin: number = 0.0;

  xmax: number = 1.0;
  ymax: number = 1.0;
  zmax: number = 1.0;

  density: number = 5.0;
  mindensity: number = 0.0;
  maxdensity: number = 1.0;

  saturation: number = 1.0;
  brightness: number = 0.0;
  contrast: number = 1.0;
  power: number = 1.0;
  minclip: number = 0.0;
  maxclip: number = 1.0;

  usecolourmap: boolean = true;
  tricubicFilter: boolean = false;
  interactive: boolean = false;
  axes: boolean = false;
  border: boolean = false;

  filterAlpha: boolean = true;

  slices: number[] = []; // 行列的切片数量
  rotate: number[] = []; // 单位四元素
  scale: number[] = []; // 各个方向的宽度
  center: number[] = [];
  resolution: number[] = []; // 400,[sliceWidth] 100,[sliceHeight] 100
  image: any;
  colours: [] = []; // 颜色带
}

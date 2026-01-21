/*
 * @Author: 枫林残忆 2997534654@qq.com
 * @Date: 2024-03-31 09:02:58
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-31 15:28:38
 * @FilePath: \Geology-V3\src\views\SceneManagement\Tests\Utils\VoxelPrimitiveFactory.ts
 * @Description:
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 *
 */
import { ElMessage } from 'element-plus';
import Cesium from 'Cesium';
import axios, { AxiosProgressEvent } from 'axios';
import { PropertyCollection } from '../Primitives/VoxelPrimitive.d';
import { GradientEditor } from './WebGL';
import VoxelPrimitive from '../Primitives/VoxelPrimitive';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import * as dat from 'dat.gui';
export default class VoxelPrimitiveFactory {
  static init(id: string, debug: boolean) {
    VoxelPrimitiveFactory.gradientEditorId = id;
    if (debug) {
      VoxelPrimitiveFactory.gui = new dat.GUI();
    }
  }

  static add(volume: string, config: string) {
    console.log('加载：' + volume);

    let volumeSlice: HTMLImageElement;
    let gradientImage: HTMLImageElement;
    let props: PropertyCollection;

    return VoxelPrimitiveFactory.loadTexture(volume)
      .then((image) => {
        volumeSlice = image as HTMLImageElement;
        return VoxelPrimitiveFactory.loadVolumeConfig(config, image as HTMLImageElement);
      })
      .then((properties) => {
        props = properties as PropertyCollection;
        return VoxelPrimitiveFactory.loadGradientTexture(props.colours);
      })
      .then(async (image) => {
        gradientImage = image as HTMLImageElement;
        let center = VoxelPrimitiveFactory.getCenter(props);
        let modelMatrix = VoxelPrimitiveFactory.getScaleRotateENUMat(props);
        let fs = await Cesium.Resource.fetchText({
          url: 'shaders/testCesium.frag.glsl',
        });
        let vs = await Cesium.Resource.fetchText({
          url: 'shaders/testCesium.vert.glsl',
        });

        let voxel = new VoxelPrimitive(center, modelMatrix, vs, fs, volumeSlice, gradientImage, props);
        console.log(gradientImage);
        setTimeout(() => {
          VoxelPrimitiveFactory.getGradientTexture();
          ElMessage.info('加载成功' + ++VoxelPrimitiveFactory.count);
        }, 3000);

        if (VoxelPrimitiveFactory.gui && !VoxelPrimitiveFactory.isInit) {
          let f = VoxelPrimitiveFactory.gui.addFolder('Volume');
          let viewer = DTScopeEngine.viewer as Cesium.Viewer;
          viewer.scene.skyAtmosphere.show = false;
          viewer.scene.skyBox.show = true;
          //@ts-ignore
          let terrainTransparent = new Cesium.DTTerrainTransparent({
            viewer,
            alpha: 0.7,
          });

          f.add(viewer.scene.skyAtmosphere, 'show').name('skyAtmosphere');
          f.add(viewer.scene.globe, 'show').name('globe');
          f.add(viewer.scene.moon, 'show').name('moon');
          f.add(viewer.scene.sun, 'show').name('sun');
          f.add(terrainTransparent, 'alpha', 0.0, 1.0).name('透明度');
          // f.add( , "density", 0, 50.0);
          // f.add(this.property, "isovalue", 0.0, 1.0);
          // f.add(this.property, "usecolourmap");
          // f.add(this.property, "mindensity", 0.0, 1.0);
          // f.add(this.property, "maxdensity", 0.0, 1.0);
          // f.add(this.property, "filterAlpha");
          // f.add(this.property, "samples", 200, 1024); // 定义采样步长
          VoxelPrimitiveFactory.isInit = true;
        }
        return voxel;
      });
  }

  /**
   * @description: 加载3D纹理
   * @param {string} volumeUrl
   * @return {void}
   */
  private static loadTexture(volumeUrl: string) {
    return axios({
      method: 'GET',
      url: volumeUrl,
      responseType: 'blob',
      onDownloadProgress: function (progressEvent: AxiosProgressEvent) {
        let progress = Math.round(
          //@ts-ignore
          (progressEvent.loaded * 100) / progressEvent.total
        );
      },
    }).then((res) => {
      let blob = res.data as Blob;
      let image = new Image();
      image.src = window.URL.createObjectURL(blob);
      return new Promise((resolve, reject) => {
        image.onload = () => {
          resolve(image);
        };
        image.onerror = (error) => reject(error);
      });
    });
  }

  private static loadVolumeConfig(volumeConfig: string, image: HTMLImageElement) {
    return axios({
      method: 'GET',
      url: volumeConfig,
    }).then((res) => {
      let data = res.data;

      let properties: PropertyCollection = {
        samples: 256, // 定义步长
        maxSamples: 1024, //最大采样Samples
        isovalue: 0.0,
        isowalls: true,
        isoalpha: 1.0,
        isosmooth: 1.0,
        colour: [149 / 255, 125 / 255, 82 / 255],
        xmin: 0.0, // 以指定的坐标点为中心，用于确定体素化的边界
        ymin: 0.0,
        zmin: 0.0,
        xmax: 1.0,
        ymax: 1.0,
        zmax: 1.0,
        density: 5.0,
        mindensity: 0.0,
        maxdensity: 1.0,
        saturation: 1.0,
        brightness: 0.0,
        contrast: 1.0,
        power: 1.0,
        minclip: 0.0,
        maxclip: 1.0,
        usecolourmap: true,
        tricubicFilter: false,
        interactive: false,
        axes: false,
        border: false,
        filterAlpha: true,
        slices: [], // 行列的切片数量
        rotate: [], // 单位四元素
        scale: [], // 各个方向的宽度
        center: [],
        modelMatrix: [], // 直接给的模型矩阵
        resolution: [], // 400,[sliceWidth] 100,[sliceHeight] 100
        colours: [], // 颜色带
      };

      properties.rotate = [0, 0, 0, 1];
      properties.scale = [80, 20, 20];
      properties.resolution = data.resolution; // 体素的长宽高
      properties.center = data.center;
      properties.slices = [
        // 这个属性用于shader中对该属性进行正确采样
        image.width / properties.resolution[0],
        image.height / properties.resolution[1],
      ];
      properties.colours = data.colours; // 这个应该就是那个颜色映射表
      return new Promise((resolve, reject) => {
        resolve(properties);
      });
    });
  }

  private static loadGradientTexture(colours: []) {
    if (!VoxelPrimitiveFactory.gradientEditor) {
      let paletteCanvasDom = document.getElementById(VoxelPrimitiveFactory.gradientEditorId);
      VoxelPrimitiveFactory.gradientEditor = new GradientEditor(paletteCanvasDom, () => {
        console.log('palatte初始化完毕');
      });
    }
    let gradientEditor = VoxelPrimitiveFactory.gradientEditor;
    gradientEditor.read(colours);
    let gradientTexture = new Image(); // transfer function
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        //@ts-ignore
        gradientTexture.src = gradientEditor.canvas.toDataURL();
        resolve(gradientTexture);
      }, 3000); // 先暂停 3000 milliseconds
    });
  }

  private static getGradientTexture() {
    console.log(VoxelPrimitiveFactory.gradientEditor.canvas.toDataURL());
  }

  /**
   * @description: 获取体素的中心位置
   * @param {PropertyCollection} properties
   * @return {*}
   */
  private static getCenter(properties: PropertyCollection) {
    return new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(properties.center[0], properties.center[1], properties.center[2]), 1000);
  }

  /**
   * @description: 获取局部坐标到全局坐标变换的 model matrix
   * @param {PropertyCollection} properties
   * @return {*}
   */
  private static getScaleRotateENUMat(properties: PropertyCollection) {
    let resModelMatrix;

    const rotationQuaternion = new Cesium.Quaternion(properties.rotate[0], properties.rotate[1], properties.rotate[2], properties.rotate[3]);

    //Divide all by the highest resolution
    let maxn = Math.max.apply(null, properties.resolution);
    properties.scale = [
      (properties.resolution[0] / maxn) * properties.scale[0],
      (properties.resolution[1] / maxn) * properties.scale[1],
      (properties.resolution[2] / maxn) * properties.scale[2],
    ];

    const rotationMat4 = Cesium.Matrix4.fromTranslationQuaternionRotationScale(
      new Cesium.Cartesian3(0, 0, 0),
      rotationQuaternion,
      new Cesium.Cartesian3(properties.scale[0], properties.scale[1], properties.scale[2]),
      new Cesium.Matrix4()
    );
    // 局部到全局的变换
    let center = Cesium.Cartesian3.fromDegrees(properties.center[0], properties.center[1], properties.center[2]);
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);

    resModelMatrix = Cesium.Matrix4.multiply(modelMatrix, rotationMat4, new Cesium.Matrix4());

    return resModelMatrix;
  }

  static gradientEditor; // 调色器
  static gradientEditorId;

  static gui; // 调试器
  static isInit = false; //
  static count = 0;
}

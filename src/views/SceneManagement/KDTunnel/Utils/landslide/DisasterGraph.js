/*
 * @Author: Lincong-pro
 * @Date: 2023-07-10 10:05:05
 * @LastEditors: anganao
 * @LastEditTime: 2024-02-28 20:14:45
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnel\Utils\landslide\DisasterGraph.js
 * @Description:
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import {
  GeometryInstance,
  PolygonGeometry,
  PolygonHierarchy,
  Cartesian3,
  ColorGeometryInstanceAttribute,
  Color,
  PerInstanceColorAppearance,
  GroundPrimitive,
  Primitive,
  // Cartographic,
  GroundPolylinePrimitive,
  GroundPolylineGeometry,
  ShowGeometryInstanceAttribute,
  PolylineColorAppearance,
  Resource,
  PointPrimitiveCollection,
  LabelCollection,
  // Math as CesiumMath
} from 'Cesium';

import store from '@/store';

import {
  TRAJECTORY_BUFFER_URL_MUDSLIDE,
  ROAD_BUFFER_URL_MUDSLIDE,
  PROFLIES_LINE_URL_MUDSLIDE,
  PROFLIES_POINT_URL_MUDSLIDE,
  BUILDING_BUFFER_URL_MUDSLIDE,
} from './url';

class DisasterGraphics {
  /**
   * @description: 透明单例
   */
  constructor() {
    if (!DisasterGraphics._instance) {
      DisasterGraphics._instance = this;
      this._primitives = [];
      // this._colors = colormap({
      //     colormap: "YIOrRd",
      //     nshades: 10,
      //     format: "hex",
      //     alpha: 1
      // })
    }
    return DisasterGraphics._instance;
  }
  /**
   * @description: 加载数据
   * @param {DTGlobe} viewer
   * @return {void}
   */
  load(viewer) {
    this.viewer = viewer;
    return Promise.all([
      this.loadBuilding(BUILDING_BUFFER_URL_MUDSLIDE),
      this.loadBuffer(ROAD_BUFFER_URL_MUDSLIDE, '#D2691E'),
      this.loadBuffer(TRAJECTORY_BUFFER_URL_MUDSLIDE, '#DADEAD'),
      this.loadline(PROFLIES_LINE_URL_MUDSLIDE, '#ff0000'),
      this.loadlabel(PROFLIES_POINT_URL_MUDSLIDE, '#000000'),
    ]);
  }

  /**
   * @description: 房屋闪烁
   * @return {void}
   */
  houseFlash() {
    console.log(this.viewer.scene.primitives);
    let layer1 = this.viewer.scene.primitives.get(1);
    let layer2 = this.viewer.scene.primitives.get(3);
    let startIndex = 0;
    this._timerId = setInterval(() => {
      ++startIndex;
      if (startIndex % 2 == 0) {
        layer1.show = true;
        layer2.show = false;
      } else {
        layer1.show = false;
        layer2.show = true;
      }
    }, 200);
  }

  /**
   * @description: 关闭房屋闪烁
   */
  stopFlash() {
    clearInterval(this._timerId);
  }

  /**
   * @description: 三维体的显示
   * @return {void}
   */
  activate() {
    this._primitives.forEach((primitive) => {
      primitive.show = true;
    });
    this._normalPrimitive.show = true;
    this._flashPrimitive.show = false;
  }
  /**
   * @description: 三维体的隐藏
   * @return {void}
   */
  deactivate() {
    if (this._normalPrimitive && this._flashPrimitive) {
      this._primitives.forEach((primitive) => {
        primitive.show = false;
      });
      this._normalPrimitive.show = false;
      this._flashPrimitive.show = false;
    }
  }
  /**
   * @description: 释放内存
   * @return {void}
   */
  destroy() {
    let viewer = this.viewer;
    if (this._normalPrimitive && this._flashPrimitive) {
      this._primitives.forEach((primitive) => {
        viewer.scene.primitives.remove(primitive);
      });
      let layer1 = viewer.scene.primitives.get(1);
      let layer2 = viewer.scene.primitives.get(2);
      viewer.scene.primitives.remove(layer1);
      layer1.destroy();
      viewer.scene.primitives.remove(layer2);
      layer2.destroy();

      this._flashPrimitive = undefined;
      this._normalPrimitive = undefined;

      this._primitives = [];
    }
  }
  /**
   * @description: step1 加载房屋
   * @param {string} url
   * @return {void}
   */
  async loadBuilding(url) {
    const buildingBuffer = JSON.parse(await Resource.fetch({ url: url }));
    const geometrys = this.obj2array(buildingBuffer, 0);
    const extruds = [];
    const colorMap = [];

    for (let i = 0; i < geometrys.length; i++) {
      //注意挤出的参数不是长度，而是挤出面和椭球面的距离
      extruds.push(geometrys[i][geometrys[i].length - 3] + geometrys[i][2]);
      colorMap.push(geometrys[i][geometrys[i].length - 2]); // get the degree of influence
      geometrys[i] = geometrys[i].slice(0, geometrys[i].length - 3); // update the geometry
    }
    this.drawJsonPolygonWithColorMap(geometrys, 1, colorMap, extruds, false);
    this.drawJsonPolygonWithColorMap(geometrys, 1, colorMap, extruds, true);
  }

  /**
   * @description: step2 加载道路缓冲区
   * @param {string} url
   * @param {string} color 十六进制颜色字符串
   * @return {void}
   */
  async loadBuffer(url, color) {
    const buffer = JSON.parse(await Resource.fetch({ url: url }));
    const geometrys = this.obj2array(buffer);
    this.drawJsonPolygon(geometrys, 0.5, color);
  }

  /**
   * @description: step3 加载线条
   * @param {string} url
   * @param {string} color 十六进制颜色字符串
   * @return {void}
   */
  async loadline(url, color) {
    const buffer = JSON.parse(await Resource.fetch({ url: url }));
    const geometrys = this.obj2array(buffer);
    this.drawJsonPolyline(geometrys, color, 0.8);
  }

  /**
   * @description: step3 加载点
   * @param {string} url
   * @param {string} color 十六进制颜色字符串
   * @return {void}
   */
  async loadpoint(url, color) {
    const buffer = JSON.parse(await Resource.fetch({ url: url }));
    const geometrys = this.obj2array(buffer, 3);
    this.drawJsonPolypoint(geometrys, color, 0.5);
  }
  async loadlabel(url, color) {
    const buffer = JSON.parse(await Resource.fetch({ url: url }));
    const geometrys = this.obj2array(buffer, 4);
    this.drawJsonLabel(geometrys, color, 0.5);
  }

  //! ////////////////////////// 绘制辅助函数 //////////////////////////
  /**
   * @description: 绘制师姐特定数据结构的多边形
   * @param {Array[]} jsonData 坐标数组(二维数组，排列顺序为[[lon,lat,lon,lat]])
   * @param {number} alpha 透明度
   * @param {Array<number>} colorMap 颜色映射表
   * @param {number} extrude 面挤出高度
   * @param {boolean} normal 是否是正常显示的颜色
   * @return {void}
   */
  async drawJsonPolygonWithColorMap(jsonData, alpha, colorMap, extrude, normal = true) {
    // compute color map
    let max = Math.max(...colorMap);

    let viewer = this.viewer;
    const instances = [];
    for (let i = 0; i < jsonData.length; i++) {
      let color = undefined;
      let redDegree = Math.ceil((colorMap[i] / max) * 10); // 红色程度
      if (redDegree == 0) {
        color = Color.fromBytes(13, 104, 18, alpha);
      } else {
        /* if (normal) {
            color = Color.fromCssColorString(
                this._colors[redDegree - 1]
            ).withAlpha(alpha)
            } else {
            color = Color.fromBytes(255, 255, 255, alpha)
            } */
        if (normal) {
          if (redDegree >= 2) {
            color = Color.fromBytes(217, 0, 27, alpha);
          } else {
            color = Color.fromBytes(252, 153, 4, alpha);
          }
        } else {
          color = Color.fromBytes(255, 255, 255, alpha);
        }
      }
      let instance = await this.createPolygonGeometryInstance(jsonData[i], color, extrude[i]);
      instances.push(instance);
    }
    const primitiveOptions = {
      geometryInstances: instances,
      appearance: new PerInstanceColorAppearance({
        translucent: false, //半透明
        flat: true, //在着色器中使用平面阴影，不考虑光照
      }),
    };

    const primitive = new Primitive(primitiveOptions);

    if (normal) {
      this._normalPrimitive = primitive;
      viewer.scene.primitives.add(primitive, 1);
    } else {
      this._flashPrimitive = primitive;
      this._flashPrimitive.show = false;
      viewer.scene.primitives.add(primitive, 2);
    }
  }

  /**
   * @description: 使用单一颜色创建polygon
   * @param {number[]} jsonData
   * @param {number} alpha
   * @param {string} color 十六进制字符串
   * @return {void}
   */
  // @dealData
  async drawJsonPolygon(jsonData, alpha, color) {
    let viewer = this.viewer;
    const instances = [];
    let _color = Color.fromCssColorString(color).withAlpha(alpha);
    for (let i = 0; i < jsonData.length; i++) {
      // let cartographics = []
      // for (let j = 0; j < jsonData[i].length; j += 3) {
      //   cartographics.push(
      //     Cartographic.fromDegrees(jsonData[i][j], jsonData[i][j + 1])
      //   )
      // }
      // // conversion
      // let cartographicsWithHeight = await getCartographicWithHeight(
      //   cartographics
      // )
      // let flattenData = []
      // for (let j = 0; j < cartographicsWithHeight.length; j++) {
      //   let cartographic = cartographicsWithHeight[j]
      //   if (typeof cartographic.height == "undefined") {
      //     continue
      //   }
      //   //@ts-ignore
      //   flattenData.push(CesiumMath.toDegrees(cartographic.longitude))
      //   //@ts-ignore
      //   flattenData.push(CesiumMath.toDegrees(cartographic.latitude))
      //   flattenData.push(cartographic.height)
      // }

      let instance = this.createPolygonGeometryInstance(jsonData[i], _color);
      instances.push(instance);
    }

    const primitiveOptions = {
      geometryInstances: instances,
      appearance: new PerInstanceColorAppearance({
        translucent: false, //半透明
        flat: true, //在着色器中使用平面阴影，不考虑光照
      }),
      classificationType: store.getters.classificationType,
    };

    //If not extrude, use ground primitive, because groundprimitive does not support extrusion
    const primitive = new GroundPrimitive(primitiveOptions);
    viewer.scene.primitives.add(primitive);
    this._primitives.push(primitive);
  }

  /**
   * @description: 绘制师姐特定数据结构的多边形
   * @param {Array[]} jsonData 坐标数组(二维数组，排列顺序为[[lon,lat,lon,lat]])
   * @param {string} color 十六进制字符串
   * @param {number} alpha
   * @return {void}
   */
  drawJsonPolyline(jsonData, color, alpha) {
    let viewer = this.viewer;
    const instances = [];
    for (let i = 0; i < jsonData.length; i++) {
      const instance = new GeometryInstance({
        geometry: new GroundPolylineGeometry({
          positions: Cartesian3.fromDegreesArrayHeights(jsonData[i]),
          width: 5,
        }),
        attributes: {
          color: ColorGeometryInstanceAttribute.fromColor(Color.fromCssColorString(color).withAlpha(alpha)),
          show: new ShowGeometryInstanceAttribute(true),
        },
      });
      instances.push(instance);
    }

    const primitive = new GroundPolylinePrimitive({
      geometryInstances: instances,
      appearance: new PolylineColorAppearance(),
      //appearance: new PolylineMaterialAppearance({material: new PolylineArrowMaterialProperty(Color.RED)}),
      classificationType: store.getters.classificationType,
    });

    viewer.scene.primitives.add(primitive);
    this._primitives.push(primitive);
  }

  drawJsonPolypoint(jsonData, color, alpha) {
    let viewer = this.viewer;
    let points = new PointPrimitiveCollection();
    //读取每一帧的点坐标
    for (let j = 0; j < jsonData.length; j++) {
      points.add({
        position: Cartesian3.fromDegrees(jsonData[j][0], jsonData[j][1], jsonData[j][2] + 10),
        pixelSize: 10,
        outlineColor: Color.RED, //边框颜色
        outlineWidth: 2, //边框宽度
        distanceDisplayCondition: {
          far: 500000,
          near: 1,
        },
        color: ColorGeometryInstanceAttribute.fromColor(Color.fromCssColorString(color).withAlpha(alpha)),
        show: true,
      });
    }

    viewer.scene.primitives.add(points);
    this._primitives.push(points);
  }

  drawJsonLabel(jsonData, color, alpha) {
    let viewer = this.viewer;
    //console.log(jsonData)
    //console.log(jsonData.length)
    let labels = new LabelCollection();
    //读取每一帧的点坐标
    for (let j = 0; j < jsonData.length; j++) {
      labels.add({
        position: Cartesian3.fromDegrees(jsonData[j][0], jsonData[j][1], jsonData[j][2] + 15),
        font: '20px Helvetica',
        text: 'p' + (jsonData[j][3] + 1),
        fillColor: Color.fromCssColorString(color).withAlpha(alpha),
      });
    }

    viewer.scene.primitives.add(labels);
    this._primitives.push(labels);
  }

  /**
   * @description: 创建PolygonGeometry实例
   * @param {number} data 坐标数据
   * @param {Color} color 颜色
   * @param {number} extrude 挤出高度
   * @return {GeometryInstance}
   */
  createPolygonGeometryInstance(data, color, extrude = null) {
    const instance = new GeometryInstance({
      geometry: new PolygonGeometry({
        polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArrayHeights(data)),
        extrudedHeight: extrude == null ? 0 : extrude,
        perPositionHeight: true,
      }),
      attributes: {
        color: ColorGeometryInstanceAttribute.fromColor(color),
      },
    });
    return instance;
  }

  /**
   * @description: json对象转化为数组
   * @param {any} data
   * @param {number} size
   * @return {*}
   */
  obj2array(data, size = 2) {
    const geometry = data.data;
    let arrayData = new Array();
    //第一层，几何体个数
    for (let element of geometry) {
      //第二层，将每个几何体的xy转为数组
      let elementArray = new Array();
      for (let i = 0, j = 0; i < element.length; i++, j += size) {
        // elementArray.push(element[i].x, element[i].y);
        let values = Object.values(element[i]);
        //取xy两个
        if (size == 2) {
          elementArray.push(values[0], values[1], 0);
          continue;
        }
        //房屋的特殊情况
        if (size == 0) {
          elementArray.push(values[0], values[1], element[element.length - 1].z + 5); //高度太矮了，加10m
          continue;
        }
        if (size == 3) {
          //取xyz三个
          elementArray.push(values[0], values[1], values[2]);
          continue;
        }
        elementArray.push(values[0], values[1], values[2], values[3]);
      }
      arrayData.push(elementArray);
    }
    return arrayData;
  }

  //! ////////////////////////// 属性 //////////////////////////
  _primitives; // store the primitives
  _flashPrimitive; // affected houses
  _normalPrimitive; // normal houses
  _colors;
  static _instance = undefined;
  _timerId; // control house flash
}

export default DisasterGraphics;

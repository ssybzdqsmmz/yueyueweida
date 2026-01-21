/*
 * @Author: Lincong-pro
 * @Date: 2023-04-17 10:10:05
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-17 11:01:53
 * @FilePath: \geoproject2.0\src\utils\CesiumFunc\DireMatCtionPro.ts
 * @Description: 自定义材质属性
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import { Material, Event, JulianDate, defined, Property } from 'Cesium';
import shaderSource from '@/assets/shaders/directionLine.fs.glsl?raw';

/**
 * @description: 材质属性构造类-挂载在Cesium.Material上
 * @param {*} options
 * @return {void}
 */
function DireMatCtionPro(options) {
  this._definitionChanged = new Event();
  this._color = options.color;
  this._image = options.image;
  // initialization
  this.load();
}

DireMatCtionPro.prototype.load = function () {
  const matype = 'DireLineMaterial';
  //@ts-ignore
  Material.DireLineMaterialType = matype;
  //@ts-ignore
  Material.DireLineMaterialSource = shaderSource;
  //@ts-ignore
  Material._materialCache.addMaterial(Material.DireLineMaterialType, {
    fabric: {
      //@ts-ignore
      type: Material.DireLineMaterialType,
      //@ts-ignore
      source: Cesium.Material.DireLineMaterialSource,
      uniforms: {
        color: this._color,
        image: this._image,
      },
    },
    translucent: function (material) {
      return true;
    },
  });
};

//! ////////////////////////////////////////////////////////// override functions //////////////////////////////////////////////////////////
/**
 * @description: The type of material.
 * @param {JulianDate} time
 * @return {string}
 */
DireMatCtionPro.prototype.getType = function (time: JulianDate) {
  return 'DireLineMaterial';
};
/**
 * @description: The type of material.
 * @param {JulianDate} time The time for which to retrieve the value.
 * @param {object} result The object to store the value into, if omitted, a new instance is created and returned.
 * @return {object}
 */
DireMatCtionPro.prototype.getValue = function (time: JulianDate, result: object) {
  if (!defined(result)) {
    result = {};
  }
  return result;
};

/**
 * @description: Compares this property to the provided property and returns true if they are equal, false otherwise.
 * @param {Property} other
 * @return {boolean}
 */
DireMatCtionPro.prototype.equals = function (other: Property) {
  //@ts-ignore
  return this === other || (other instanceof DireMatCtionPro && Property.equals(this._color, other._color));
};
//! ////////////////////////////////////////////////////////// override propeties //////////////////////////////////////////////////////////
Object.defineProperties(DireMatCtionPro.prototype, {
  /**
   * 获取isConstant
   * @memberof DireMatCtionPro.prototype
   * @type {Boolean}
   * @readonly
   */
  isConstant: {
    get: function () {
      return false;
    },
  },
  /**
   * 获取definitionChanged事件.
   * @memberof DireMatCtionPro.prototype
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
});
export { DireMatCtionPro };

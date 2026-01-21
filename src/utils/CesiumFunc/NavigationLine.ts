/*
 * @Author: Lincong-pro
 * @Date: 2023-04-16 10:39:44
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-17 14:20:55
 * @FilePath: \geoproject2.0\src\utils\CesiumFunc\NavigationLine.ts
 * @Description:传入数据制作导航线
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import { Color, ClassificationType } from 'Cesium';
import { DireMatCtionPro } from './DireMatCtionPro';
import { DTScopeEngine } from '../Common/Viewer';
import { cartographicArrayHeightsToCartesian3 } from '../Common/Transform';
import DaduheView from '@/components/information/Daduhe';

import leftPNG from '@/assets/materials/left.png';
import rightPNG from '@/assets/materials/right.png';

enum IconMode {
  //@ts-ignore
  Left = leftPNG,
  //@ts-ignore
  Right = rightPNG,
}

/**
 * @description: 初始化导航线
 * 导航线的数据规则->[[Cartesian3,Cartesian3],[Cartesian3,Cartesian3]]
 * @return {void}
 */
function NavigationLine() {
  // 读取数据 []放入的是 cartesianArray -> [[]]
  let daduheData = [];
  let data = DaduheView['水流流向'];
  data.forEach((point) => {
    daduheData.push(point.longitude);
    daduheData.push(point.latitude);
    daduheData.push(point.height);
  });
  this._lineData = [
    [
      101.6976999, 30.0887992, 3717.53, 101.6974209, 30.0889208, 3718.26, 101.6971883, 30.0890987, 3717.83, 101.6968667, 30.0893657, 3717.2,
      101.6966381, 30.0896376, 3718.24,
    ],
    [
      101.6965047, 30.0897876, 3716.92, 101.6964487, 30.089722, 3713.83, 101.6963194, 30.0896112, 3713.32, 101.696262, 30.0895715, 3713.01,
      101.6951793, 30.0900184, 3705.62,
    ],
    [101.695033, 30.0900555, 3705.42, 101.6949367, 30.0898639, 3706.07, 101.6946755, 30.0899204, 3699.98],
    [101.6948814, 30.0898667, 3706.13, 101.6948397, 30.0898052, 3705.02],
    [
      101.6979313, 30.0886513, 3719.94, 101.6976382, 30.088652, 3722.38, 101.6972411, 30.0889388, 3719.88, 101.6967904, 30.089286, 3719.33,
      101.6962918, 30.0888028, 3705.33,
    ],
  ];
  this._lineData.push(daduheData);
  this._lineEntityIds = [];
  this._iconMode = IconMode.Left;
}

/**
 * @description: 设置icon
 * @param {IconMode} mode 箭头方向
 * @return {void}
 */
NavigationLine.prototype.changeIcon = function (mode: IconMode) {
  this._iconMode = mode;
};

/**
 * @description: 初始化Primitive Object
 * @return {void}
 */
NavigationLine.prototype.load = function () {
  let viewer = DTScopeEngine.viewer;
  for (let i = 0; i < this._lineData.length; i++) {
    let mat = {
      image: this._iconMode,
      color: new Color(0, 0, 254 / 255, 1.0),
    };
    let id = viewer.entities.add({
      polyline: {
        width: 20,
        positions: cartographicArrayHeightsToCartesian3(this._lineData[i]),
        material: new DireMatCtionPro(mat),
        classificationType: ClassificationType.TERRAIN,
        clampToGround: false,
        zIndex: 1,
      },
    }).id;
    this._lineEntityIds.push(id);
  }
};

/**
 * @description: 恢复场景中三维物体的显示
 * @return {void}
 */
NavigationLine.prototype.activate = function () {
  let viewer = DTScopeEngine.viewer;
  this._lineEntityIds.forEach((id) => {
    let entity = viewer.entities.getById(id);
    entity.show = true;
  });
};

/**
 * @description: 隐藏场景中的三维物体
 * @return {void}
 */
NavigationLine.prototype.deactivate = function () {
  let viewer = DTScopeEngine.viewer;
  this._lineEntityIds.forEach((id) => {
    let entity = viewer.entities.getById(id);
    entity.show = false;
  });
};

/**
 * @description: 清理场景中绘制的物体，释放内存
 * @return {void}
 */
NavigationLine.prototype.destroy = function () {
  let viewer = DTScopeEngine.viewer;
  // clear all the entities
  this._lineEntityIds.forEach((id) => {
    viewer.entities.removeById(id);
  });
};

export { NavigationLine, IconMode };

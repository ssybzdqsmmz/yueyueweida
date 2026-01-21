/*
 * @Author: Guo yongxin
 * @Date: 2022-08-03 14:03:11
 * @LastEditTime: 2023-03-03 21:22:28
 * @LastEditors: Lincong-pro
 * @Description: Define const type file for mutations.
 * @FilePath: \TBM\src\store\modules\mutations-type.ts
 */

export enum CURSORTYPE {
  PAN = 0, // mouse pan
  ZOOM = 1, // mouse zoom
  DRAW = 2, // mouse fraw
  SELECT = 3, // mouse select
}

export enum PREDICTMETHOD {
  FGS = 0, // 掌子面地质素面
  TSP = 1, // 长距离预测
  TEM = 2, // 中距离预测
  GPR = 3, // 短距离预测 - 地质雷达
  PCA = 4, // 预测综合分析
}

export enum SUBPREDICTMETHOD {
  GPR = 0, // 短距离预测 - 地质雷达
  ADH = 1, // 短距离预测 - 超前水平钻
  DBH = 2, // 短距离预测 - 加深炮孔
  MSM = 3, // 短距离预测 - 微震监测
}

export const CHANGECURSORTYPE = 'changeCursorType';

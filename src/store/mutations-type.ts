/*
 * @Author: Guo yongxin
 * @Date: 2022-08-03 14:03:11
 * @LastEditTime: 2023-03-13 17:11:21
 * @LastEditors: Lincong-pro
 * @Description: Define const type file for mutations.
 * @FilePath: \geoproject2.0\src\store\mutations-type.ts
 */

export const CURSORTYPE = {
  PAN: 0, // mouse pan
  ZOOM: 1, // mouse zoom
  DRAW: 2, // mouse fraw
  SELECT: 3, // mouse select
};

export const CHANGECURSORTYPE = 'changeCursorType';

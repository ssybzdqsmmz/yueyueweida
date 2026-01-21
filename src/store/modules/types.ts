/*
 * @Author: Lincong-pro
 * @Date: 2023-03-22 10:35:42
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-18 18:04:11
 * @FilePath: \geoproject2.0\src\store\modules\types.ts
 * @Description: 定义枚举类型
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */

export enum UIType {
  MenuBar,
  ToolBar,
  MonitorBar,
  PopUp,
  MonitorPopUp,
}

export enum LeftClickMode {
  Debug = 0, // 点击显示相机和点击处信息
  MonitorBarInfo = 1, // 监测面板详细信息
  BIMInfo = 2, // BIM构建信息
}

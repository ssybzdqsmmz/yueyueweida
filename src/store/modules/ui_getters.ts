/*
 * @Author: Lincong-pro
 * @Date: 2023-03-22 10:58:09
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-18 16:56:20
 * @FilePath: \geoproject2.0\src\store\modules\ui_getters.ts
 * @Description: 设置子store的getters
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
export default {
  menuBar: (state) => state.menuBar,
  toolBar: (state) => state.toolBar,
  monitorBar: (state) => state.monitorBar,
  popUp: (state) => state.popUp,
  monitorPopUp: (state) => state.monitorPopUp,
  leftClickMode: (state) => state.leftClickMode,
};

/*
 * @Author: Lincong-pro
 * @Date: 2023-02-10 13:10:09
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-01 20:17:08
 * @FilePath: \TBM\src\store\getters.js
 * @Description: 外部获取全局变量的getters
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
const getters = {
  activeTab: (state) => state.activeTab,
  leftPanelVisibility: (state) => state.leftPanelVisibility,
  gpMethodId: (state) => state.dtglobe_store.gpMethodId,
  pickedPos: (state) => state.dtglobe_store.pickedPos,
};
export default getters;

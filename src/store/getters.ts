/*
 * @Author: Lincong-pro
 * @Date: 2023-03-06 17:45:32
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-23 20:25:53
 * @FilePath: \geoproject2.0\src\store\getters.ts
 * @Description: 全局变量的getters
 *
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
let getters = {
  showLevel: (state) => state.dtglobe_store.showLevel,
  lasaBoard: (state) => state.dtglobe_store.lasaBoard,
  disasterFrame: (state) => state.dtglobe_store.disasterFrame,
  simulationPause: (state) => state.dtglobe_store.simulationPause,
  progressMax: (state) => state.dtglobe_store.progressMax,
};
export default getters;

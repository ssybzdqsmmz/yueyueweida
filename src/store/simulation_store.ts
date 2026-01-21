/*
 * @Author: Lincong-pro
 * @Date: 2023-07-09 11:02:32
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-07-09 15:43:47
 * @FilePath: \Railway_DTPlatform-DTCZ_12\src\store\simulation_store.js
 * @Description: 用于控制模拟控件的变量
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
const state = {
  // 当前灾害帧
  disasterFrame: 0,
  // 是否暂停模拟
  simulationPause: true,
  // 最大的进度
  progressMax: 100,
};

const mutations = {
  setDisasterFrame(state, data) {
    state.disasterFrame = data;
  },
  setSimulationPause(state, data) {
    state.simulationPause = data;
  },
  setProgressMax(state, data) {
    state.progressMax = data;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};

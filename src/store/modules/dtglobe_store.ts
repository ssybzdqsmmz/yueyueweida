/*
 * @Author: Guo yongxin
 * @Date: 2022-08-03 12:20:58
 * @LastEditTime: 2023-04-18 14:54:47
 * @LastEditors: Lincong-pro
 * @Description: Define some state for DTScope Engine.
 * @FilePath: \geoproject2.0\src\store\modules\dtglobe_store.ts
 */

import * as Type from '@/store/mutations-type';

const state = {
  cursorType: Type.CURSORTYPE.PAN, // default cursor type

  // 左侧面板的层级
  showLevel: 0,
  // 拉萨任务面板启动器
  lasaBoard: '',
  // 当前灾害帧
  disasterFrame: 0,
  // 是否暂停模拟
  simulationPause: true,
  // 最大的进度
  progressMax: 0,
};

const mutations = {
  [Type.CHANGECURSORTYPE](state: any, payLoad: number) {
    state.cursorType = payLoad;
  },
  /**
   * @description: 设置左侧面板的显示层级
   * @param {any} state
   * @param {number} value
   * @return {void}
   */
  setShowLevel(state: any, value: number) {
    state.showLevel = value;
  },
  /**
   * @description: 设置监测面板-拉萨岸的显示信息
   * @param {any} state
   * @param {string} value
   * @return {void}
   */
  setLasaBoard(state: any, value: string) {
    state.lasaBoard = value;
  },
  /**
   * @description: 设置监测面板-拉萨岸的显示信息
   * @param {any} state
   * @param {number} value
   * @return {void}
   */
  setDisasterFrame(state: any, value: number) {
    state.disasterFrame = value;
  },
  /**
   * @description: 设置模拟的开始和停止
   * @param {any} state
   * @param {string} value
   * @return {void}
   */
  setSimulationPause(state: any, value: string) {
    state.simulationPause = value;
  },
  /**
   * @description: 设置进度条的总值
   * @param {any} state
   * @param {number} value
   * @return {void}
   */
  setProgressMax(state: any, value: number) {
    state.progressMax = value;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};

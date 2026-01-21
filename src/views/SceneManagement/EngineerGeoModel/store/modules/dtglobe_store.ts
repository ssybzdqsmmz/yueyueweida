/*
 * @Author: Guo yongxin
 * @Date: 2022-08-03 12:20:58
 * @LastEditTime: 2024-02-29 22:18:33
 * @LastEditors: xingxu-webgis 1833104160@qq.com
 * @Description: Define some state for DTScope Engine.
 * @FilePath: \Geology-v3\src\views\SceneManagement\EngineerGeoModel\store\modules\dtglobe_store.ts
 */

import { CURSORTYPE, CHANGECURSORTYPE, PREDICTMETHOD, SUBPREDICTMETHOD } from './mutations-type';

const state = {
  cursorType: CURSORTYPE.PAN, // default cursor type
  gpMethodId: undefined, // 左侧具体大类
  subGPMethodId: 0, // 右侧面板
  gpModelPicked: undefined,
  pickedPos: undefined,
};

const mutations = {
  [CHANGECURSORTYPE](state: any, payLoad: any) {
    state.cursorType = payLoad;
  },
  /**
   * @description: 设置全局的测量方法->导入对应的模型
   * @param {any} state
   * @param {PREDICTMETHOD} value
   * @return {void}
   */
  setGPMethodId(state: any, value: PREDICTMETHOD) {
    state.gpMethodId = value;
  },
  /**
   * @description: 设置短距离测量方法->导入对应的模型
   * @param {any} state
   * @param {SUBPREDICTMETHOD} value
   * @return {void}
   */
  setSubGPMethodId(state: any, value: SUBPREDICTMETHOD | undefined) {
    state.subGPMethodId = value;
  },
  setGPModelPicked(state: any, value: any) {
    state.gpModelPicked = value;
  },
  setPickedPos(state: any, value: any) {
    state.pickedPos = value;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};

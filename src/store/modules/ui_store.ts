/*
 * @Author: Lincong-pro
 * @Date: 2023-03-22 10:20:34
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-18 16:55:46
 * @FilePath: \geoproject2.0\src\store\modules\ui_store.ts
 * @Description: 用于控制面板中的各种工具栏
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import { UIType, LeftClickMode } from './types';
import getters from './ui_getters';

const state = {
  // 菜单栏
  menuBar: false,
  // 工具栏
  toolBar: false,
  // 监测面板
  monitorBar: false,
  // 弹窗
  popUp: false,
  // 监测信息显示弹窗
  monitorPopUp: false,
  // 左键点击时的模式
  leftClickMode: LeftClickMode.BIMInfo,
};

const mutations = {
  /**
   * @description: 设置UI的状态
   * @param {*} state data
   * @param {Object} data 面板上的UI工具栏
   * @return {void}
   */
  setUIStatus(state: any, data: { ui: UIType; status: boolean }) {
    switch (data.ui) {
      case UIType.MenuBar:
        state.menuBar = data.status;
        break;
      case UIType.ToolBar:
        state.toolBar = data.status;
        break;
      case UIType.MonitorBar:
        state.monitorBar = data.status;
        break;
      case UIType.PopUp:
        state.popUp = data.status;
        break;
      case UIType.MonitorPopUp:
        state.monitorPopUp = data.status;
        break;
    }
  },
  /**
   * @description: 设置左键时的触发函数
   * @param {*} state data
   * @param {LeftClickMode} mode 模式：调试 、BIM信息 、监测点位信息
   * @return {void}
   */
  setLeftClickMode(state: any, mode: LeftClickMode) {
    state.leftClickMode = mode;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};

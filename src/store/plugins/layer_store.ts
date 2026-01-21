/*
 * @Author: Lincong-pro
 * @Date: 2023-09-03 19:14:23
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-09-04 12:14:03
 * @FilePath: \GeoProject\src\store\plugins\layer_store.ts
 * @Description: 图层控件全局变量（主要用于控制Tree.vue执行）
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */

import layer_getters from './layer_getters';

const state = {
  treeNodes: {}, // 图层数据
  folderName: '', // 操作的图层名->插入操作
  hiddenLayers: [], // ['layer1','layer2']
  visibleLayers: [], // ['layer1','layer2']
  expandedKeys: [], // 展开的节点 key
  checkedKeys: [], // 勾选的节点 key
};

const mutations = {
  /**
   * @description: 用于更新操作的图层【通过配置文件添加图层】
   * @param {any} state
   * @param {*} param2
   * @return {void}
   */
  setTreeNodes(state: any, { config, folderName }) {
    state.treeNodes = config;
    state.folderName = folderName;
  },
  /**
   * @description: 设置隐藏的图层->更新内存中的配置文件用
   * @param {any} state
   * @param {*} hiddenLayers
   * @return {void}
   */
  setHiddenLayers(state: any, hiddenLayers) {
    state.hiddenLayers = hiddenLayers;
  },

  /**
   * @description: 设置隐藏的图层->更新内存中的配置文件用
   * @param {any} state
   * @param {*} visibleLayers
   * @return {void}
   */
  setVisibleLayers(state: any, visibleLayers) {
    state.visibleLayers = visibleLayers;
  },
  setExpandedKeys(state, expandedKeys) {
    state.expandedKeys = expandedKeys;
  },
  setCheckedKeys(state, checkedKeys) {
    state.checkedKeys = checkedKeys;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters: layer_getters,
};

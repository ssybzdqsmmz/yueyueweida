/*
 * @Author: Guo yongxin
 * @Date: 2022-08-02 21:06:20
 * @LastEditTime: 2024-03-01 15:19:21
 * @LastEditors: xingxu-webgis 1833104160@qq.com
 * @Description: Please Describe The File.
 * @FilePath: \Geology-v3\src\views\SceneManagement\EngineerGeoModel\store\index.js
 */
import { createStore } from 'vuex';
import dtglobe_store from './modules/dtglobe_store';
import getters from './getters';

// define state object
const state = {
  name: `Railway_DTPlatform`,
  videoDZSolution: undefined,
  videoDZIntroduce: undefined,
  currentItemIndex: undefined,
  // global active tab flag
  activeTab: undefined,
  leftPanelVisibility: false,
};

// define modification method
const mutations = {
  changeItemIndex(state, value) {
    state.currentItemIndex = value;
  },
  changeVDZSolution(state, value) {
    state.videoDZSolution = value;
  },
  changeVDZIntroduce(state, value) {
    state.videoDZIntroduce = value;
  },
  changeActiveTab(state, value) {
    state.activeTab = value;
  },
  changeLeftPanelVisibility(state, value) {
    state.leftPanelVisibility = value;
  },
};

// 创建 Vuex store
const store = createStore({
  // 初始状态
  state() {
    return state;
  },
  // 模块
  modules: {
    dtglobe_store, // 直接添加模块化的 store
  },
  // 修改状态的 mutations
  mutations: mutations,
  // 获取状态的 getters
  getters,
  // 触发 mutations 的 actions
  actions: {}, // 你的 actions，如果有的话
});

export default store;

/*
 * @Author: changfanhao
 * @Date: 2023-02-28 10:15:02
 * @LastEditors: anganao
 * @LastEditTime: 2024-02-28 16:49:57
 * @FilePath: \Geology-v3\src\store\index.ts
 * @Description:
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import { createStore } from 'vuex';
import dtglobe_store from './modules/dtglobe_store';
import ui_store from './modules/ui_store';
import layer_store from './plugins/layer_store';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import simulation from './simulation_store';

export default createStore({
  state,
  getters,
  mutations,
  modules: {
    dtglobe_store,
    //@ts-ignore
    ui_store,
    layer_store,
    simulation,
  },
});

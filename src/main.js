/*
 * @Author: fuweiaa 2567873016@qq.com
 * @Date: 2024-10-28 10:34:40
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-11-25 11:32:44
 * @FilePath: \Geology-v3\src\main.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'video.js/dist/video-js.css';
import Video from 'video.js';
import '@/utils/AvoidDebounce/Rem.js';
import 'virtual:svg-icons-register';
import AppConfig from '@/config/AppConfig.ts';
import UIConfig from '@/config/UIConfig.ts';
import '@/plugins/globalPrototype';
import { useElementPlus } from '@/plugins/elementPlus';
import { useGlobalComponents } from '@/plugins/globalComponents';
import mitt from 'mitt';

import 'element-plus/theme-chalk/index.css';

const appConfig = new AppConfig();
const conf = 'config/Application.json';

appConfig
  .loadConfig(conf)
  .then(() => {
    const uiConfig = new UIConfig();
    return uiConfig.loadConfig('config/UI.json');
  })
  .then(() => {
    const vueApp = createApp(App);

    vueApp.use(router).use(store).use(useElementPlus).use(useGlobalComponents);

    const bus = mitt();
    vueApp.config.globalProperties.$bus = bus;
    vueApp.config.globalProperties.DTGlobe = [];
    vueApp.config.globalProperties.$video = Video;
    vueApp.config.productionTip = false;

    vueApp.mount('#app');
  })
  .catch((error) => {
    console.error('Error loading configuration:', error);
  });

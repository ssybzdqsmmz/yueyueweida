<!--
 * @Author: 枫林残忆
 * @Date: 2024-03-01 09:54:09
 * @LastEditors: h2qisme 12671442+h2qisme@user.noreply.gitee.com
 * @LastEditTime: 2024-07-11 10:12:09
 * @FilePath: \Geology-v3\src\views\SceneManagement\ApplicationSupport\index.vue
 * @Description: 
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { loadMap } from '@/utils/Maps/MapSource';
import { loadCWT } from '@/utils/Maps/TerrainSource';
import { removeFromDTGlobeConfig } from './Utils/Layer';
import EventBus from './Utils/EventBus';

let layerUids;
let eventBus = new EventBus();
let Show = true;

const openTBM = () => {
  window.open('http://192.168.1.242:9990', '_blank');
};
const openLayue = () => {
  window.open('http://192.168.1.242:10062', '_blank');
};
const route = useRoute();

const handleButtonClick = () => {
  if (route.query.item === 'tbm') {
    openTBM(); // 如果item是'tbm'，则打开TBM页面
  } else if (route.query.item === 'layue') {
    openLayue(); // 如果item是'layue'，则打开Layue页面
  }
  // 如果这里没有匹配到任何情况，你可能想要做一些默认操作或者给出提示
};
const trashCollections = [];
onMounted(() => {
  const callback = () => {
    let viewer = DTScopeEngine.viewer;
    loadMap(viewer);
    eventBus.on('clearTrash', loadCWT(viewer));
  };
  DTScopeEngine.getViewer(callback);
  Show = true;
});

onBeforeUnmount(() => {
  // let viewer = DTScopeEngine.viewer;
  Show = false;
});
</script>

<template>
  <div class="disaster-panel" v-show="Show">
    <button class="application" @click="handleButtonClick">跳转</button>
  </div>
</template>

<style lang="scss" scoped>
.disaster-panel {
  position: fixed;
  top: 190px;
  right: 10px;
  z-index: 1;
  width: 200px;
  height: 80px;

  // 添加面板内边距
  padding: 10px;
  padding-bottom: 10px;
  border: 1px solid rgb(134 203 255 / 30%);

  // 添加圆角
  border-radius: 5px;
  background-color: rgb(17 37 54 / 92%);
}

.application {
  position: relative;
  top: auto;
  left: auto;
  width: 100%;
  height: 60px;
  border: none;
  border-radius: 4px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  background-color: #5f9ea0;
  cursor: pointer;
  transition: background-color 0.3s ease;

  // 鼠标悬停效果
  &:hover {
    background-color: #5a8180; // 稍微改变背景色
  }
}
</style>

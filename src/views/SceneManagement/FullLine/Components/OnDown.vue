<!--
 * @Author: fuwei 2567873016@qq.com
 * @Date: 2024-10-10 15:47:10
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-10-28 11:01:17
 * @FilePath: \Geology-v3\src\views\SceneManagement\FullLine\Components\OnDown.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="title">
    <div @click="add">地表地下信息一体化</div>
    <!-- <div class="geologyModel" @click="addGeology">地质模型</div> -->
    <!-- <div class="faultZone" @click="addFault">断裂带</div> -->
  </div>
</template>

<script setup lang="ts">
import { DTScopeEngine } from '@/utils/Common/Viewer';
// import { DTTerrainTransparent } from 'Cesium';
import { onMounted, onBeforeUnmount } from 'vue';
import * as Cesium from 'Cesium';
import { generateDTGlobeConfig, removeFromDTGlobeConfig, loadFromDTGlobeConfig } from '../Utils/Layer';
import { ipServer } from '../Services/ServiceProperties';
// import Fault from '../Config/scene_Fault.json';
// import Geology from '../Config/scene_Geology.json';
// import Fault from '../Config/scene_Fault.json';
// import Geology from '../Config/scene_Geology.json';

let layerUids = [];
// 接收参数控制其余组件的显隐

let options = {
  //@ts-ignore
  url: Cesium.IonResource.fromAssetId(1, {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlODE0MTRjZC0zZjQ3LTQxNTctYjE0NC05NGY1MjA0ZDgxYmMiLCJpZCI6OTg4MjAsImlhdCI6MTY4NTE2MjA1Mn0.FxQ9MoKycjkrZFuExULXjjgjHVxYTQ4qsSieZLLjWyQ',
    server: 'https://api.cesium.com',
  }),
  requestVertexNormals: false,
  requestWaterMask: false,
};

let viewer;
let terrainTransparent;
onMounted(() => {
  //@ts-ignore
  DTScopeEngine.getViewer(() => {
    viewer = DTScopeEngine.viewer;
    // 关闭地形透明
    // terrainTransparent.closeTerrainTransparent()
  });

  // addGeo(Fault);
  // addGeo(Geology);
});
//@ts-ignore
DTScopeEngine.getViewer(() => {
  viewer = DTScopeEngine.viewer;
  // 关闭地形透明
  // terrainTransparent.closeTerrainTransparent()
});

// addGeo(Fault);
// addGeo(Geology);

function add() {
  //@ts-ignore
  viewer.terrainProvider = new Cesium.CesiumTerrainProvider(options); // 设置地形
  // terrainTransparent = new DTTerrainTransparent({ viewer, alpha: 0.1 }); //开启地形透明并设置为0.2的透明度
  viewer.scene.skyBox.destroy(); // 删除星空
  // 控制组件显隐
}

function addGeo(param) {
  let sceneConfig;
  let config = generateDTGlobeConfig(ipServer, param);
  sceneConfig = config.dtglobeCzml;
  layerUids = config.layerUids;
  // TODO 加载断裂带
  let loadingPromise = loadFromDTGlobeConfig(viewer, sceneConfig);
}

// 清除所有地层模型和断裂带
onBeforeUnmount(() => {
  removeFromDTGlobeConfig(viewer, layerUids);
});
</script>

<style lang="scss" scoped>
.title {
  position: absolute;
  top: 10%;
  left: 88%;
  z-index: 1;
  width: 200px;
  height: 50px;
  line-height: 50px;

  /* 设置文本的行高与元素的高度相等 */
  font-size: 20px;
  text-align: center;

  /* 可选：水平居中文本 */
  background: url('../images/layerManager.png') no-repeat;
  background-color: rgb(27 72 64);

  .geologyModel {
    background-color: rgb(45 126 111);
  }

  .faultZone {
    background-color: rgb(61 175 154);
  }
}
</style>

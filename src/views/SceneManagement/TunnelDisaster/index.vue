<!--
 * @Author: fuwei 2567873016@qq.com
 * @Date: 2025-06-12 09:03:29
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-19 10:12:29
 * @FilePath: \Geology-v3\src\views\SceneManagement\TunnelDisaster\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<!--
 * @Description: 隧道灾害场景
-->
<template>
  <div class="tunnel-disaster-container">
    <div id="cesiumContainer" class="cesium-container"></div>
  </div>
  <PieChart />
  <tunnelrisk />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { Cartesian3, Math } from 'Cesium';
import { loadCenterLine } from '@/views/SceneManagement/GeologyModel/Services/InitScene';
import { ipServer, centerLineUrl, initialViewPort } from './Services/ServiceProperties';
import WEventBus from '../Layout/Tools/WEventBus';
import EventBus from '../FullLine/Utils/EventBus';
import { loadingEvents } from '@/views/SceneManagement/Layout/Components/events';
import { loadCWT } from '@/utils/Maps/TerrainSource';
import { loadWorldOcean } from '../FullLine/Utils/Layer';
import tunnelrisk from './Components/tunnelrisk.vue';
import PieChart from './Components/PieChart.vue';
// import pointsData from './config/points.json'; // 确保路径正确
// import pointsData from './config/tunnelrisk.json'; // 确保路径正确

let weventBus = new WEventBus();
let eventBus = new EventBus();
let viewer = null;

// 在场景初始化后调用
const initScene = async () => {
  try {
    console.log('开始初始化场景');
    viewer = DTScopeEngine.viewer;

    if (!viewer) {
      console.error('viewer初始化失败');
      return;
    }

    // 设置视角
    const position = Cartesian3.fromDegrees(98.53972746943906, 20.3251755108089, 584936.5125528347);
    viewer.camera.setView({
      destination: position,
      orientation: {
        heading: Math.toRadians(351.85721296620795),
        pitch: Math.toRadians(-29.691608779361474),
        roll: 0.007824741862085139,
      },
    });

    // 加载地形
    // eventBus.on('clearTrash', loadCWT(viewer));

    // 加载全线路数据
    eventBus.once('clearTrash', loadCenterLine(viewer, ipServer, centerLineUrl));

    // 加载白色底图
    // eventBus.once('clearTrash', loadWorldOcean(viewer));
  } catch (error) {
    console.error('初始化场景失败:', error);
    weventBus.emit(loadingEvents.changeLoadingWidget, false);
  }
};

// 组件挂载时初始化场景
onMounted(() => {
  DTScopeEngine.getViewer(async () => {
    await initScene();
  });
});

onBeforeUnmount(() => {
  if (viewer) {
    viewer.entities.removeAll();
    viewer.dataSources.removeAll();
    eventBus.emit('clearTrash');
  }
});
</script>

<style lang="scss" scoped>
.tunnel-disaster-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.cesium-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

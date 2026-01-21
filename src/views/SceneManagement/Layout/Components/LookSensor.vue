<!--
 * @Author: anganao 1928882425@qq.com
 * @Date: 2024-04-16 21:09:45
 * @LastEditors: anganao 1928882425@qq.com
 * @LastEditTime: 2024-04-16 22:07:17
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Components\LookSensor.vue
 * @Description: 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * 
-->
<script setup>
import { ElButton } from 'element-plus';
import { ref } from 'vue';
import { sampleTerrain, Cartographic, BoundingSphere, Cartesian3 } from 'Cesium';
import { DTScopeEngine } from '@/utils/Common/Viewer';
const props = defineProps(['sensors']);
let currentSensor = ref(-1);

async function lookNextSensor() {
  const viewer = DTScopeEngine.viewer;
  currentSensor.value = (currentSensor.value + 1) % props.sensors.length;
  // 获取当前三维坐标
  await viewer.terrainProvider.readyPromise;
  const points = await sampleTerrain(viewer.terrainProvider, 10, [
    Cartographic.fromDegrees(props.sensors[currentSensor].lon, props.sensors[currentSensor].lat),
  ]);
  // 计算当前sensor的boundingsphere
  const boudingSphere = new BoundingSphere(Cartographic.toCartesian(points[0]), 10);
  viewer.camera.flyToBoundingSphere(boudingSphere);
}
</script>

<template><ElButton type="success" class="look-sensor" @click="lookNextSensor">查看传感器</ElButton></template>

<style lang="scss">
.look-sensor {
  position: absolute;
  bottom: 30px;
  right: 100px;
  background-color: rgb(78, 140, 150);
  border: 1px solid white;
  color: white;
}
</style>

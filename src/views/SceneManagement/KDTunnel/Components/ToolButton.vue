<!--
 * @Author: Lincong-pro
 * @Date: 2024-02-25 11:33:02
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2024-02-26 16:55:35
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnel\Components\ToolButton.vue
 * @Description: 
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<script lang="ts" setup>
import { ref, watch } from 'vue';
import EventBus from '../Utils/eventBus';
let eventBus = new EventBus();

let reactiveData = { subSceneData: 'in' };
let subSceneProxy = new Proxy(reactiveData, {
  set: function (target, property, value, receiver) {
    eventBus.emit('tunnel_' + value); // topic -> tunnel_in tunnel_out
    target[property] = value;
    return true;
  },
});

const selectValue = ref('');
watch(selectValue, (value) => {
  eventBus.emit('changeModel', value);
});
const options = [
  {
    value: 'TFS',
    label: 'TFS',
  },
  {
    value: 'TEG',
    label: 'TEG',
  },
  {
    value: 'TSP',
    label: 'TSP',
  },
  {
    value: 'TEM',
    label: 'TEM',
  },
  {
    value: 'GPR',
    label: 'GPR',
  },
  {
    value: 'AHD',
    label: 'AHD',
  },
  {
    value: 'DBH',
    label: 'DBH',
  },
];
</script>

<template>
  <div id="tool-button">
    <el-button type="primary" @click="subSceneProxy.subSceneData = 'in'">入口</el-button>
    <el-button type="success" @click="subSceneProxy.subSceneData = 'voxel'">体素</el-button>
    <el-button type="success" @click="subSceneProxy.subSceneData = 'geology'">地质</el-button>
    <el-button type="success" @click="subSceneProxy.subSceneData = 'out'">出口</el-button>
    <el-button type="success" @click="subSceneProxy.subSceneData = 'in_roam'">漫游</el-button>
    <el-select v-model="selectValue" class="m-2" placeholder="Select" size="large" style="width: 240px">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<style lang="scss" scoped>
#tool-button {
  position: absolute;
  bottom: 0;
  left: 50%;
  z-index: 1;
}
</style>

<!--
 * @Author: Lincong-pro
 * @Date: 2024-02-26 19:07:12
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-04-19 08:28:30
 * @FilePath: \Geology-V3\src\views\SceneManagement\EngineerGeoModel\index.vue
 * @Description: 
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->

<template>
  <div>
    <div class="select">
      <select v-model="selectedOption" @change="handleSelectChange">
        <option v-for="(item, key) in options" :key="key" :value="item.value">{{ item.label }}</option>
      </select>
    </div>
    <GeologyIntro v-if="GeologyIntroPanel"></GeologyIntro>
  </div>
</template>

<script lang="ts" setup>
import EngineerGeoSceneConfig from './Config/scene_EngineerGeoModel.json';
import { loadMap } from '@/utils/Maps/MapSource';
import { loadCWT } from '@/utils/Maps/TerrainSource';
import { generateDTGlobeConfig, removeFromDTGlobeConfig, loadFromDTGlobeConfig } from './Utils/Layer';
import { ipServer } from './Services/ServiceProperties';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { setCameraViewePoint } from '../Layout/Tools/InitScene';
import GeologyIntro from './Component/GeologyIntro.vue';
import EventBus from './Utils/EventBus';

let eventBus = new EventBus();

// 初始化下拉框选项
const options = ref([
  { label: '康定二号工程地质模型', value: 'option1' },
  { label: '色季拉山地质模型', value: 'option2' },
  // { label: '模型3', value: 'option3' },
  // { label: '模型4', value: 'option4' },
]);

// 将 options 转换为一个对象
const optionsValueMap = options.value.reduce((acc, cur) => {
  acc[cur.value] = cur.label;
  return acc;
}, {});

// 设置默认选中的选项
const selectedOption = ref(options.value[0].value);
const GeologyIntroPanel = ref(false);

const viewPortMap = new Map([
  [
    '康定二号工程地质模型',
    {
      heading: 0.4877452913349529,
      pitch: -0.12890153648127423,
      roll: 0.001371713534783936,
      longitude: 101.7953831,
      latitude: 29.9689476,
      height: 5268.1536498,
    },
  ],
  [
    '色季拉山地质模型', // 模型2的视角配置
    {
      heading: -0.6,
      pitch: -0.05,
      roll: -0.06,
      longitude: 94.648242, // 经度
      latitude: 29.60419, // 纬度
      height: 6285.088439, // 高度
    },
  ],
]);

let layerUids = [];

// 处理模型选择变化时的函数
const handleSelectChange = (event) => {
  const value = event.target.value;

  // 清除当前场景
  if (layerUids.length) {
    let viewer = DTScopeEngine.viewer;
    removeFromDTGlobeConfig(viewer, layerUids);
    layerUids = [];
  }

  // 根据选择显示不同的内容
  if (value === 'option1') {
    GeologyIntroPanel.value = true;
  } else {
    GeologyIntroPanel.value = false;
  }

  // 加载新场景
  const callback = () => {
    let viewer = DTScopeEngine.viewer;
    loadMap(viewer);
    eventBus.on('clearTrash', loadCWT(viewer));

    initScene(viewer, optionsValueMap[value]);
  };

  DTScopeEngine.getViewer(callback);
};

/**
 * 初始化场景
 * @param {*} viewer cesium viewer对象
 * @param {*} modelname 地质模型名称
 */
function initScene(viewer, modelname) {
  let sceneConfig;
  let config = generateDTGlobeConfig(ipServer, EngineerGeoSceneConfig[modelname]);
  sceneConfig = config.dtglobeCzml;
  layerUids = config.layerUids;

  let viewPort = viewPortMap.get(modelname);

  // 加载地质模型
  let loadingPromise = loadFromDTGlobeConfig(viewer, sceneConfig);
  loadingPromise.then(() => {
    console.info(sceneConfig);
  });

  // 设置相机视角
  if (viewPort) {
    setCameraViewePoint(viewer, viewPort, 2);
  }
}

onMounted(() => {
  // 初始化加载默认模型
  handleSelectChange({ target: { value: selectedOption.value } });
});

onBeforeUnmount(() => {
  // 清理场景
  if (layerUids.length) {
    let viewer = DTScopeEngine.viewer;
    removeFromDTGlobeConfig(viewer, layerUids);
    layerUids = [];
    eventBus.emit('clearTrash');
  }
});
</script>

<style lang="scss" scoped>
.select {
  position: absolute;
  top: 9vh;
  left: 15vw;
  z-index: 100;

  select {
    width: 250px;
    height: 40px;
    border-radius: 10px;
    border-color: #033355;
    color: white;
    font-size: 18px;
    text-align: center;
    background-color: #033355;

    option {
      font-size: 15px;
      text-align: center;
      background-color: #033355;
    }
  }
}
</style>

<!--
 * @Author: 枫林残忆
 * @Date: 2024-03-01 14:14:24
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2026-01-22 20:35:47
 * @FilePath: \yueyueweida\src\views\SceneManagement\GeologyModel\Component\Region.vue
 * @Description: 
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<script lang="ts" setup>
import SceneConfigLayer from '../Config/scene_regionGeology.json';
import { onBeforeUnmount, ref } from 'vue';
import Legend from './Region/Legend.vue';
import axios from 'axios';

import { DTScopeEngine } from '@/utils/Common/Viewer';

import { generateDTGlobeConfig, removeFromDTGlobeConfig, generateInsarConfig, loadFromDTGlobeConfig } from '../Utils/Layer';
import { ipServer, regionClipUrl } from '../Services/ServiceProperties';

import KmlData from '../Config/geology.json';
import RoamPoints from '../Config/region_geology_roam.json';

import EventBus from '../Utils/EventBus';
import RoamControl from '../Utils/RoamControl';

let layerUids;
let eventBus = new EventBus();
const roamPanel = ref(true);

async function initScene(viewer) {
  let sceneConfig;
  let config = generateDTGlobeConfig(ipServer, SceneConfigLayer);
  sceneConfig = config.dtglobeCzml;
  layerUids = config.layerUids;

  let loadingPromise = loadFromDTGlobeConfig(viewer, sceneConfig);
  loadingPromise.then(() => {
    // console.info('图层加载完毕');
  });

  let res = await axios.get(ipServer + '/' + regionClipUrl);

  generateInsarConfig(ipServer, KmlData);
  // loadKml(viewer, KmlData);
  // let clippingData = res.data.data;

  // let cartographics = [];
  // let cartesians = [];
  // clippingData.forEach((item) => {
  //   cartographics.push(Cartographic.fromDegrees(item.x, item.y));
  // });

  // getCarographicWithHeight(cartographics).then((cartographicsWithHeight) => {
  //   cartographicsWithHeight.forEach((item) => {
  //     cartesians.push(cartographicToCartesian3(item));
  //   });
  //   loadClip(viewer, cartesians);
  // });
}

const changeDisaster = async (title) => {
  eventBus.emit('subSceneClearTrash'); // 清除之前的图层
  let roam = new RoamControl(DTScopeEngine.viewer);

  roam.setStatusCallback((msg) => {
    console.log('漫游加载完毕');
  });

  roam.setPlayNextStage(() => {
    return;
  });

  roam.startMapRoam(RoamPoints);
};

/**
 * @description: 外部界面调用->手动控制状态
 * @return {*}
 */
eventBus.on('region', (status) => {
  let viewer = DTScopeEngine.viewer;
  if (status) {
    initScene(viewer);
  } else {
    let viewer = DTScopeEngine.viewer;
    removeFromDTGlobeConfig(viewer, layerUids);
    layerUids = [];
    eventBus.emit('subSceneClearTrash');
  }
});

onBeforeUnmount(() => {
  let viewer = DTScopeEngine.viewer;
  removeFromDTGlobeConfig(viewer, layerUids);
  layerUids = [];
});

let emit = defineEmits(['closeWidget']);
</script>

<template>
  <div>
    <!-- <Legend></Legend> -->
  </div>
</template>

<style lang="scss" scoped>
.disaster-panel {
  position: fixed;
  top: 80px;
  left: 240px;
  z-index: 10;
  width: 200px;
  padding-bottom: 5px;
	border: 1px solid rgb(8 175 164 / 83%);
	border-radius: 5px;
	background-color: rgb(25 86 94 / 70%);

  &-title {
    position: relative;
    width: 100%;
    height: 40px;
		border-bottom: 1px solid rgb(8 175 164 / 83%);


    // background: url('../Assets/svg/ddh-disaster-panel-title-bg.svg') no-repeat;
    // background-size: 100% 100%;

    span {
      position: absolute;
      top: 0;
      left: 10px;
      height: 100%;
      line-height: 40px;
      font-size: 16px;
      font-weight: 500;
			color: white;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      left: calc(100% - 30px);
      width: 20px;
      height: 20px;
      line-height: 40px;
      background: url('../Assets/svg/close.svg') no-repeat;
      background-position: center;
			background-size: 80%;

      &:hover {
        cursor: pointer;
      }
    }
  }

  &-item {
    display: flex; /* 添加flex布局 */
    width: 156px;
    height: 50px;
    margin: 5px auto;
		padding-top: 5px;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 500;

    // background: linear-gradient(to bottom, rgb(2 227 239 / 45.8%), rgb(2 146 153 / 35.3%)); /* 添加渐变色 */
    // box-shadow: 0 10px 20px rgb(255 255 255 / 66.8%), 0 6px 6px rgb(255 255 255 / 64.7%);

    &-bg {
      display: flex; /* 添加flex布局 */
      width: 100%;
      height: 100%;
			border-radius: 10px;
			border-right: 2px solid #ddd;
			border-left: 2px solid #ddd;
      justify-content: center;
      align-items: center;

      /* 添加文字阴影 */
      color: white;
      text-shadow: 2px 2px 4px rgb(0 0 0);
      background-size: 50%;
      transition: all 0.3 ease-in-out;

      &:hover {
				border-left: 2px solid rgb(25 255 236);
				border-right: 2px solid rgb(25 255 236);
				border-radius: 10px;
				color: rgb(25 255 236);
        background-position: center center;
        background-size: 110%;
        cursor: pointer;
        transform: translateY(-1px);
      }

			&:active {
        transform: translateY(2px);
			}
    }
  }
}
</style>

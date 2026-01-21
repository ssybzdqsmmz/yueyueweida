<!--
 * @Author: Lincong-pro
 * @Date: 2024-01-05 15:38:18
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-20 16:43:43
 * @FilePath: \Geology-v3\src\views\SceneManagement\FullLine\index.vue
 * @Description: 
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import {
  // @ts-ignore
  Viewer,
  Matrix4,
  ImageryLayer,
  WebMapServiceImageryProvider,
  GeoJsonDataSource,
  Cartographic,
  Cartesian3,
  BoundingSphere,
  ClippingPlaneCollection,
  ClippingPlane,
  Transforms,
  HeadingPitchRange,
  Color,
} from 'Cesium';

import { loadCenterLine } from '@/views/SceneManagement/GeologyModel/Services/InitScene';
import RoamControl from './Utils/RoamControl';
import WEventBus from '../Layout/Tools/WEventBus';
import { animation } from './animate';
import EventBus from './Utils/EventBus';
import { onStart, onComplete, loadingLabelAndModel } from './Services/SceneLogic';
import { initialViewPort, ipServer, centerLineUrl } from './Services/ServiceProperties';
import Legend from './Components/Legend.vue';
import PieChart from './Components/PieChart.vue';
import BarChart from './Components/BarChart.vue';
import RegionGeology from './Config/scene_regionGeology.json';
import { loadCWT } from '@/utils/Maps/TerrainSource';
import {
  loadWorldOcean,
  generateDTGlobeConfig,
  removeFromDTGlobeConfig,
  loadFromDTGlobeConfig,
  generateKmlConfig,
  loadFromKmlConfig,
  loadDisasterFromKmlConfig,
  loadFromGeojson,
} from './Utils/Layer';
import { loadingEvents } from '@/views/SceneManagement/Layout/Components/events';
import DisasterKmlConfig from './Config/disasterkml.json';
import AppConfig from '@/config/AppConfig';

let weventBus = new WEventBus();
let eventBus = new EventBus(); // 局部场景通信
const route = useRoute();
// const pieShow = ref(false);

const roaming = () => {
  let viewer: Viewer = DTScopeEngine.viewer;

  let InitializeLayer = animation[0].layers;
  InitializeLayer.forEach((layerName) => {
    let kmlDataSource = viewer.dataSources.getByName(layerName);
    kmlDataSource[0].show = true;
  });
  weventBus.emit('changeLoadingText', '加载成功');
  let roam = new RoamControl(DTScopeEngine.viewer);
  roam.setStatusCallback((msg) => {
    weventBus.emit('changeLoadingText', msg);
  });
  let index = 0;
  roam.setPlayNextStage(async () => {
    //调用停下来查看->回调函数
    await animation[index].callback();
    viewer.camera.lookAtTransform(Matrix4.IDENTITY);
    ++index;
    if (index < animation.length) {
      let layers = animation[index].layers;
      weventBus.emit('changeLoadingText', '准备开始加载图层');
      layers.forEach((layerName) => {
        let kmlDataSource = viewer.dataSources.getByName(layerName);
        kmlDataSource[0].show = true;
      });
      // 播放下一帧动画
      setTimeout(() => {
        weventBus.emit('changeLoadingAnimate', false); // 关闭过渡动画
        roam.startMapRoam(animation[index].animationPoint);
      }, 2000);
      weventBus.emit('changeLoadingAnimate', true); // 显示过渡动画
      weventBus.emit('changeLoadingText', '加载成功');
    } else {
      onComplete(viewer, initialViewPort);
    }
  });

  weventBus.emit('changeLoadingText', '开始漫游');
  roam.startMapRoam(animation[index].animationPoint);
};

const initScene = (() => {
  const initMap = new Map([
    ['region', disasterScene],
    // ['surface', surface],
  ]);
  return () => {
    let item = route.query.item;
    let cb = initMap.get(item as string);
    cb();
  };
})();
// 桥梁-隧道分级分层数据
let bridge_tunnel_URL = '/FullLine/Line/geojson/桥隧车站分级.geojson';
let administrativeURL = '/FullLine/Line/json/cz_administration.geojson';
let disasterKmlConfig = generateKmlConfig(ipServer, DisasterKmlConfig);

async function disasterScene() {
  let viewer = DTScopeEngine.viewer;
  loadFromGeojson(viewer, ipServer, administrativeURL); // 加载行政区划底图
  eventBus.once('clearTrash', loadCenterLine(viewer, ipServer, centerLineUrl)); // 清理黄色路线
  // weventBus.emit(loadingEvents.changeLoadingWidget, false);
  // removeFromDTGlobeConfig(viewer, layerUids);
  // pieShow.value = true;
  weventBus.emit(loadingEvents.changeLoadingWidget, true);
  // eventBus.once('clearTrash', await loadingLabelAndModel(viewer));
  // 修改加载逻辑太卡了，改成异步加载
  eventBus.once('clearTrash', loadDisasterFromKmlConfig(DTScopeEngine.viewer, disasterKmlConfig)); // 加载地质灾害点
  // eventBus.on('clearTrash', loadCWT(viewer));
  // eventBus.once('clearTrash', loadWorldOcean(viewer)); // 白色底图
  let start = onStart(viewer, initialViewPort);
  eventBus.once('clearTrash', start.trashCb);
  promises = start.promises;
  Promise.all(promises).then(() => {
    weventBus.emit(loadingEvents.changeLoadingWidget, false);
  });

  return () => {
    Promise.all(promises).then(() => {
      weventBus.emit(loadingEvents.changeLoadingWidget, false);
    });
  };
}
let layerUids = [];

function addGeo(param) {
  let viewer = DTScopeEngine.viewer;
  let sceneConfig;
  let config = generateDTGlobeConfig(ipServer, param);
  sceneConfig = config.dtglobeCzml;
  layerUids = config.layerUids;
  // 使用setView方法立即设置视角
  const position = Cartesian3.fromDegrees(97.584432, 30.2050015, 1600000);
  const viewing = {
    destination: position,
    orientation: {
      // @ts-ignore
      heading: Math.toRadians(0.0),
      // @ts-ignore
      pitch: Math.toRadians(-90.0),
      roll: 0.0,
    },
  };
  viewer.camera.setView(viewing);
  // TODO 加载断裂带和地层模型
  loadFromDTGlobeConfig(viewer, sceneConfig);
  return viewer.DTScene.layers.forEach((layers) => {
    layers.values.forEach((layer) => {
      viewer.DTScene.removeLayer(layer);
    });
  });
}

async function surface() {
  // pieShow.value = false;
  let viewer = DTScopeEngine.viewer;
  let disasterKmlConfig = generateKmlConfig(ipServer, DisasterKmlConfig);
  // eventBus.once('clearTrash', loadDisasterFromKmlConfig(DTScopeEngine.viewer, disasterKmlConfig)); // 加载地质灾害点
  eventBus.once('clearTrash', loadGrandCanyon()); // 裁剪地形
  //加载地质和断裂带模型
  eventBus.once('clearTrash', addGeo(RegionGeology));
}

watch(
  () => route.query,
  () => {
    initScene();
  }
);

let promises;

onMounted(() => {
  const callback = async () => {
    initScene();
  };
  DTScopeEngine.getViewer(callback);
});

/**
 * @description: 子场景离开之前的操作
 * @return {*}
 */
onUnmounted(() => {
  let viewer = DTScopeEngine.viewer;
  removeFromDTGlobeConfig(viewer, layerUids);
  layerUids = [];
  viewer.entities.removeAll();
  console.log(viewer);

  eventBus.emit('clearTrash'); // 随便哪个topic都可以-自动清除
});

/**
 * @description: 启动漫游
 * @return {void}
 */
const startRoam = () => {
  roaming();
};

const data = [
  {
    color: '#98e9ec',
    label: '冰湖',
  },
  {
    color: '#0ccfd4',
    label: '冰川',
  },
  {
    color: '#de7a7a',
    label: '斜坡变形区',
  },
  {
    color: '#5acb71',
    label: '稳定历史变形破坏区',
  },
  {
    color: '#e69a1a',
    label: '复活历史变形破坏区',
  },
];

let edgeStylingEnabled = false;
let clippingPlanesEnabled = true;

function loadGrandCanyon() {
  let options = {
    //@ts-ignore
    url: IonResource.fromAssetId(1, {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlODE0MTRjZC0zZjQ3LTQxNTctYjE0NC05NGY1MjA0ZDgxYmMiLCJpZCI6OTg4MjAsImlhdCI6MTY4NTE2MjA1Mn0.FxQ9MoKycjkrZFuExULXjjgjHVxYTQ4qsSieZLLjWyQ',
      server: 'https://api.com',
    }),
    requestVertexNormals: false,
    requestWaterMask: false,
  };
  let viewer = DTScopeEngine.viewer;
  let globe = DTScopeEngine.viewer.scene.globe;
  // 获取所有影像图层
  let layers = viewer.imageryLayers;
  let numLayers = layers.length;

  // 循环遍历每个影像图层，并设置色调为黑色
  for (let i = 0; i < numLayers; ++i) {
    let layer = layers.get(i);
    layer.saturation = 0; // 设置饱和度为0，变为黑白
    layer.brightness = 0.1; // 设置亮度为0，变为黑色
  }

  const position = Cartographic.toCartesian(Cartographic.fromDegrees(97.584432, 30.2050015, 3000));
  const distance = 800000.0;
  const boundingSphere = new BoundingSphere(position, distance);

  globe.clippingPlanes = new ClippingPlaneCollection({
    modelMatrix: Transforms.eastNorthUpToFixedFrame(position),
    planes: [
      new ClippingPlane(new Cartesian3(1.0, 0.0, 0.0), 699000),
      new ClippingPlane(new Cartesian3(-1.0, 0.0, 0.0), 699000),
      new ClippingPlane(new Cartesian3(0.0, 1.0, 0.0), 233000),
      new ClippingPlane(new Cartesian3(0.0, -1.0, 0.0), 233000),
    ],
    unionClippingRegions: true,
    edgeWidth: edgeStylingEnabled ? 1.0 : 0.0,
    edgeColor: Color.WHITE,
    enabled: clippingPlanesEnabled,
  });
  globe.backFaceCulling = false;
  globe.showSkirts = false;

  DTScopeEngine.viewer.camera.viewBoundingSphere(boundingSphere, new HeadingPitchRange(0.5, -0.5, boundingSphere.radius * 5.0));
  DTScopeEngine.viewer.camera.lookAtTransform(Matrix4.IDENTITY);

  // @ts-ignore
  viewer.terrainProvider = new CesiumTerrainProvider(options); // 设置地形
  // terrainTransparent = new DTTerrainTransparent({ viewer, alpha: 0 }); //开启地形透明并设置透明度
  viewer.scene.skyBox.destroy(); // 删除星空

  return () => {
    // @ts-ignore
    globe.clippingPlanes = undefined; //清除裁剪平面
  };
}
</script>

<template>
  <div>
    <Legend :data="data" :round="true"></Legend>
    <!-- <el-button type="success" class="roam-btn" @click="startRoam">开始漫游</el-button> -->
    <!-- <PieChart v-if="pieShow" /> -->
    <!-- <PieChart /> -->
    <!-- <OnDown v-if="!pieShow"></OnDown> -->
    <BarChart />
  </div>
</template>

<style lang="scss" scoped>
.roam-btn {
  position: absolute;
  bottom: 150px;
  right: 140px;
  z-index: 10;
}
</style>

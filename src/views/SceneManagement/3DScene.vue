<!--
 * @Date: 2023-03-01 12:57:59
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2026-01-22 10:03:54
 * @FilePath: \yueyueweida\src\views\SceneManagement\3DScene.vue
-->
<template>
  <div id="main">
    <Header v-if="uiConfig.header"></Header>
    <LayerPanel v-if="uiConfig.layerPanel"></LayerPanel>
    <Loading></Loading>
    <AnimateLabel></AnimateLabel>
    <ToolBox v-if="toolBtn"></ToolBox>
    <RoamControl v-if="roamBtn"></RoamControl>
    <RollShutter v-if="rollBtn"></RollShutter>
    <TerrainExcave v-if="terrainBtn"></TerrainExcave>
    <Application v-if="appBtn"></Application>
    <!-- <el-button class="home-btn" @click="backToGlobe"></el-button> -->
    <DTGlobe />
    <!-- <OriginCesiumVoxel></OriginCesiumVoxel> -->
    <RouterView />
    <Legend />
    <LayerSelector />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, getCurrentInstance, ref } from 'vue';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { adjustLayerAndView } from './Layout/Tools/InitScene';
import Header from './Layout/Header.vue';
import LayerPanel from './Layout/LayerPanel.vue';
import Loading from './Layout/Components/Loading.vue';
import AnimateLabel from './Layout/Components/AnimateLabel.vue';
import ToolBox from './Layout/Components/ToolBox.vue';
import RoamControl from './Layout/Components/RoamControl.vue';
import RollShutter from './Layout/Components/RollShutter.vue';
import Application from './Layout/Components/Application.vue';
import TerrainExcave from './Layout/Components/TerrainExcave.vue';
import DTGlobe from '@/components/DTGlobe/DTGlobe.vue';
import Legend from './Layout/Components/Legend.vue';
// import KnowledgeVisual from '@/views/Knowledge/KnowledgeVisual.vue';
// import OriginCesiumVoxel from './Tests/OriginCesiumVoxel.vue';

import UIConfig from '@/config/UIConfig';

import { Color, GeoJsonDataSource, ConstantProperty, NearFarScalar, Cartesian3 } from 'Cesium';
import { scaleChange, updateScale } from './Layout/Tools/PostRender';
import WEventBus from './Layout/Tools/WEventBus';
import router from '@/router';
import { loadMap } from '@/utils/Maps/MapSource';
import { generateKmlConfig, loadFromKmlConfig } from './Layout/Tools/Layer';
import { adjustPointLabel } from './Layout/Tools/adjustlable';
// 添加沿线车站点位和对应名称标签
import KmlLayerConfig from './Layout/Config/kmlLayer.json';
import LODLabel from './Layout/Config/LODLabel.json';
import { ipServer, centerLineUrl } from './Layout/Service/ServiceProperties';
import { loadingEvents } from './Layout/Components/events';
import { loadCenterLine } from '@/views/SceneManagement/GeologyModel/Services/InitScene';

let uiConfig = new UIConfig().uiConfig;
const ctx = getCurrentInstance();
const _this = ctx.appContext.config.globalProperties;
const toolBtn = ref(false);
const roamBtn = ref(false);
const rollBtn = ref(false);
const terrainBtn = ref(false);
const appBtn = ref(false);
// const knowledge = ref(false);
const graph = ref(null);

let animateId = null;

let eventBus = new WEventBus();
eventBus.addExcludeFilter('updateLabel'); // 不调用clearTrash回调
eventBus.addExcludeFilter(loadingEvents.changeLoadingWidget);

eventBus.on('spaceAnalysis', () => {
  toolBtn.value = !toolBtn.value;
});
eventBus.on('roaming', () => {
  roamBtn.value = !roamBtn.value;
});
eventBus.on('shutter', () => {
  rollBtn.value = !rollBtn.value;
});
eventBus.on('terrain', () => {
  terrainBtn.value = !terrainBtn.value;
});
eventBus.on('application1', () => {
  appBtn.value = !appBtn.value;
});

const adjustLabel = (function () {
  let roadDataSource;
  let stationDataSource;
  let viewer;
  return {
    callback: (lod: string) => {
      if (!roadDataSource) {
        viewer = DTScopeEngine.viewer;
        roadDataSource = viewer.dataSources.getByName('地名路段')[0];
        stationDataSource = viewer.dataSources.getByName('沿线车站点')[0];
        if (!roadDataSource) {
          return; // 图层未初始化完毕
        }
        if (!stationDataSource) {
          return; // 图层未初始化完毕
        }
      }
      for (let i = 0; i < roadDataSource.entities.values.length; i++) {
        let group = roadDataSource.entities.values[i];
        if (typeof group.label != 'undefined') {
          let text = group.label.text._value;
          let labels = LODLabel[lod];
          if (labels.includes(text)) {
            group.label.show = true;
            group.label.scaleByDistance = new NearFarScalar(6000, 0.6, 30000, 1);
            // 将文本转换为竖向显示
            // let verticalText = text.split('').join('\n');
            // group.label.text = new ConstantProperty(verticalText);
            // 调整颜色
            if (text.includes('道')) {
              group.label.fillColor = Color.fromBytes(0, 102, 164);
              group.label.font = 'bold 13px sans-serif';
              group.label.outlineColor = Color.WHITE; // 设置边框颜色
              group.label.outlineWidth = 1; // 设置边框宽度
              // group.label.style = 'vertical'// 设置文字竖向显示
            } else if (text.includes('桥')) {
              group.label.fillColor = Color.fromBytes(230, 46, 0);
              group.label.font = 'bold 13px sans-serif';
              group.label.outlineColor = Color.WHITE; // 设置边框颜色
              group.label.outlineWidth = 1; // 设置边框宽度
            } else {
              group.label.fillColor = Color.fromBytes(37, 139, 35);
              group.label.font = 'bold 15px sans-serif';
              group.label.outlineColor = Color.WHITE; // 设置边框颜色
              group.label.outlineWidth = 2; // 设置边框宽度
              // group.label.style = 'vertical'// 设置文字竖向显示
            }
          } else {
            group.label.show = false;
          }
        }
      }
      for (let i = 0; i < stationDataSource.entities.values.length; i++) {
        let group = stationDataSource.entities.values[i];
        if (typeof group.label != 'undefined') {
          let text = group.label.text._value;
          let labels = LODLabel[lod];
          if (labels.includes(text)) {
            group.label.show = true;
            group.label.scaleByDistance = new NearFarScalar(6000, 0.6, 30000, 1);
            // 调整颜色
            if (text.includes('站')) {
              group.label.fillColor = Color.fromBytes(255, 90, 0);
              group.label.font = 'bold 15px sans-serif';
              group.label.outlineColor = Color.WHITE; // 设置边框颜色
              group.label.outlineWidth = 1; // 设置边框宽度
              // group.label.style = 'vertical'// 设置文字竖向显示
            } else {
              group.label.fillColor = Color.fromBytes(37, 139, 35);
              group.label.font = 'bold 15px sans-serif';
              group.label.outlineColor = Color.WHITE; // 设置边框颜色
              group.label.outlineWidth = 2; // 设置边框宽度
              // group.label.style = 'vertical'// 设置文字竖向显示
            }
          } else {
            group.label.show = false;
          }
        }
      }
      if (!roadDataSource.show) {
        roadDataSource.show = true;
      }
      if (!stationDataSource.show) {
        stationDataSource.show = true;
      }
    },
    clearTrash: () => {
      viewer.dataSources.remove(roadDataSource, true);
      roadDataSource = undefined;
      viewer.dataSources.remove(stationDataSource, true);
      stationDataSource = undefined;
    },
  };
})();

function initScene() {
  let viewer = DTScopeEngine.viewer;
  viewer.scene.globe.depthTestAgainstTerrain = false;

  let kmlConfig = generateKmlConfig(ipServer, KmlLayerConfig); // 添加沿线车站点位和对应名称标签
  loadMap(viewer);

  eventBus.once('clearTrash', loadFromKmlConfig(viewer, kmlConfig)); // 清理垃圾，添加沿线车站点位和对应名称标签
  eventBus.once('clearTrash', loadCenterLine(viewer, ipServer, centerLineUrl)); // 清理黄色路线
  eventBus.once('clearTrash', adjustLayerAndView(viewer)); // 注册垃圾回调函数
  eventBus.once('clearTrash', adjustPointLabel.clearTrash);

  let scaleChangeBind = scaleChange.bind(null, viewer);
  let updateScaleBind = updateScale.callback.bind(null, viewer);
  eventBus.once('clearTrash', updateScale.clearTrash); // 清除比例尺

  viewer.scene.postRender.addEventListener(scaleChangeBind);
  viewer.scene.postRender.addEventListener(updateScaleBind);
  eventBus.on('updateLabel', adjustPointLabel.callback);

  eventBus.once('clearTrash', () => {
    eventBus.off('updateLabel', adjustPointLabel.callback);
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.postRender.removeEventListener(scaleChangeBind); // 取消比例尺监听事件
    viewer.scene.postRender.removeEventListener(updateScaleBind);
  });

  // 定位到第一个点
  viewer.zoomTo(viewer.entities);
  console.log(viewer);
}

//加载DTGlobe
onMounted(() => {
  requestAnimationFrame(loopRender);
  DTScopeEngine.getViewer(initScene);
});

onUnmounted(() => {
  // eventBus.off('updateLabel', adjustLabel);
});

function loopRender() {
  animateId = requestAnimationFrame(loopRender);
  let viewer = DTScopeEngine.viewer;

  if (viewer) {
    viewer.render();
  }
}
const backToGlobe = () => {
  router.push('/home/3DScene');
  initScene();
};
</script>

<style lang="scss" scoped>
#main {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .ui-control {
    display: flex;
    position: absolute;
    top: 67px;
    left: 1278px;

    div {
      z-index: 100;
      width: 67px;
      height: 29px;
      margin-right: 32px;
      line-height: 29px;
      font-family: '微软雅黑';
      font-size: 18px;
      font-weight: 400;
      text-align: center;

      &:nth-of-type(3) {
        width: 82px;
      }

      cursor: pointer;
    }

    .on {
      border: none;
      color: #ffffff;
      background: linear-gradient(
        90deg,
        rgb(9 174 233 / 100%) 0%,
        rgb(9 174 233 / 100%) 0%,
        rgb(35 228 171 / 100%) 100%,
        rgb(35 228 171 / 100%) 100%
      );
    }

    .off {
      border: 1px solid rgb(12 179 223 / 100%);
      color: #0cb2e0;
      background-color: rgb(13 179 223 / 9.8%);
    }
  }

  .home-btn {
    position: absolute;
    top: 15px;
    right: 10px;
    z-index: 10;
    background: url('@/assets/images/dtglobe/home-btn.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>

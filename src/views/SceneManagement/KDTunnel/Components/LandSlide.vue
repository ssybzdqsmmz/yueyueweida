<!--
 * @Author: Lincong-pro
 * @Date: 2023-07-09 10:55:51
 * @LastEditors: anganao
 * @LastEditTime: 2024-02-28 16:54:23
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnel\Components\LandSlide.vue
 * @Description: 滑坡
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div class="container"></div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, onMounted, watch, onBeforeMount, onBeforeUnmount } from 'vue';
import { LANDSLIDE_SIMULATION_URL, MUDSLIDE_SIMULATION_URL } from '../Utils/landslide/url';
import LandslideSimulation from '../Utils/landslide/LandSlideSimulation.js';
import useKGraphics from '../Utils/landslide/useKGraph';
import { DTScopeEngine } from '@/utils/Common/Viewer';

let graphic = undefined;
let isFirstFlashing = true;

const config = {
  viewer: undefined,
  url: undefined, // 用于切换数据，不必多次复制一个组件
  loop: false,
};
let landslideData = undefined;
let loadingPromise = undefined;
let toParams = undefined; // 查询参数详情

const store = useStore();

console.log(store.state.simulation);
//  store里的state
let disasterFrame = store.state.simulation.disasterFrame;
let simulationPause = store.state.simulation.simulationPause;
let progressMax = store.state.simulation.progressMax;

// computed
const frame = computed({
  get() {
    return disasterFrame;
  },
  set(val) {
    store.commit('simulation/setDisasterFrame', val);
  },
});

const pauseStatus = computed({
  get() {
    return simulationPause;
  },
  set(val) {
    store.commit('simulation/setSimulationPause', val);
  },
});

onMounted(() => {
  setTimeout(() => {
    DTScopeEngine.getViewer(() => {
      isFirstFlashing = true;
      graphic = useKGraphics(DTScopeEngine.viewer);
    });
  }, 2000);
});

watch(disasterFrame, async (frame) => {
  if (simulationPause && landslideData) {
    pauseSimulation();
    landslideData.showFrameByS(frame);
  }

  if (frame > 10 && isFirstFlashing) {
    graphic.flashing(true);
    isFirstFlashing = false;
  }

  if (frame == progressMax) {
    isFirstFlashing = true;
    graphic.flashing(false);
  }
});
watch(pauseStatus, (status) => {
  if (status) {
    this.pauseSimulation();
  } else {
    this.goonSimulation();
  }
});

onBeforeUnmount(() => {
  clear();
  graphic.flashing(false);
  graphic.deactivate();
  graphic.destroy();
});
onMounted(() => {
  // isFirstFlashing = true
  DTScopeEngine.getViewer(() => {
    graphic = useKGraphics(DTScopeEngine.viewer);
  });
});

function simulation() {
  config.viewer = DTScopeEngine.viewer;
  config.loop = false;
  landslideData = new LandslideSimulation(config);
  loadingPromise = new Promise((resolves) => {
    landslideData.addPrimitivesByS().then(() => {
      // landslideData.showPrimitiveByS()
      resolve();
    });
  });
  loadingPromise.then(() => {
    this.$store.commit('simulation/setProgressMax', landslideData.frameNum - 1);
    // 播放动画
    landslideData.showPrimitiveByS();
  });
}
/**
 * @description: 清理场景数据
 */
function clear() {
  this.$store.commit('simulation/setSimulationPause', true);
  this.$store.commit('simulation/setDisasterFrame', 0);
  landslideData?.clearAll();
  landslideData = undefined;
}
/**
 * @description: 暂停模拟
 */
function pauseSimulation() {
  if (landslideData) {
    clearInterval(landslideData.intervalID);
    landslideData.pauseSimulation();
    // store.commit("dtglobe_store/setSimulationPause", true)
  }
}
/**
 * @description: 继续模拟
 */
function goonSimulation() {
  // 用户暂停 + 切换场景
  if (typeof landslideData === 'undefined' && this.pauseStatus == false) {
    this.updateUrl();
    this.simulation();
    return;
  } else if (typeof landslideData === 'undefined') {
    return;
  }
  landslideData.showPrimitiveByS();
  landslideData.goonSimulation();
  this.$store.commit('simulation/setSimulationPause', false);
}
/**
 * @description: 更新需要加载的数据
 */
function updateUrl() {
  let chooseData = undefined; // 更新 url 地址
  if (typeof toParams == 'undefined') {
    chooseData = this.$route.query.data;
  } else {
    chooseData = toParams.query.data;
  }
  switch (chooseData) {
    case 'landslide': {
      config.url = LANDSLIDE_SIMULATION_URL;
      break;
    }
    case 'mudslide': {
      config.url = MUDSLIDE_SIMULATION_URL;
      break;
    }
  }
}
</script>

<style scoped>
.container {
  position: absolute;
  top: 20vh;
  left: 5vw;
  z-index: 10;
}
</style>

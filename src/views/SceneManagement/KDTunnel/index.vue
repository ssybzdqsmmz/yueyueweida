<!--
 * @Author: changfanhao
 * @Date: 2023-03-21 09:29:11
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-07-19 10:58:12
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnel\index.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <ScrollBar v-if="landslideSwitch"></ScrollBar>
  <BadGeology v-if="badSwitch"></BadGeology>
  <SensorData v-if="sensorSwitch"></SensorData>
  <TabPage v-if="landslideSwitch" ref="tabPage"></TabPage>
  <canvas style="visibility: hidden; position: absolute" id="palette"></canvas>
</template>

<script setup lang="ts">
import { loadMap } from '@/utils/Maps/MapSource';
import { generateDTGlobeConfig, loadFromDTGlobeConfig, removeFromDTGlobeConfig } from './Utils/Layer';
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { loadTunnelRoaming } from './Services/Label';
import { host } from './Config/url';
import { loadClip, removeClip } from './Utils/LoadClip';

import WEventBus from '../Layout/Tools/WEventBus';
import SceneConfig12 from './Config/scene_12.json';
import ScrollBar from './Components/ScrollBar.vue';
import BadGeology from './Components/BadGeology.vue';
import SensorData from './Components/SensorData.vue';
import Cesium from 'Cesium';
import loadBLabel from '../Layout/Utils/kdinRoam/inLabel';
import TabPage from './Components/TabPage.vue';
import { getSensorLocationBySection } from '@/api/tky';
import SensorLabel from '../Layout/Utils/SensorLabel';
import EventBus from './Utils/EventBus';
import { Graphs } from '@/views/Knowledge/Utils/Graph';

let landslideSwitch = ref(false);
let badSwitch = ref(false);
let sensorSwitch = ref(false);

// 场景的实体，需要自己清除
let buildingctner = undefined;
let clipPrimitive = undefined;
const tabPage = ref(null);

//全局作用域-需要自己管理
let wEventBus = new WEventBus();
let eventBus = new EventBus();

const route = useRoute();

// 场景视角和图层
const scenePort = {
  default: {
    layers: ['全球基础影像', '正洞DSM_0415', 'DEM'],
    viewPort: {
      orientation: {
        heading: 5.83169407221878,
        pitch: -0.5118073628896624,
        roll: 6.281730512818843,
      },
      destination: [101.8843687, 29.9877681, 3516.9856335],
    },
  },
  base: {
    layers: ['全球基础影像', '正洞DSM_0415', 'DEM'],
    viewPort: {
      orientation: {
        heading: 5.83169407221878,
        pitch: -0.5118073628896624,
        roll: 6.281730512818843,
      },
      destination: [101.8843687, 29.9877681, 3516.9856335],
    },
  },
  sensor: {
    layers: ['全球基础影像', '正洞DSM_0415', 'DEM'],
    viewPort: {
      orientation: {
        heading: 5.272990534601375,
        pitch: -0.42470846419654373,
        roll: 6.280484947521462,
      },
      destination: [101.8829458, 29.9910321, 3503.6752762],
    },
  },
  debrisFlow: {
    layers: ['全球基础影像', '正洞DSM_0415', 'DEM'],
    viewPort: {
      orientation: {
        heading: 5.867284063598898,
        pitch: -0.5001946511910109,
        roll: 6.281847161037987,
      },
      destination: [101.8912865, 29.9748461, 4704.5771432],
    },
  },
  roam: {
    layers: ['全球基础影像', '正洞DSM_0415', 'DEM'],
    // viewPort: {
    //   orientation: {
    //     heading: 5.83169407221878,
    //     pitch: -0.5118073628896624,
    //     roll: 6.281730512818843,
    //   },
    //   destination: [101.8843687, 29.9877681, 3516.9856335],
    // },
  },
  badGeology: {
    layers: ['全球基础影像', '正洞DSM_0415', 'DEM'],
    viewPort: {
      orientation: {
        heading: 5.885042373865689,
        pitch: -0.622123542402754,
        roll: 6.28179794280587,
      },
      destination: [101.8934945, 29.9818325, 4232.2260731],
    },
  },
};

let models = generateDTGlobeConfig(host, SceneConfig12);

// 添加模型图层
DTScopeEngine.getViewer(() => {
  let loadingPromise = loadFromDTGlobeConfig(DTScopeEngine.viewer, models.dtglobeCzml);
  loadingPromise.then((res) => {
    // console.log(DTScopeEngine.viewer.DTScene);
  });
});

// 控制图层
function layerControl(layerNames) {
  DTScopeEngine.getViewer(() => {
    DTScopeEngine.viewer.DTScene.layers.forEach((layers) => {
      layers._array.forEach((layer) => {
        DTScopeEngine.viewer.DTScene.setLayerVisiability(layer, layerNames.indexOf(layer._label) !== -1);
      });
    });
  });
}
// 控制视角
function cameraControl(destination, orientation) {
  DTScopeEngine.getViewer(() => {
    let viewer = DTScopeEngine.viewer;
    viewer.camera.flyTo({
      //@ts-ignore
      destination: Cesium.Cartesian3.fromDegrees(...destination),
      orientation: orientation,
    });
  });
}

// 初始化场景
function initScene(item) {
  badSwitch.value = false;
  sensorSwitch.value = false;
  landslideSwitch.value = false;
  if (item === 'roam') {
    loadTunnelRoaming(DTScopeEngine.viewer, '12Ju');
  }
  if (item === 'debrisFlow') {
    landslideSwitch.value = true;
    badSwitch.value = true;
    nextTick(() => {
      tabPage.value.updateView(Graphs.DebrisflowHazard);
    });

    // wEventBus.emit('changeGraph', 'DebrisflowHazard');
  } else {
    landslideSwitch.value = false;
  }
  // if (item === 'badGeology') {
  //   badSwitch.value = true;
  // }
  if (item === 'sensor') {
    sensorSwitch.value = true;
  }

  layerControl(scenePort[item].layers);
  // 如果没有视角数据，则不跳转视角
  if (scenePort[item].viewPort !== undefined) {
    cameraControl(scenePort[item].viewPort.destination, scenePort[item].viewPort.orientation);
  }
}

onMounted(() => {
  DTScopeEngine.getViewer(() => {
    let viewer = DTScopeEngine.viewer;
    //loadCWT(viewer);
    // clipPrimitive = loadClip(viewer);
    loadMap(viewer);
    buildingctner = loadBLabel.loadBLabelSingle(viewer, 'scene');
    initScene(route.query.item);

    eventBus.on(
      'clearTrash',
      (() => {
        let sensorLabelTool = new SensorLabel(viewer);
        getSensorLocationBySection('CZSCZQ-2')
          .then((res) => {
            sensorLabelTool.loadLabel(res);
          })
          .catch((err) => {
            console.error(err);
          });

        return () => {
          sensorLabelTool.clearLabel();
        };
      })()
    );
  });
  // let paletteCanvasDom = document.getElementById('palette'); // volume
  // colours = new GradientEditor(paletteCanvasDom, () => {
});

/**
 * @description: 子场景离开之前的操作
 * @return {*}
 */
onBeforeUnmount(() => {
  let viewer = DTScopeEngine.viewer;
  removeFromDTGlobeConfig(viewer, models.layerUids);
  buildingctner.clearLabel('scene');
  removeClip(viewer, clipPrimitive);
  eventBus.emit('clearTrash'); // 随便哪个topic都可以-自动清除
});

onBeforeRouteUpdate((to) => {
  initScene(to.query.item);
});
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}
</style>

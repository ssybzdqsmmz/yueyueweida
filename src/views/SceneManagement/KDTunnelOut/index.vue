<script setup>
import { host } from './Config/url';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import BuildingLabel from './Utils/BuildingLabel';
import Roam from './Utils/Roam';
import { loadMap } from '@/utils/Maps/MapSource';
import { loadCWT } from '@/utils/Maps/TerrainSource';
import { generateDTGlobeConfig, loadFromDTGlobeConfig, removeFromDTGlobeConfig } from './Utils/Layer';
import SceneConfig18 from './Config/scene_18.json';
import bottomLeft from './Components/bottomLeft.vue';
import Right from './Components/right.vue';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { getSensorLocationBySection } from '@/api/tky';
import SensorLabel from '../Layout/Utils/SensorLabel';
import Graphy from './Components/graph.vue';

const route = useRoute();

let buildingctner = undefined;
let roamIns = undefined;
let digitShow = ref(false);
let models = generateDTGlobeConfig(host, SceneConfig18);

const scenePort = {
  default: {
    layers: ['全球基础影像', '02_出口测区_DSM_NEW', 'DEM'],
    viewPort: {
      orientation: {
        heading: 1.027526919286636,
        pitch: -0.5523626928341847,
        roll: 0.002927622558420495,
      },
      destination: [101.6909158, 30.0872517, 4070.6061094],
    },
  },
  base: {
    layers: ['全球基础影像', '02_出口测区_DSM_NEW', 'DEM'],
    viewPort: {
      orientation: {
        heading: 1.027526919286636,
        pitch: -0.5523626928341847,
        roll: 0.002927622558420495,
      },
      destination: [101.6909158, 30.0872517, 4070.6061094],
    },
  },
  fieldRoam: {
    layers: ['全球基础影像', '02_出口测区_DSM_NEW', 'DEM'],
  },
  tunnelRoam: {
    layers: ['全球基础影像', '02_出口测区_DSM_NEW', '04_折多山隧道_整体BIM', '点云_正洞衬砌_20210531', '点云_正洞开挖_20210602'],
  },
  tunnelDigit: {
    layers: [],
  },
};

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
  return new Promise((resolve) => {
    DTScopeEngine.getViewer(() => {
      let viewer = DTScopeEngine.viewer;
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(...destination),
        orientation: orientation,
        complete: () => {
          resolve('');
        },
      });
    });
  });
}

// 初始化场景
function initScene(item, viewer) {
  // 初始化数据
  digitShow.value = false;
  let globeShow = true;
  let skyAtmosphereShow = true;

  if (item === 'fieldRoam') {
    roamIns.fieldRoam(true, 'smartScenePath', host + '/CZSCZQ-3/LINE/json/geologicalGenrePath.json');
  }
  if (item === 'tunnelRoam') {
    roamIns.tunnelRoam(host + '/CZSCZQ-3/LINE/json/tunnelInner.json');
  }
  if (item === 'tunnelDigit') {
    digitShow.value = true;
    globeShow = false;
    skyAtmosphereShow = false;
  }

  DTScopeEngine.getViewer(() => {
    let viewer = DTScopeEngine.viewer;
    viewer.scene.globe.show = globeShow;
    viewer.scene.skyAtmosphere.show = skyAtmosphereShow;
  });

  layerControl(scenePort[item].layers);
  let promise;
  // 如果没有视角数据，则不跳转视角
  if (scenePort[item].viewPort !== undefined) {
    promise = cameraControl(scenePort[item].viewPort.destination, scenePort[item].viewPort.orientation);
  }
  return promise;
}
let sensorLabelTool;
let viewer;
onMounted(() => {
  DTScopeEngine.getViewer(() => {
    viewer = DTScopeEngine.viewer;
    buildingctner = BuildingLabel.loadBLabelSingle(viewer, host, '/CZSCZQ-3/LINE/json/buildingLabel.json', 'scene');
    roamIns = new Roam(viewer);
    // loadCWT(viewer);
    // loadMap(viewer);
    initScene(route.query.item, viewer).then(() => {
      sensorLabelTool = new SensorLabel(viewer);
      getSensorLocationBySection('CZSCZQ-3')
        .then((res) => {
          sensorLabelTool.loadLabel(res);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });
});

onBeforeUnmount(() => {
  removeFromDTGlobeConfig(viewer, models.layerUids);
  buildingctner.clearLabel('scene');
  viewer.scene.globe.show = true;
  viewer.scene.skyAtmosphere.show = true;
});

onBeforeRouteUpdate((to) => {
  console.log('路由更新了', to.query.item);
  initScene(to.query.item);

  // 确保sensorLabelTool已经初始化并且存在
  if (sensorLabelTool && typeof sensorLabelTool.clearLabel === 'function') {
    sensorLabelTool.clearLabel();
  } else {
    console.error('sensorLabelTool is not defined or does not have a clearLabel method');
  }
});
function roam() {
  roamIns.fieldRoam(true, 'smartScenePath', host + '/CZSCZQ-3/LINE/json/geologicalGenrePath.json');
}
function stopRoam() {
  roamIns.fieldRoam(false, 'smartScenePath', host + '/CZSCZQ-3/LINE/json/geologicalGenrePath.json');
}
</script>

<template>
  <div>
    <bottomLeft v-if="digitShow"></bottomLeft>
    <div class="roam" @click="roam">开始场景漫游</div>
    <div class="stopRoam" @click="stopRoam">停止场景漫游</div>
    <!-- <Graphy v-if="digitShow"></Graphy> -->
  </div>
</template>
<style>
.roam {
  position: absolute;
  top: 120px;
  right: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  font-size: 20px;
  background: rgb(20 76 82);
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
  transition: all 0.3s ease;
}

.roam:hover {
  background: rgb(8 96 105);
  cursor: pointer;
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
  transform: translateY(-2px);
}

.stopRoam {
  position: absolute;
  top: 190px;
  right: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  font-size: 20px;
  background: rgb(20 76 82);
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
  transition: all 0.3s ease;
}

.stopRoam:hover {
  background: rgb(8 96 105);
  cursor: pointer;
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
  transform: translateY(-2px);
}
</style>

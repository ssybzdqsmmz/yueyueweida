<template>
  <div class="roam-control">
    <div class="title">漫游场景</div>
    <div class="content" v-for="(item, index) of roamChooseData" :key="index" @click="roamTrigger(item)">
      <div class="img-border">
        <img class="roam-img" :src="item.img" />
      </div>
      <p class="roam-title">{{ item.name }}</p>
    </div>
  </div>
  <el-button class="button" @click="openRoamSelect">路由定制</el-button>

  <RoamSelect ref="roamCustom"></RoamSelect>
</template>

<script lang="ts" setup>
import { loadCWT } from '@/utils/Maps/TerrainSource';
import { generateDTGlobeConfig, loadFromDTGlobeConfig, removeFromDTGlobeConfig } from '../Utils/Layer';
import { roamingAreaMapping } from '../Utils/kdinRoam/Label';
import roamConfig from '../Config/roamConfig.json';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { ipServer } from '../Service/ServiceProperties';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import RoamSelect from './RoamEdit/RoamSelect.vue';
import { Cartesian3, Resource } from 'Cesium';
import loadBLabel from '../Utils/kdinRoam/inLabel';
import BuildingLabel from '../../KDTunnelOut/Utils/BuildingLabel';

import AllRoam from '../Utils/kdinRoam/AllRoam';

const router = useRouter();
let roamIns = undefined;
const roamCustom = ref(null);
let inLabel = undefined;
let outLabel = undefined;

const openRoamSelect = () => {
  roamCustom.value.openPanel();
};

const roamChooseData = ref([
  {
    name: '康定2号隧道入口工区',
    img: new URL('../Assets/roam/12jufield.png', import.meta.url).href,
    label: 'field12',
    router: ['/home/3DScene/kdtunnel', 'roam'],
  },
  {
    name: '康定2号隧道出口工区',
    img: new URL('../Assets/roam/18jufield.png', import.meta.url).href,
    label: 'field18',
    router: ['/home/3DScene/kdtunnelout', 'fieldRoam'],
  },
  {
    name: '康定2号隧道',
    img: new URL('../Assets/roam/18jutunnel.png', import.meta.url).href,
    label: 'tunnel18',
    router: ['/home/3DScene/kdtunnelout', 'tunnelRoam'],
  },
]);

const scenePort = {
  field18: {
    layers: ['全球基础影像', '03_出口测区_DSM_最新'],
    viewPort: {
      orientation: {
        heading: 1.027526919286636,
        pitch: -0.5523626928341847,
        roll: 0.002927622558420495,
      },
      destination: [101.6909158, 30.0872517, 4070.6061094],
    },
  },
  field12: {
    layers: ['全球基础影像', '正洞DSM_0415'],
    viewPort: {
      orientation: {
        heading: 5.867284063598898,
        pitch: -0.5001946511910109,
        roll: 6.281847161037987,
      },
      destination: [101.8912865, 29.9748461, 4704.5771432],
    },
  },
  tunnel18: {
    layers: ['全球基础影像', '03_出口测区_DSM_最新', '04_折多山隧道_整体BIM', '点云_正洞衬砌_20210531', '点云_正洞开挖_20210602'],
    viewPort: {
      orientation: {
        heading: 1.027526919286636,
        pitch: -0.5523626928341847,
        roll: 0.002927622558420495,
      },
      destination: [101.6909158, 30.0872517, 4070.6061094],
    },
  },
};

let models = undefined;
models = generateDTGlobeConfig(ipServer, roamConfig);
// 添加模型图层
DTScopeEngine.getViewer(() => {
  let loadingPromise = loadFromDTGlobeConfig(DTScopeEngine.viewer, models.dtglobeCzml);
  loadingPromise.then((res) => {
    // console.log(DTScopeEngine.viewer.DTScene);
  });
});

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
      destination: Cartesian3.fromDegrees(...destination),
      orientation: orientation,
    });
    viewer.camera.completeFlight();
  });
}

function initScene(label) {
  layerControl(scenePort[label].layers);
  roamIns?.clear();
  // // 如果没有视角数据，则不跳转视角
  // if (scenePort[item].viewPort !== undefined) {
  //   cameraControl(scenePort[item].viewPort.destination, scenePort[item].viewPort.orientation);
  // }
  if (label === 'field12') {
    roamIns.startRoam(roamingAreaMapping.get('12Ju'));
    // roamIns.startMapRoam(roamingAreaMapping.get('12Ju'));
  }
  if (label === 'field18') {
    Resource.fetchJson({ url: ipServer + '/CZSCZQ-3/LINE/json/geologicalGenrePath.json' }).then((res) => {
      if (res) {
        const data = res.roam['smartScenePath'].path;
        data[0].ViewPoint = {
          Position: data[0].Position,
          Orientation: data[0].Orientation,
        };
        // let roams = new RoamControl(DTScopeEngine.viewer);
        // roams.startMapRoam(data);
        roamIns.startRoam(data);
      }
    });
  }
  if (label === 'tunnel18') {
    Resource.fetchJson({ url: ipServer + '/CZSCZQ-3/LINE/json/tunnelInner.json' }).then((res) => {
      if (res) {
        let data = roamIns.dataWithoutHPR(res);
        roamIns.startRoam(data);
      }
    });
  }
}

function handleTunnel18Data(positions) {
  // 计算两两点间距离集合
  for (let i = 0; i < positions.length - 1; i++) {
    let prePosition = Cartesian3.fromDegrees(positions[i][0], positions[i][1], positions[i][2]);
    let currentPosition = Cartesian3.fromDegrees(positions[i + 1][0], positions[i + 1][1], positions[i + 1][2]);
    //dislist.push(Cesium.Cartesian3.distance(prePosition,currentPosition));
    positions[i + 1].dis = Cartesian3.distance(prePosition, currentPosition);
  }
  return positions;
}

function roamTrigger(item) {
  // 将路由切换到全局
  router.push('/home/3Dscene');
  DTScopeEngine.getViewer(() => {
    let viewer = DTScopeEngine.viewer;
    const cameraData = scenePort[item.label].viewPort;
    viewer.camera.flyTo({
      //@ts-ignore
      destination: Cartesian3.fromDegrees(...cameraData.destination),
      orientation: cameraData.orientation,
      duration: 0,
      complete: () => {
        initScene(item.label);
      },
    });
  });
}

// 路由守卫，如果路由跳转，则退出漫游
onBeforeRouteUpdate((to, from) => {
  if (to.name !== '3Dscene') {
    roamIns?.clear();
  }
});

onMounted(() => {
  DTScopeEngine.getViewer(() => {
    let viewer = DTScopeEngine.viewer;
    roamIns = new AllRoam(DTScopeEngine.viewer);
    inLabel = loadBLabel.loadBLabelSingle(viewer, 'roam');
    outLabel = BuildingLabel.loadBLabelSingle(viewer, ipServer, '/CZSCZQ-3/LINE/json/buildingLabel.json', 'roam');
  });
});

onBeforeUnmount(() => {
  let viewer = DTScopeEngine.viewer;
  roamIns?.clear();
  removeFromDTGlobeConfig(viewer, models.layerUids);
  inLabel.clearLabel('roam');
  outLabel.clearLabel('scene');
});
</script>

<style lang="scss" scoped>
.roam-control {
  position: absolute;
  top: 80px;
  right: 20px;
  z-index: 10;
  padding-top: 10px;
  background-color: rgb(25 86 94 / 70%);

  .title {
    width: 100%;
    font-size: 18px;
    text-align: center;
  }

  .content {
    display: flex;
    margin: 10px;
    flex-direction: column;
    align-items: center;

    &:hover {
      .img-border {
        .roam-img {
          transform: scale(1.2);
        }
      }
    }

    .img-border {
      width: 180px;
      height: 120px;
      margin-bottom: 5px;
      border: 1px solid rgb(2 36 40);
      overflow: hidden;

      .roam-img {
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease-out;
      }
    }
  }
}

.button {
  display: inline-block;
  position: absolute;
  right: 20px;
  bottom: 140px;
  z-index: 1;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  background: linear-gradient(to bottom, #4caf50, #45a049);
  cursor: pointer;
  box-shadow: 0 4px 6px rgb(0 0 0 / 10%);
}

.button:hover {
  background: linear-gradient(to bottom, #45a049, #4caf50);
}
</style>

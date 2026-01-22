<!--
 * @Author: 枫林残忆
 * @Date: 2024-03-01 09:54:09
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2026-01-22 19:00:24
 * @FilePath: \yueyueweida\src\views\SceneManagement\GeologyModel\index.vue
 * @Description: 
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<script lang="ts" setup>
import Region from './Component/Region.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router'; //监听页面的查询参数变化
import EventBus from './Utils/EventBus';
import { generateKmlConfig, loadFromKmlConfig, controlLayer } from './Utils/Layer';
import { loadCenterLine } from './Services/InitScene';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { ipServer, centerLineUrl } from './Services/ServiceProperties';
import { setCameraViewePoint } from '../Layout/Tools/InitScene';
import WEventBus from '../Layout/Tools/WEventBus';
import Tree from './Component/Tree.vue';
import TreeLayerXz from './Config/treeXizang.json';
import TreeLayerSc from './Config/treeSichuan copy.json';
import KmlLayerConfig from './Config/kmlLayer.json';
import LODLabel from './Config/LODLabel.json';
import * as Cesium from 'Cesium';
import GeologyMap from './Component/GeologyMap.vue';
import {loadCWT} from '@/utils/Maps/TerrainSource';
let TreeLayers = {
  TreeLayerXz,
  TreeLayerSc,
};
let eventBus = new EventBus();
let wEventBus = new WEventBus();
eventBus.addExcludeFilter('layerSwitch');

const regionPanelSwitch = ref(false);
const sitePanelSwitch = ref(false);
const constructionPanelSwitch = ref(false);

const route = useRoute();

const itemCallbackMapping = new Map<string, any>([
  [
    'region',
    () => {
      regionPanelSwitch.value = !regionPanelSwitch.value;
      eventBus.emit('region', regionPanelSwitch.value); // 子组件务必一定要处理
    },
  ],
  [
    'disaster',
    () => {
      sitePanelSwitch.value = !sitePanelSwitch.value;
      eventBus.emit('site', sitePanelSwitch.value);
    },
  ],
  [
    'insar',
    () => {
      constructionPanelSwitch.value = !constructionPanelSwitch.value;
      eventBus.emit('construction', constructionPanelSwitch.value);
    },
  ],
]);

const viewPortMap = new Map([
  [
    'region', //区域级视
    {
      heading: 5.8807812951724285,
      pitch: -0.9707719716781607,
      roll: 0.0029601410604227496,
      longitude: 97.1539438,
      latitude: 27.753415,
      height: 427086.2627582,
    },
  ],
  [
    'jinsha_insar',
    {
      heading: 3.1094021181521265,
      pitch: -0.8249888865810129,
      roll: 6.283027919525537,
      longitude: 98.9567103,
      latitude: 30.8022377,
      height: 14987.1558798,
    },
  ],
]);

function initScene(item) {
  let callback = itemCallbackMapping.get(item);
  if (callback) {
    callback();
  }
  let viewPort = viewPortMap.get(item);
  if (viewPort) {
    setCameraViewePoint(DTScopeEngine.viewer, viewPort, 2).then(() => {
      wEventBus.emit('changeGraph', 'LargeScaleGeology'); // 通知图谱显示器，你该加载数据了
    });
	}
	loadCWT(DTScopeEngine.viewer);
}

function adjustLabel(stationDataSource) {
  for (let i = 0; i < stationDataSource.entities.values.length; i++) {
    let group = stationDataSource.entities.values[i];
    if (typeof group.label != 'undefined') {
      let text = group.label.text._value;
      let labels = LODLabel['LOD3'];
      if (labels.includes(text)) {
        group.label.show = true;
        group.label.pixelOffset = new Cesium.Cartesian2(0, -100);
        // group.label.eyeOffset = new Cesium.Cartesian3(0, 1000, -3000); //@ts-ignore
        group.label.scaleByDistance = new Cesium.NearFarScalar(6000, 0.6, 30000, 1);
        group.label.font = 'bold';
      } else {
        group.label.show = false;
      }
    }
  }
  if (!stationDataSource.show) {
    stationDataSource.show = true;
  }
}

onMounted(() => {
  const callback = () => {
    let viewer = DTScopeEngine.viewer;

    eventBus.on('layerSwitch', (obj: { name: string; status: boolean }) => {
      controlLayer(viewer, obj.name, obj.status);
    });

    let kmlConfig = generateKmlConfig(ipServer, KmlLayerConfig);

    eventBus.once(
      'clearTrash',
      (() => {
        let currentDate = new Date();
        currentDate.setHours(20);
        currentDate.setMinutes(30);
        viewer.clock.currentTime = Cesium.JulianDate.fromDate(currentDate);
        return () => {
          viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date());
        };
      })()
    );

    eventBus.once('clearTrash', loadFromKmlConfig(viewer, kmlConfig));
    setTimeout(() => {
      let stationDataSource = viewer.dataSources.getByName('地名路段')[0];
      adjustLabel(stationDataSource);
    }, 1000);

    // eventBus.once('clearTrash', loadOpenStreetMap(viewer)); // 加载OpenStreetMap
    // loadCWT(viewer);
    // eventBus.once('clearTrash', loadWorldOcean(viewer)); // 清理纯白底图
    eventBus.once('clearTrash', loadCenterLine(viewer, ipServer, centerLineUrl)); // 清理黄色路线

    initScene(route.query.item);
  };
  DTScopeEngine.getViewer(callback);
});

onBeforeUnmount(() => {
  eventBus.emit('subSceneClearTrash'); // 子场景清除
  eventBus.emit('clearTrash'); // 随便哪个topic都可以-自动清除
});
</script>

<template>
  <Region v-show="regionPanelSwitch"></Region>
  <Tree init-layer-name="昌都至林芝地层模型" init-layer-value="fullline_region_model" title="区域地质模型列表" :layer-data="TreeLayers"> </Tree>
	<GeologyMap></GeologyMap>
</template>

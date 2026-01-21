<!-- 
	实现地质模型以及断裂带的显示和隐藏
 -->
<script lang="ts" setup>
import EventBus from '../Utils/EventBus';
import { fullLineFault, scFault, xzFault } from './faultInfo';
import * as Cesium from 'Cesium';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { onMounted, ref } from 'vue';
import { Events } from '../Utils/Events';
import bottomLeft from './zoneInfo/bottomLeft.vue';
// 下面是加载地质图的代码
import { generateDTGlobeConfig, loadFromDTGlobeConfig } from '@/views/SceneManagement/DaduRiver/Utils/Layer';
import { ipServer } from '@/views/SceneManagement/DaduRiver/Services/ServiceProperties';
// import SceneConfigLayer from '../Config/fullLineLayer.json'; // 地质云在线地质图配置文件

let eventBus = new EventBus();
const checkedLayersXz = ref<string[]>([]); // 多选框的状态
const checkedLayersSc = ref<string[]>([]);
const checkAllXz = ref(false); // "Check All" 的状态
const checkAllSc = ref(false);

const labels = new Map();
let faults;
// let geologyImgIonfig = generateDTGlobeConfig(ipServer, SceneConfigLayer);
// let sceneConfig = geologyImgIonfig.dtglobeCzml;

// 添加标签到视图中
function addLabels(data) {
  DTScopeEngine.getViewer(() => {
    let viewer = DTScopeEngine.viewer;
    faults = viewer.scene.primitives.add(new Cesium.LabelCollection());
    for (let i = 0; i < data.length; i++) {
      faults.add({
        position: Cesium.Cartesian3.fromDegrees(data[i].position[0], data[i].position[1]),
        text: data[i].name,
        font: '20px sans-serif',
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.4),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1000000),
        eyeOffset: new Cesium.Cartesian3(0, 0, -100000),
      });
    }
    labels.set('断裂带', faults);
  });
}

// 地质云服务数据列表相关代码
const checkAllGeologyMaps = ref(false);
const isIndeterminate = ref(false); // 控制中间态，也就是没有全选
const checkedGeologyMaps = ref([]); // 保存当前已经选中的图层
const GeologyMaps = ['全国100万地质图', '全国150万地质图', '全国250万地质图']; // 所有资源列表
//创建一个map对象，保存当前选中的图层的开关状态
let checkedGeologyMapsMap = new Map(); // 保存当前已经选中的图层

/**
 * 处理全选状态的改变
 *
 * @param val - 当前的全选状态，true 表示全选，false 表示取消全选
 */
const handleCheckAllChange = (val) => {
  checkedGeologyMaps.value = val ? GeologyMaps : [];
  console.log(checkedGeologyMaps);
  isIndeterminate.value = false;
};
/**
 * 处理选中的地质图层变化
 *
 * @param value ['全国100万地质图', '全国150万地质图', '全国250万地质图'] 表示当前选中的地质图层数组
 */
const handleCheckedCitiesChange = (value) => {
  const checkedCount = value.length; // 计数当前选中图层数量
  checkAllGeologyMaps.value = checkedCount === GeologyMaps.length; // 如果当前选中图层数量等于资源列表长度就说明已经全选
  isIndeterminate.value = checkedCount > 0 && checkedCount < GeologyMaps.length;

  // 1. 遍历所有图层，先全部隐藏（避免遗漏）
  checkedGeologyMapsMap.forEach((layer) => {
    layer.show = false;
  });

  // 2. 遍历选中的图层，显示对应的图层
  value.forEach((layerName) => {
    const layer = checkedGeologyMapsMap.get(layerName);
    if (layer) {
      layer.show = true; // 显示选中的图层
    } else {
      console.warn(`图层 "${layerName}" 不存在！`);
    }
  });
};

const TILE_MATRIX_LABELS = [
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:0',
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:1',
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:2',
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:3',
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:4',
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:5',
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:6',
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:7',
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:8',
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:9',
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:10',
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:11',
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:12',
  'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB:13',
];

// GEOLOGY_MAP_CONFIGS管理地质图的配置信息
const GEOLOGY_MAP_CONFIGS = [
  {
    name: '全国100万地质图',
    url: 'https://igss.cgs.gov.cn:6160/igs/rest/ogc/全国100万地质图_20210330_rpam5kdJ/WMTSServer/1.0.0/全国100万地质图_20210330_rpam5kdJ/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?tk=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNmIyYWY0Ni04OTU4LTRmNTYtOTg5NC00OGY2ZDgxMzQ1ZWMifQ.lXVmjuD8dD34Le4V_rMPgGxdG_OA1E3TzZs2wholp5w',
    tileMatrixSetID: 'EPSG:4326_qg100w',
  },
  {
    name: '全国150万地质图',
    url: 'https://igss.cgs.gov.cn:6160/igs/rest/ogc/qg150w_20210416_BIwqE0wU/WMTSServer/1.0.0/qg150w_20210416_BIwqE0wU/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?tk=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNmIyYWY0Ni04OTU4LTRmNTYtOTg5NC00OGY2ZDgxMzQ1ZWMifQ.lXVmjuD8dD34Le4V_rMPgGxdG_OA1E3TzZs2wholp5w',
    tileMatrixSetID: 'EPSG:4326_qg150w',
  },
  {
    name: '全国250万地质图',
    url: 'https://igss.cgs.gov.cn:6160/igs/rest/ogc/qg250w_20210416_ZAZSeOGX/WMTSServer/1.0.0/qg250w_20210416_ZAZSeOGX/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?tk=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNmIyYWY0Ni04OTU4LTRmNTYtOTg5NC00OGY2ZDgxMzQ1ZWMifQ.lXVmjuD8dD34Le4V_rMPgGxdG_OA1E3TzZs2wholp5w',
    tileMatrixSetID: 'EPSG:4326_qg250w',
  },
];

/**
 * 添加所有地质图层并使用map对象进行管理，以便后续控制显示和隐藏。
 */
function addIgssGeo() {
  DTScopeEngine.getViewer(() => {
    try {
      const viewer = DTScopeEngine.viewer;
      const tilingScheme = new Cesium.GeographicTilingScheme({
        numberOfLevelZeroTilesX: 2,
        numberOfLevelZeroTilesY: 1,
      });

      GEOLOGY_MAP_CONFIGS.forEach((config) => {
        const provider = new Cesium.WebMapTileServiceImageryProvider({
          url: config.url,
          style: 'default',
          format: 'image/png',
          layer: config.name,
          tileMatrixSetID: config.tileMatrixSetID,
          tileMatrixLabels: TILE_MATRIX_LABELS,
          tilingScheme: tilingScheme,
          maximumLevel: 14,
        });
        const layer = viewer.imageryLayers.addImageryProvider(provider);
        layer.show = false;
        checkedGeologyMapsMap.set(config.name, layer);
      });
    } catch (error) {
      console.error('Failed to add geology maps:', error);
    }
  });
}

// // 控制标签的显示和隐藏
// function labelControl(label) {
//   // if (labels.get('断裂带') !== undefined) {
//   //   const ins = labels.get('断裂带');
//   //   ins.removeAll();
//   //   ins.destroy();
//   //   labels.delete('断裂带');
//   // }

//   if (label === '昌都至林芝断裂带') {
//     addLabels(fullLineFault);
//     return;
//   }
//   if (label === '四川段断裂') {
//     addLabels(scFault);
//     return;
//   }
//   if (label === '西藏段断裂带') {
//     addLabels(xzFault);
//     return;
//   }
// }

function showLabels(label) {
  if (label === '昌都至林芝断裂带') {
    addLabels(fullLineFault);
  } else if (label === '雅康段断裂') {
    console.log('雅康段断裂');
    addLabels(scFault);
  } else if (label === '西藏段断裂') {
    addLabels(xzFault);
  }
}

function hideLabels() {
  if (faults) {
    faults.removeAll();
    faults.destroy();
    labels.delete('断裂带');
  }
}

// 改变图层时触发的事件
// const changeLayer = (values: string[]) => {
// 	let legendValues = [];
// 	props.layerData.TreeLayerXz.forEach((layer) => {
// 		if (values.includes(layer.label)) {
// 			legendValues.push(layer.value);
// 		}
// 	});
// 	// 控制标签显示
// 	values.forEach((label) => labelControl(label));
// 	eventBus.emit(Events.ChangeLayer, { values: legendValues, labels: values });
// };

//

// 改变图层时触发的事件
const loadLayerXz = (values: string[]) => {
  console.log('props.layerData.TreeLayerXz:', props.layerData.TreeLayerXz);
  let viewer = DTScopeEngine.viewer;
  let legendValues = [];

  props.layerData.TreeLayerXz.forEach((layer) => {
    if (values.includes(layer.label)) {
      legendValues.push(layer.value);
      eventBus.emit(Events.ChangeLayer, { value: layer.value, label: layer.label }); // 前提是接收这个消息的组件一定要初始化
      showLabels(layer.label);
    } else {
      // 处理取消勾选的图层
      eventBus.emit(Events.RemoveLayer, { value: layer.value, label: layer.label });
      hideLabels();
    }
  });
  // values.forEach((label) => labelControl(label)); // 控制标签显示
};

const loadLayerSc = (values: string[]) => {
  let viewer = DTScopeEngine.viewer;
  // values保存的需要加载的数据列表, 需要通过legendValues进行索引加载数据
  let legendValues = [];
  props.layerData.TreeLayerSc.forEach((layer) => {
    if (values.includes(layer.label)) {
      legendValues.push(layer.value);
      eventBus.emit(Events.ChangeLayer, { value: layer.value, label: layer.label }); // 前提是接收这个消息的组件一定要初始化
      showLabels(layer.label);
    } else {
      // 处理取消勾选的图层
      eventBus.emit(Events.RemoveLayer, { value: layer.value, label: layer.label });
      hideLabels();
    }
  });
  // values.forEach((label) => labelControl(label)); // 控制标签显示
};
const handleCheckAllXz = (value) => {
  checkAllXz.value = value;
  checkedLayersXz.value = value ? props.layerData.TreeLayerXz.map((layer) => layer.label) : [];
};
const handleCheckAllSc = (value) => {
  checkAllSc.value = value;
  checkedLayersSc.value = value ? props.layerData.TreeLayerSc.map((layer) => layer.label) : [];
};

//@ts-ignore
const props = defineProps<{ layerData: TreeLayers; title: string; initLayerValue: string; initLayerName: string }>();
onMounted(() => {
  checkedLayersXz.value = [props.initLayerName]; // 利用属性初始化选择的图层（保持一致性）
  eventBus.emit(Events.ChangeLayer, { value: props.initLayerValue, label: props.initLayerName }); // 前提是接收这个消息的组件一定要初始化
  // addIgssGeo(); // 加载地质云服务地质图
});
</script>

<template>
  <bottomLeft></bottomLeft>
  <div class="right-container">
    <div class="tree-title">{{ title }}</div>
    <!-- 地质图组 -->
    <!--
		<el-checkbox v-model="checkAllGeologyMaps" :indeterminate="isIndeterminate" @change="handleCheckAllChange" class="selectAll">
      地质图资源
    </el-checkbox>
    <el-checkbox-group class="custom-checkbox-group" v-model="checkedGeologyMaps" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="geologyMap in GeologyMaps" :key="geologyMap" :label="geologyMap" :value="geologyMap" class="custom-checkbox">
        <template #default> <img src="../Assets/svg/111.svg" class="logo" /> {{ geologyMap }} </template>
      </el-checkbox>
    </el-checkbox-group>
		-->
    <el-checkbox
      :indeterminate="checkedLayersXz.length > 0 && checkedLayersXz.length < props.layerData.TreeLayerXz.length"
      v-model="checkAllXz"
      @change="handleCheckAllXz"
      class="selectAll"
    >
      西藏段
    </el-checkbox>
    <el-checkbox-group class="custom-checkbox-group" @change="loadLayerXz" v-model="checkedLayersXz">
      <el-checkbox v-for="(item, index) in props.layerData.TreeLayerXz" :key="index" :label="item.label" class="custom-checkbox">
        <template #default> <img src="../Assets/svg/111.svg" class="logo" /> {{ item.label }} </template>
      </el-checkbox>
    </el-checkbox-group>

    <!--  四川段的多选框组 -->
    <el-checkbox
      :indeterminate="checkedLayersSc.length > 0 && checkedLayersSc.length < props.layerData.TreeLayerSc.length"
      v-model="checkAllSc"
      @change="handleCheckAllSc"
      class="selectAll"
    >
      四川段
    </el-checkbox>
    <el-checkbox-group class="custom-checkbox-group" @change="loadLayerSc" v-model="checkedLayersSc">
      <el-checkbox v-for="(item, index) in props.layerData.TreeLayerSc" :key="index" :label="item.label" class="custom-checkbox">
        <template #default> <img src="../Assets/svg/111.svg" class="logo" /> {{ item.label }} </template>
      </el-checkbox>
    </el-checkbox-group>

    <!-- 四川段的多选框组
		<div>四川段</div>
		<el-checkbox-group class="custom-checkbox-group" @change="changeLayer" v-model="checkedLayers">
			<el-checkbox v-for="(item, index) in props.layerData.TreeLayerSc" :key="index" :label="item.label"
				class="custom-checkbox">
				<template #default>
					<img src="../Assets/svg/111.svg" class="logo" /> {{ item.label }}
				</template>
			</el-checkbox>
		</el-checkbox-group> -->
  </div>
</template>

<style lang="scss" scoped>
.right-container {
  position: absolute;
  top: 120px;
  right: 20px;
  z-index: 2;
  width: 300px;
  padding: 2px 5px;
  border-radius: 5px;
  font-size: 18px;
  background: url('../Assets/layerManager.png') no-repeat;
  background-size: 100% 100%;

  .selectAll {
    margin-bottom: 10px;
    color: $item-title-color;
  }

  .tree-title {
    width: 100%;
    height: 50px;
    padding-left: 30px;
    line-height: 50px;
    color: $item-title-color;
    font-family: TRENDS; // 自定义字体
    font-size: 16px;
  }

  .custom-checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;

    .logo {
      width: 18px; // 根据实际需要调整大小
      height: 18px;
      margin-right: 6px; // 控制 logo 和文字之间的距离
      margin-bottom: -4px;
    }

    .custom-checkbox {
      margin-bottom: 10px;

      &:hover {
        background-color: #487d7c; // 鼠标悬停时的背景色
      }
    }

    :deep(.el-checkbox__input) {
      display: flex;
      margin-top: 3px;
      padding-left: 13px;
      align-items: center;
    }

    :deep(.el-checkbox) {
      --el-checkbox-text-color: $item-content-color;

      width: 100%;
      padding-left: 30px;
    }
  }
}
</style>

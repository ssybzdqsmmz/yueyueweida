<!-- 图例文件 -->
<template>
  <div class="panel-container" ref="panel">
    <span>图例</span>
    <div id="section-engineer-geology">
      <div class="grid-container scale-50w">
        <div v-for="(value, key) in colorMap[panelControl.activateMap]" :key="key" class="grid-item">
          <div class="item-legend" :style="'background-color:' + value"></div>
          <span class="item-title"> {{ key }} </span>
        </div>
      </div>
    </div>
    <div class="floating-btn" @mousedown="handleMouseDown" @mouseup="handleMouseUp" @mousemove="handleMouseMove"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import colorMap from '../../Config/legend.json';
import EventBus from '../../Utils/EventBus';
import { ImageryLayer, WebMapServiceImageryProvider } from 'Cesium';
import * as Cesium from 'Cesium';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { setCameraViewPoint } from '../../Utils/CameraControl';
import AppConfig from '@/config/AppConfig';
import TreeLayerData from '../../Config/tree copy.json';
import { Events } from '../../Utils/Events';
import { controlLayer } from '../../Utils/Layer';
import TreeSiChuan from '../../Config/treeSichuan copy.json';
import TreeXizang from '../../Config/treeXizang.json';

let eventBus = new EventBus();
const panelControl = reactive({
  startPosY: 0,
  isMouseDown: false,
  bottom: 10,
  isOpen: false,
  activateMap: '', // 用于寻找图例
  activateName: '', // 用于关闭图层
});
let { geoserver } = new AppConfig().appConfig;

const maps: TreeLayerData = TreeLayerData.map((layerConfig) => {
  if (layerConfig.label.includes('地质图')) {
    layerConfig['baseUrl'] = geoserver;
  }
  return layerConfig;
});

// 获取面板的引用
const panel = ref(null);
// 监听Events.ChangeLayer事件，发生变化时执行对应回调函数
eventBus.on(Events.ChangeLayer, ({ value, label }) => {
  changeGMap(value, label);
});
// 监听Events.RemoveLayer事件，发生变化时执行对应回调函数
eventBus.on(Events.RemoveLayer, ({ value, label }) => {
  removeLayer(value, label);
});

const handleMouseDown = (e) => {
  panelControl.startPosY = e.y;
  panelControl.isMouseDown = true;
  // panel value
  let el = panel.value;
  panelControl.bottom = el.style.bottom.slice(0, -2);

  el.classList.remove('panel-animation');
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
};
const handleMouseMove = (e) => {
  if (!panelControl.isMouseDown) {
    return;
  }
  let deltaY = e.y - panelControl.startPosY;
  let bottom = panelControl.bottom - deltaY;
  bottom = Math.min(bottom, 0);
  bottom = Math.max(bottom, -330);
  let el = panel.value;
  el.style.bottom = bottom + 'px';
};
const handleMouseUp = () => {
  panelControl.isMouseDown = false;
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
  let el = panel.value;
  el.classList.add('panel-animation');
  if (panelControl.isOpen) {
    el.style.bottom = '-330px';
  } else {
    el.style.bottom = '0px';
  }
  panelControl.isOpen = !panelControl.isOpen;
};

// 图例数据
const wmsLayers = ['clr20w', 'clr50w']; // wms图层

/**
 * @description: 加载WMS图层
 * @param {*} viewer
 * @param {*} item
 * @return {void}
 */
let clr20;
let clr50;
function loadWMSLayers(viewer, item) {
  console.log(item);

  //	loadWMSLayers也被调用了
  // 如果clr20已经存在说明已经缓存有这个数据就直接设置可见性为true
  if (item.value == 'clr20w' && clr20) {
    clr20.show = true;
  } else if (item.value == 'clr50w' && clr50) {
    clr50.show = true;
  } else {
    const parameters = {
      transparent: true,
      service: 'WMS',
      format: 'image/png',
    };
    let imageryLayer = new ImageryLayer(
      new WebMapServiceImageryProvider({
        parameters: parameters,
        layers: item.url,
        url: item.baseUrl,
      }),
      {
        show: true, //是否可见
        alpha: 1, //透明度
      }
    );

    viewer.imageryLayers.add(imageryLayer);
    if (item.url == 'cz:czsection-xz-20w') {
      clr20 = imageryLayer;
    } else if (item.url == 'cz:czsection-50w') {
      clr50 = imageryLayer;
    }
  }

  // 跳转视角
  // setCameraViewPoint(viewer, item.viewPort.ViewPoint, item.viewPort.duration);

  //   eventBus.once('subSceneClearTrash', () => {
  //   	viewer.imageryLayers.remove(imageryLayer, true);
  //   });
}

function changeGMap(value, label) {
  //changeGMap也被调用了
  let viewer = DTScopeEngine.viewer;
  // DTLayer的图层
  // if (panelControl.activateName != '' && !wmsLayers.includes(panelControl.activateMap)) {
  // 	controlLayer(viewer, panelControl.activateName, false);
  // } else {
  // 	// eventBus.emit('subSceneClearTrash'); // 清理之前的图层-只针对WMS
  // }

  panelControl.activateMap = value;
  panelControl.activateName = label;

  let item;
  for (let i = 0; i < maps.length; i++) {
    if (maps[i].value == value) {
      item = maps[i];
      break;
    }
  }

  // 直接飞到某个地方就可以
  for (let index = 0; index < TreeSiChuan.length; index++) {
    if (item.label == TreeSiChuan[index].label || TreeXizang[index].label) {
      setCameraViewPoint(viewer, item.viewPort.ViewPoint, item.viewPort.duration);
    }
  }
  // setCameraViewPoint(viewer, item.viewPort.ViewPoint, item.viewPort.duration);

  if (wmsLayers.includes(value)) {
    loadWMSLayers(viewer, item);
  } else {
    controlLayer(viewer, panelControl.activateName, true);
  }
}

/**
 * @description: 移除图层
 * @param {*} value
 * @param {*} label
 * @return {void}
 */
// function removeLayer(value, label) {
//   let viewer = DTScopeEngine.viewer;
//   if (value == 'clr20w') {
//     clr20.show = false;
//     // viewer.imageryLayers.remove(clr20, true);
//   } else if (value == 'clr50w') {
//     clr50.show = false;
//     // viewer.imageryLayers.remove(clr50, true);
//   } else {
//     controlLayer(viewer, label, false);
//   }

//   // let item;
//   // for (let i = 0; i < maps.length; i++) {
//   // 	if (maps[i].value == value) {
//   // 		item = maps[i];
//   // 		break;
//   // 	}
//   // }
//   // if (wmsLayers.includes(value)) {
//   // 	let imageryLayer = viewer.imageryLayers.find(
//   // 		(layer) => layer.imageryProvider.layers[0] == item.url
//   // 	);
//   // 	viewer.imageryLayers.remove(imageryLayer, true);
//   // } else {
//   // 	controlLayer(viewer, label, false);
//   // }
// }

// 可以保证对地质模型显示和隐藏的控制，但不能加载地质图
function removeLayer(value, label) {
  let viewer = DTScopeEngine.viewer;
  // 检查 clr20 和 clr50 是否已定义
  if (value == 'clr20w') {
    if (clr20) {
      // 检查 clr20 是否存在
      clr20.show = false;
      // viewer.imageryLayers.remove(clr20, true);
    } else {
      console.warn('clr20 未定义');
    }
  } else if (value == 'clr50w') {
    if (clr50) {
      // 检查 clr50 是否存在
      clr50.show = false;
      // viewer.imageryLayers.remove(clr50, true);
    } else {
      console.warn('clr50 未定义');
    }
  } else {
    controlLayer(viewer, label, false);
  }
}

// 只能按照特定的顺序进行图层选择
// function removeLayer(value, label) {
//   let viewer = DTScopeEngine.viewer;
//   // 检查 clr20 和 clr50 是否已定义
//   if (value == 'clr20w') {
//     // 检查 clr20 是否存在
//     clr20.show = false;
//     // viewer.imageryLayers.remove(clr20, true);
//   } else if (value == 'clr50w') {
//     // 检查 clr50 是否存在
//     clr50.show = false;
//     // viewer.imageryLayers.remove(clr50, true);
//   } else {
//     controlLayer(viewer, label, false);
//   }
// }
</script>

<style lang="scss" scoped>
.btn-draw {
  position: absolute;
  top: 150px;
  right: 10px;
  z-index: 99;
  width: 100px;
  height: 30px;
  line-height: 30px;
}

.panel-container {
  position: absolute;
  bottom: -390px;
  left: calc(50% - 720px);
  z-index: 99;
  width: 7.5rem; // 1200px
  height: 2.2rem; // 350px

  // background: linear-gradient(180deg, #0000, #000f);
  border-radius: 25px 25px 0 0;
  overflow: hidden;
  align-content: center;
  background: $bg-color;

  & > span {
    display: block;
    position: absolute;
    left: 50%;
    top: 0;
    font-size: 20px;
    transform: translate(-50%, 0%);
  }

  .floating-btn {
    position: absolute;
    top: 10px;
    right: 0;
    width: 100%;
    height: 30px;
    cursor: pointer;

    &:hover::before {
      background-color: #fff;
    }

    &::before {
      position: absolute;
      top: 15px;
      left: 50%;
      width: 100px;
      height: 2px;
      background-color: #aaa;
      content: '';
      transition: 0.2s;
      transform: translateX(-50%);
    }
  }
}

#section-engineer-geology {
  position: absolute;
  top: 25px;
  z-index: 99;
  width: 1420px;
  margin: 10px;
  color: #000;
  text-align: center;
}

.section-name {
  width: 100%;
  height: 28px;
  margin: 5px;
  overflow: hidden;
  line-height: 28px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
}

.grid-container {
  display: grid;
  padding: 10px;
  border-radius: 5px;
  background-color: #2196f3;
  gap: 5px 10px;
}

.scale-50w {
  grid-template-columns: auto auto auto auto auto auto auto auto;
}

.scale-20w {
  grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto;
}

.grid-item {
  display: flex !important;
  height: 24px;
  padding: 10px;
  border: 1px solid rgb(0 0 0 / 80%);
  border-radius: 5px;
  flex-direction: row !important;
  align-items: center;
  background-color: rgb(255 255 255 / 80%);
}

.selected {
  background-color: rgb(255 255 255 / 50%);
}

.item-legend {
  width: 24px;
  height: 24px;
  border-radius: 5px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.item-title {
  padding-left: 16px;
  line-height: 24px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
}

.panel-animation {
  transition: 0.5s;
}
</style>

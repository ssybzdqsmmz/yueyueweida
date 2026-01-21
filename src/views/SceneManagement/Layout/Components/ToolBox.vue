<!--
 * @Author: fuwei 2567873016@qq.com
 * @Date: 2025-03-03 10:41:12
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-05 10:24:37
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Components\ToolBox.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<!--
 * @Author: 枫林残忆
 * @Date: 2024-03-02 12:52:01
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-05-22 18:20:09
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Components\ToolBox.vue
 * @Description: 
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<script lang="ts" setup>
//@ts-ignore
import Cesium, { DTMeasureTool, ScreenSpaceEventType, DTDraw, ScreenSpaceEventHandler, Cartesian3 } from 'Cesium';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { onMounted, onUnmounted, ref } from 'vue';
import { cartesian3ToScreen } from '@/utils/Common/Transform';
import WEventBus from '../Tools/WEventBus';
import proj4 from 'proj4';

const drawTool = ref(false);
const measureTool = ref(false);

let wEventBus = new WEventBus();

const toolBoxItems = [
  {
    name: '绘',
    className: 'toolbox-draw',
    imageUrl: new URL('../Assets/svg/toolbox-draw-bg.svg', import.meta.url).href,
  },
  {
    name: '量',
    className: 'toolbox-measure',
    imageUrl: new URL('../Assets/svg/toolbox-measure-bg.svg', import.meta.url).href,
  },
];

const showPanel = (item) => {
  const drawToolActivated = item.name === '绘';
  const measureToolActivated = item.name === '量';

  drawTool.value = drawToolActivated;
  measureTool.value = measureToolActivated;

  document.querySelector(`.${toolBoxItems[0].className}`).classList.toggle('toolbox-item-activated', drawToolActivated);
  document.querySelector(`.${toolBoxItems[1].className}`).classList.toggle('toolbox-item-activated', measureToolActivated);
};

const measureItems = [
  {
    name: '距离',
    // url: new URL('../Assets/toolbox/distance-bg.svg', import.meta.url).href,
    icon: 'distance-bg',
    id: 'distance',
  },
  {
    name: '角度',
    icon: 'angle-bg',
    id: 'angle',
  },
  {
    name: '面积',
    icon: 'area-bg',
    id: 'area',
  },
  {
    name: '清空',
    icon: 'empty-bg',
    id: 'empty',
  },
];

const drawItems = [
  {
    name: '点',
    // url: new URL('../Assets/toolbox/distance-bg.svg', import.meta.url).href,
    icon: 'point',
    id: 'point',
  },
  {
    name: '线',
    icon: 'line',
    id: 'line',
  },
  {
    name: '面',
    icon: 'surface',
    id: 'surface',
  },
  {
    name: '删除',
    icon: 'empty-bg',
    id: 'empty-surface',
  },
];

const onItemClicked = (function measureItemClick() {
  let viewer;

  let selectedId = '';
  let dtMeasureTool;
  return (item) => {
    viewer = DTScopeEngine.viewer;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK); //去掉双击事件
    viewer.scene.globe.depthTestAgainstTerrain = true; // 球皮的深度测试

    if (selectedId != '') {
      let beforeSelectedBtn = document.getElementById(selectedId);
      beforeSelectedBtn.classList.remove('drawItem-selected');
    } else {
      dtMeasureTool = new DTMeasureTool({
        // 测量面板-初始化一次
        viewer: viewer,
      });
      dtMeasureTool.switchVisilibity(false);
    }
    let btn = document.getElementById(item.id);
    btn.classList.add('drawItem-selected');
    selectedId = item.id;

    switch (item.name) {
      case '距离': {
        dtMeasureTool.dtMeasurePanel.dtMeasureModel.horizontalDistance();
        break;
      }
      case '面积': {
        dtMeasureTool._dtMeasurePanel.dtMeasureModel.spaceArea();
        break;
      }
      case '角度': {
        dtMeasureTool._dtMeasurePanel.dtMeasureModel.spaceAngle();
        break;
      }
      case '清空': {
        let entityUids: string[] = dtMeasureTool.dtMeasurePanel.dtMeasureModel._entityUids;
        entityUids.forEach((entityUid) => {
          viewer.entities.removeById(entityUid);
        });

        break;
      }
    }
  };
})();

const onDrawItemClicked = (function drawItemClick() {
  let viewer;

  let selectedId = '';
  let drawHelp;

  let label: HTMLElement; // 随鼠标移动的标签

  /**
   * @description: 用于更新标签的位置（html和canvas不能实时更新）
   * @param {*} movement
   * @return {void}
   */
  function updateLabel(movement) {
    // 获取鼠标的世界坐标
    let mousePosition = viewer.scene.camera.pickEllipsoid(movement.endPosition);
    let screenPosition = cartesian3ToScreen(Cartesian3.fromArray([mousePosition.x, mousePosition.y, mousePosition.z]));
    label.style.left = screenPosition.x + 15 + 'px';
    label.style.top = screenPosition.y - 10 + 'px';
  }

  return (item) => {
    viewer = DTScopeEngine.viewer;
    // viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK); //去掉双击事件
    viewer.scene.globe.depthTestAgainstTerrain = true; // 球皮的深度测试

    if (selectedId != '') {
      let beforeSelectedBtn = document.getElementById(selectedId);
      beforeSelectedBtn.classList.remove('drawItem-selected');
    } else {
      drawHelp = new DTDraw(viewer);
      drawHelp.setCartWay(false);
    }

    wEventBus.emit('clearTrash'); // 先清除之前的垃圾

    let btn = document.getElementById(item.id);
    btn.classList.add('drawItem-selected');
    selectedId = item.id;

    switch (item.name) {
      case '点': {
        let options = {
          show: true,
          callback: (position, parameters) => {
            console.log('绘制点成功：', position);
          },
          parameters: {},
        };
        drawHelp.drawPoint(options);
        break;
      }
      case '线': {
        drawHelp.drawPolyline({
          show: true,
          callback: (position, parameters) => {
            //
            console.log(position);
          },
          parameters: {},
        });
        break;
      }
      case '面': {
        drawHelp.drawPolygon({
          show: true,
          callback: (position, parameters) => {
            //
          },
          parameters: {},
        });
        break;
      }
      case '删除': {
        label = document.createElement('div');
        label.textContent = '点击元素即可删除';
        label.classList.add('tooltip-style');

        document.body.appendChild(label);
        let screenSpaceEventHandler = new ScreenSpaceEventHandler(viewer.scene.canvas);

        // 监听鼠标移动事件
        screenSpaceEventHandler.setInputAction(updateLabel, ScreenSpaceEventType.MOUSE_MOVE);
        drawHelp.delete();

        wEventBus.once('clearTrash', () => {
          // 垃圾清理
          document.body.removeChild(label);
          screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
          screenSpaceEventHandler.destroy();
        });

        break;
      }
    }
  };
})();

// eslint-disable-next-line valid-jsdoc
/**
 * 将WGS84坐标系下的经纬度转换为EPSG:4543坐标系下的坐标
 *
 * @param lon WGS84坐标系下的经度
 * @param lat WGS84坐标系下的纬度
 */
function get4543(lon, lat, height) {
  // 定义 EPSG:4326（WGS84）
  proj4.defs('EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs');
  // 动态定义 EPSG:4543（根据输入经度计算带号）
  const zone = Math.floor((lon + 1.5) / 3); // 计算带号（100.77 → 34）
  const centralMeridian = 3 * zone; // 中央经线（34带 → 103.5°E）
  proj4.defs(
    'EPSG:4543',
    `+proj=tmerc ` +
      `+lat_0=0 ` +
      `+lon_0=${centralMeridian} ` + // 动态中央经线
      `+k=1 ` +
      `+x_0=500000 ` +
      `+y_0=0 ` +
      `+ellps=krass ` +
      `+towgs84=24.0,123.0,-9.0 ` + // 添加七参数修正椭球体差异
      `+units=m ` +
      `+no_defs`
  );
  // 执行转换
  const [x, y] = proj4('EPSG:4326', 'EPSG:4543', [lon, lat]);
  return [x, y, height];
}

// 计算两点之间的直线点集（带高程）,输入的是笛卡尔坐标系的坐标
function calculateLinePoints(startPoint, endPoint, numPoints) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints;
    const point = new Cesium.Cartesian3();
    Cesium.Cartesian3.lerp(startPoint, endPoint, t, point);
    console.log(point);
    // 将笛卡尔坐标转换为4543
    // 转换为 Cartographic（经纬度 + 高程）
    const cartographic = Cesium.Cartographic.fromCartesian(point);
    // 转换为度数（更易读）
    let longitude = Cesium.Math.toDegrees(cartographic.longitude);
    let latitude = Cesium.Math.toDegrees(cartographic.latitude);
    let height = cartographic.height; // 真实高程（单位：米）
    console.log('点的地理坐标：', {
      longitude,
      latitude,
      height,
    });
    [longitude, latitude, height] = get4543(longitude, latitude, height);
    console.log('点的4543坐标：', longitude, latitude, height);

    points.push([longitude, latitude, height]);
  }
  return points;
}

const controlMeasureItem = (function () {
  let status = true;
  return () => {
    let drawItems = document.getElementsByClassName('drawItems')[0];
    let btn = document.getElementsByClassName('close-btn')[0];

    status = !status;
    if (status) {
      btn.classList.remove('close-btn-open');
      drawItems.classList.remove('drawItems-hidden');
    } else {
      btn.classList.add('close-btn-open');
      drawItems.classList.add('drawItems-hidden');
    }
  };
})();

function keyEvent(event) {
  if (event.key == 'Escape') {
    wEventBus.emit('clearTrash');
  }
}

onMounted(() => {
  document.addEventListener('keydown', keyEvent);
});
onUnmounted(() => {
  document.removeEventListener('keydown', keyEvent);
});
</script>

<template>
  <div id="toolbox">
    <div class="toolbox-item" :class="item.className" @click="showPanel(item)" v-for="item in toolBoxItems" :key="item.name">
      <div class="toolbox-icon" :style="{ '--image-url': 'url(' + item.imageUrl + ')' }">{{ item.name }}</div>
      <div class="toolbox-item-line"></div>
    </div>
  </div>

  <div v-if="measureTool" class="drawItem-container">
    <div class="drawItems">
      <div :id="measureItem.id" class="drawItem" v-for="measureItem in measureItems" @click="onItemClicked(measureItem)" :key="measureItem.name">
        <svg-icon :iconClass="'toolbox-' + measureItem.icon" className="draw-icon"> </svg-icon>
        <span>{{ measureItem.name }}</span>
      </div>
    </div>
    <div class="close-btn" @click="controlMeasureItem()"></div>
  </div>

  <div v-if="drawTool" class="drawItem-container">
    <div class="drawItems">
      <div :id="drawItem.id" class="drawItem" v-for="drawItem in drawItems" @click="onDrawItemClicked(drawItem)" :key="drawItem.name">
        <svg-icon :iconClass="'toolbox-' + drawItem.icon" className="draw-icon"> </svg-icon>
        <span>{{ drawItem.name }}</span>
      </div>
    </div>
    <div class="close-btn" @click="controlMeasureItem()"></div>
  </div>
</template>

<style lang="scss" scoped>
.toolbox-item-activated {
  color: white;
}

#toolbox {
  position: absolute;
  top: 200px;
  left: 300px;
  z-index: 1;
  width: 46px;
  height: 98px;
  border-top: 1px solid rgb(134 203 255 / 30%);
  background: url('../Assets/svg/toolbox-bg.svg') no-repeat;
  background-size: cover;
  background-color: rgb(25 45 62 / 80%);

  .toolbox-item:hover {
    cursor: pointer;
  }

  .toolbox-item {
    .toolbox-icon {
      width: 42px;
      height: 46px;
      margin: 0 auto;
      padding: 6px 2px;
      font-size: 14px;
      text-align: center;

      &::before {
        display: block;
        position: relative;
        width: 16px;
        height: 16px;
        margin: auto;
        background: var(--image-url) no-repeat;
        background-size: 100% 100%;
        content: '';
      }
    }
  }

  // 分割线
  .toolbox-item-line {
    height: 1px;
    width: 30px;
    margin: 0 auto;
    background: linear-gradient(270deg, rgb(0 145 255 / 0%) 0%, rgb(54 167 252 / 50%) 48.49%, rgb(0 145 255 / 0%) 100%);
  }
}

.drawItem-container {
  display: flex;
  position: absolute;
  top: 120px;
  left: 50%;
  z-index: 1;
  height: 54px;
  align-items: center;

  .drawItems {
    display: grid;
    flex: 1;
    width: calc(305px);
    height: 100%;
    padding: 4px 40px;
    border: 1px solid;
    border-image-source: radial-gradient(97.86% 100% at 50% 0%, #91cfff 0%, rgb(25 147 240 / 50%) 56.42%, rgb(25 147 240 / 20%) 100%);
    border-radius: 200px;
    overflow: hidden hidden;
    color: rgb(158 200 232 / 100%);
    background: linear-gradient(0deg, rgb(2 62 104 / 80%), rgb(2 62 104 / 80%)),
      radial-gradient(60.71% 60.71% at 98.46% 0%, rgb(0 26 255 / 30%) 0%, rgb(18 62 96 / 0%) 100%),
      radial-gradient(50% 50% at 14.69% 100%, rgb(0 171 194 / 40%) 0%, rgb(10 57 94 / 0%) 100%);

    // background-color: pink;r
    transition: all 3s ease-in-out;

    // cursor: pointer;

    // box-shadow: 0 5px 6px 0 rgb(9 25 34 / 50%);

    // transform: translateX(-50%);
    grid-template-columns: repeat(4, 1fr);

    .drawItem {
      width: 44px;
      height: 46px;
      text-align: center;

      .draw-icon {
        --height: 23px;

        width: var(--height);
        height: var(--height);
        color: rgb(158 200 232 / 100%);
      }

      span {
        display: block;
      }

      &:hover {
        cursor: pointer;
      }
    }

    .drawItem-selected {
      border: 1px solid;
      border-image-source: radial-gradient(75.2% 38.28% at 50% 0%, #b2deff 2.43%, rgb(97 187 255 / 60%) 46.13%, rgb(0 145 255 / 0%) 100%);
      border-radius: 8px;
      color: white;
      background: linear-gradient(180deg, #1a649c 0%, rgb(26 100 156 / 0%) 100%),
        radial-gradient(50% 20.97% at 50% 0%, #2fa6ff 0%, rgb(0 115 201 / 0%) 100%);
    }
  }

  .close-btn {
    transform: translateX(-10px); // 将button向左移动
    width: 40px;
    height: 100%;
    background: url('../Assets/svg/toolbox-close-bg.svg') no-repeat;
    background-position: center center;

    &:hover {
      cursor: pointer;
    }
  }
}

.drawItems-hidden {
  width: 10px !important;
  height: 36px !important;
  padding: 0 !important;
}

.close-btn-open {
  height: 36px !important;
}
</style>

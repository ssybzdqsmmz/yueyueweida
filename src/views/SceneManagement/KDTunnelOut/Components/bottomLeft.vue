<!--
 * @Author: cl
 * @Date: 2021-03-03 11:25:46
 * @LastEditTime: 2025-06-17 10:39:23
 * @LastEditors: fuwei 2567873016@qq.com
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnelOut\Components\bottomLeft.vue
-->
<template>
  <div class="home-bottom-left">
    <div class="header gl-small-header">工程简介</div>
    <div class="content">
      <div @click="previous()" v-if="scene.length > 4">
        <svg-icon icon-class="previous-page" class="page"></svg-icon>
      </div>

      <div class="item" v-for="item in scene" :key="item.name" v-show="item.show" @click="handerClick(item)">
        <img :src="item.uri" alt="" srcset="" class="item-img" />
        <!-- <img src="../assets/img/cj.png" alt="" srcset="" class="item-img" /> -->
        <div class="item-text" :class="{ active: isActive !== item.name }">
          {{ item.name }}
        </div>
      </div>
      <div @click="next" v-if="scene.length > 4">
        <svg-icon icon-class="next-page" class="page"></svg-icon>
      </div>
    </div>
  </div>
  <Right v-show="infoShow"></Right>
</template>

<script setup>
import Right from './right.vue';
import DTExtendViewportManager from '../Utils/DTExtendViewportManager.js';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { Resource } from 'Cesium';
import { host } from '../Config/url';
import { onMounted, reactive, ref, getCurrentInstance, onBeforeUnmount } from 'vue';

let infoShow = ref(false);
const cxt = getCurrentInstance();
const bus = cxt.appContext.config.globalProperties.$bus;

let scene = reactive([{ name: '场景监控#01', src: '', show: true }]);
let isActive = ref('场景监控#01');

onMounted(() => {
  DTScopeEngine.getViewer(() => {
    let viewer = DTScopeEngine.viewer;
    let canvas = viewer.canvas;
    let handler = new Cesium.ScreenSpaceEventHandler(canvas);

    // 定义一个用于存储上一次高亮的feature的变量
    let highlightedFeature = null;
    let previousColor = null;

    handler.setInputAction((movement) => {
      // 使用viewer.scene.pick来获取点击位置的feature
      let pickedFeature = viewer.scene.pick(movement.position);
      // 如果之前有高亮的feature，先将其颜色恢复
      if (highlightedFeature) {
        highlightedFeature.color = Cesium.Color.WHITE;
        highlightedFeature = null;
      }
      // 如果当前点击的feature不是空的
      if (Cesium.defined(pickedFeature) && pickedFeature instanceof Cesium.Cesium3DTileFeature) {
        // 获取feature的属性
        let properties = pickedFeature.getPropertyNames();
        let propertyValues = {};

        // 遍历属性并获取值
        properties.forEach(function (name) {
          propertyValues[name] = pickedFeature.getProperty(name);
        });

        pickedFeature.color = new Cesium.Color(255.0, 0.0, 0.0, 0.5); // RGB为(255, 0, 0)，透明度为0.5
        highlightedFeature = pickedFeature;
        console.log(propertyValues, '查看属性信息');
        // 兄弟组件传参
        bus.emit('expressBIMInfo', propertyValues);
        if (propertyValues) {
          infoShow.value = true;
        } else {
          infoShow.value = false;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 关闭地球
    // viewer.scene.globe.show = false;
    // viewer.scene.skyAtmosphere.show = false;
    // 初始化视角
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(101.6980259, 30.0881171, 3738.7997081),
      orientation: {
        heading: 1.0426079000000001,
        pitch: -0.38849970000000034,
        roll: 0.0027162999999994497,
      },
    });
    let viewPointManager = undefined;
    if (!viewer.viewPointManager) {
      viewPointManager = new DTExtendViewportManager({ viewer });
      viewer.viewPointManager = viewPointManager;
    } else {
      viewPointManager = viewer.viewPointManager;
    }
    let configPromise = Resource.fetchJson({
      url: host + '/CZSCZQ-3/LINE/json/viewport.json',
    });
    configPromise.then((data) => {
      scene.pop();
      let sceneRes = viewPointManager.initViewPointManager(data);
      for (let i = 0; i < sceneRes.length; i++) {
        const element = sceneRes[i];
        scene.push({
          name: element.name,
          uri: 'img/viewPoint/' + element.name + '.png', //element.uri, // ly
          show: i > 3 ? false : true,
          id: element.id,
        });
      }
    });
  });
});

// onUnmounted(() => {
//   DTScopeEngine.getViewer(() => {
//     let viewer = DTScopeEngine.viewer;
//     viewer.scene.globe.show = true;
//     viewer.scene.skyAtmosphere.show = true;
//   });
// });

function layerControl(layerNames) {
  DTScopeEngine.getViewer(() => {
    DTScopeEngine.viewer.DTScene.layers.forEach((layers) => {
      layers._array.forEach((layer) => {
        DTScopeEngine.viewer.DTScene.setLayerVisiability(layer, layerNames.indexOf(layer._label) !== -1);
      });
    });
  });
}

function previous() {
  let index = scene.findIndex((r) => r.show === true);
  if (index == 0) {
    return;
  }
  scene[index - 1].show = true;
  scene[index + 3].show = false;
}
function next() {
  let index = scene.findIndex((r) => r.show === true);
  if (index == scene.length - 4) {
    return;
  }
  scene[index + 4].show = true;
  scene[index].show = false;
}
function handerClick(item) {
  DTScopeEngine.getViewer(() => {
    isActive.value = item.name;
    let viewer = DTScopeEngine.viewer;
    if (!viewer.viewPointManager) {
      return;
    }
    console.log(item);
    viewer.viewPointManager.viewPointManager.flyViewportById(item.id, 3);

    // 视点定义之外
    //alert("hello world");

    // 1. 判断item == ?
    let layers = ['基础影像', '03_出口测区_DSM_最新'];
    if (item.name == '上台阶') {
      layers = ['钢筋网片上', '上钢架', '初支拱墙上拱墙', '锚杆上', '基础影像'];
    }

    if (item.name === '中台阶') {
      layers = ['钢筋网片中', '中钢架', '初支拱墙中拱墙', '锚杆中', '基础影像'];
    }

    if (item.name === '下台阶') {
      layers = ['下钢架', '初支拱墙下拱墙', '锚杆下', '基础影像'];
    }

    if (item.name === '仰拱') {
      layers = ['初支仰拱', '仰供钢架', '中心排水沟', '仰拱填充', '电缆沟', '二衬仰拱', '基础影像'];
    }

    if (item.name === '正洞') {
      layers = [
        '初支仰拱',
        '仰供钢架',
        '中心排水沟',
        '衬砌钢筋-仰拱钢筋',
        '二衬拱墙',
        '仰拱填充',
        '电缆沟',
        '二衬仰拱',
        '衬砌钢筋-上钢筋',
        '衬砌钢筋-中钢筋',
        '衬砌钢筋-下钢筋',
        '下钢架',
        '初支拱墙下拱墙',
        '锚杆下',
        '钢筋网片中',
        '中钢架',
        '初支拱墙中拱墙',
        '锚杆中',
        '钢筋网片上',
        '上钢架',
        '初支拱墙上拱墙',
        '锚杆上',
        '隧道正洞隧道体',
        '基础影像',
      ];
    }
    if (item.name === '隧道设计BIM') {
      layers = ['隧道正洞洞门', '隧道出口路基', '隧道正洞钢架', '隧道正洞钢筋网片', '隧道正洞锚杆', '04_折多山隧道_整体BIM'];
    }
    if (item.name === '斜井') {
      layers = ['斜井2洞门', '斜井施工模型钢架高亮', '斜井施工模型钢架未变更'];
    }
    if (item.name === '正洞模型') {
      layers = ['正洞模型'];
    }
    // if (item.name === '点云') {
    //   layers = ['2023.11.20开挖-1', '2023.11.21开挖-1', '2023.11.22开挖-1', '2023.11.23开挖-1', '2023.11.24开挖-1'];
    //   // getCurrentCameraView()
    // }
    layerControl(layers);
  });
}

function getCurrentCameraView() {
  let viewer = DTScopeEngine.viewer;
  if (viewer) {
    let camera = viewer.camera;
    let cartographic = Cesium.Cartographic.fromCartesian(camera.position);
    let view = {
      position: {
        longitude: Cesium.Math.toDegrees(cartographic.longitude),
        latitude: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height,
      },
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll,
    };
    // 输出为 JSON 字符串
    let jsonString = JSON.stringify(view, null, 2);
    console.log(jsonString);
    console.log('当前相机视角:', view);
    alert(`当前相机视角: ${JSON.stringify(view, null, 2)}`);
  } else {
    console.warn('无法获取当前相机视角，viewer未定义');
  }
}
</script>

<style lang="scss" scoped>
@import '../Assets/mixin';

$border-color: 1px solid rgba(#34d5cf, 80%);

.home-top-left {
  z-index: 10;
  /* stylelint-disable-next-line order/properties-order */
  left: 200px;
}

.home-bottom-left {
  z-index: 10;
  width: 1111px;
  height: 240px;

  @include Background($url: '../Assets/img/bg-cjqh.png');
  @include pos($p: absolute, $b: 21px, $l: 270px);

  .header {
    width: 1111px;
    height: 38px;

    @include Background($url: '../Assets/img/title-cjqh.png');
  }

  .content {
    z-index: 10;
    height: 185px;

    @include flex($h: space-around, $v: center);

    .page {
      width: 21.21px;
      height: 42.41px;
    }

    .item {
      width: 240px;
      height: 160.57px;

      &-img {
        width: 240px;
        height: 134.57px;
        margin-bottom: -3.5px;
        border-top: $border-color;
      }

      &-text {
        width: 240px;
        height: 24px;
        border-top: $border-color;
        border-bottom: $border-color;
        line-height: 24px;
        background: rgba($color: #0e4f61, $alpha: 20%);

        @include font($s: 14px, $c: #b8d1d3, $ta: center);
      }
    }
  }
}

.active {
  color: #5affeb !important;
  background: linear-gradient(
    45deg,
    rgb(25 255 236 / 60%) 0%,
    rgb(14 79 97 / 10%) 37%,
    rgb(14 79 97 / 10%) 64%,
    rgb(25 255 236 / 60%) 100%
  ) !important;
}
</style>

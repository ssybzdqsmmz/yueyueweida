<!--
 * @Author: anganao
 * @Date: 2023-12-15 21:23:25
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-23 14:40:31
 * @FilePath: \Geology-v3\src\views\SceneManagement\ConstructionSurfaceGeoModel\index.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div>
    <div id="left-panel">
      <div class="left">
        <header class="header">模型图层管理</header>
        <article class="content">
          <p class="contents">不良地质</p>
          <section id="contents2"></section>
          <p class="contents">超前预报</p>
          <section id="contents1"></section>
        </article>
      </div>
    </div>
    <MileageSearch v-if="MileageSearchControl"></MileageSearch>
    <BLDZ v-if="isBLDZ" :value="selectedValue" />
    <div id="main-panel">
      <DTVolume></DTVolume>
    </div>
    <div v-if="showzzmsm">
      <ZZMSM />
    </div>
    <DZLD v-if="isRadar" />
    <AHD v-if="isAHD" />
    <DBH v-if="isDBH" />
    <TSP v-if="isTSP" />
    <TEM v-if="isTEM" />
    <div class="geologylegendfsd" v-if="showgeologylegendfsd"></div>
    <div class="geologylegendpsd" v-if="showgeologylegendpsd"></div>
    <router-view />
  </div>
</template>

<script setup>
import BLDZ from './Component/BLDZComponents/BLDZ.vue';
import DTVolume from './Utils/AllPrevious/All/DTVolume.vue';
// import MileageSearch from './Component/MileageSearch.vue';
// import ZzmSm from './Component/ZZMSM.vue';
import ZZMSM from './Component/ZZMSMComponents/ZZMSM.vue';
import DZLD from './Component/DZLDComponents/DZLD.vue';
import AHD from './Component/AHDComponents/AHD.vue';
import DBH from './Component/DBHComponents/DBH.vue';
import TSP from './Component/TSPComponents/TSP.vue';
import TEM from './Component/TEMComponents/TEM.vue';
import { onMounted, getCurrentInstance, onBeforeUnmount, ref, computed, onUnmounted } from 'vue';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import Previous from './Utils/AllPrevious/index.js';
import './Assets/style/contents.scss';
import { host } from './Config/url';
import SceneConfig12 from './Config/scene_12_voxel.json';
import { generateDTGlobeConfig, loadFromDTGlobeConfig, removeFromDTGlobeConfig } from './Utils/Layer';
import { is } from '@pureadmin/utils';

let lastChooseLayer = undefined; //上一个选择的节点
let chooseLayer = undefined; // 存储已经选择的场景节点
let pre = undefined;
// let showzzmsm = ref(true);
let showgeologylegendfsd = ref(false);
let showgeologylegendpsd = ref(false);
let MileageSearchControl = computed(() => !showzzmsm.value);

let models = generateDTGlobeConfig(host, SceneConfig12);
let selectedValue = ref(''); // BLDZ组件的值
const contents =
  // {
  // 	康定2号隧道:
  [
    '掌子面素描',
    '长距离预报',
    '中距离预测',
    '地质雷达',
    '超前水平钻',
    '加深炮孔',
    'TSP反演',
    // 'Ⅲ级围岩',
    '软弱围岩',
    '高地应力',
    '富水带',
    '破碎带',
  ];
const contents1 =
  // {
  // 	康定2号隧道:
  ['掌子面素描', '地质雷达', '超前水平钻', '加深炮孔', 'TSP反演', '瞬变电磁'];
const contents2 =
  // {
  // 	康定2号隧道:
  ['软弱围岩', '高地应力', '富水带', '破碎带'];
// };
const kdUnderLayers = [
  // '掌子面素描',
  '长距离预报',
  '中距离预测',
  '地质雷达',
  '超前水平钻',
  '加深炮孔',
  'TSP反演',
  // 'Ⅲ级围岩',
  '软弱围岩',
  '高地应力',
  '富水带',
  '破碎带',
];

// 图层控制
function loadUndergroundModel(name) {
  const otherCasts = {
    //TSP反演: 'scene/sdata/demo_000.raw.json',
    // Ⅲ级围岩: 'scene/sdata/demo_001.raw.json',
    软弱围岩: 'scene/sdata/demo_005.raw.json',
    高地应力: 'scene/sdata/demo_025.raw.json',
    富水带: 'scene/sdata/demo_norm.raw.json',
    破碎带: 'scene/sdata/demo_fault.raw.json',
    //富水带LY: 'scene/sdata/Water.raw.json',
    //破碎带LY: 'scene/sdata/posui.json',
  };
  if (name === 'TSP反演') {
    pre.loadTSP();
  } else if (name === '中距离预测') {
    pre.loadTEM();
  } else if (name === '地质雷达') {
    pre.loadGPR();
  } else if (name === '超前水平钻') {
    pre.loadAHD();
  } else if (name === '加深炮孔') {
    pre.loadDBH();
  } else {
    pre.loadForcastModel(otherCasts[name]);
  }
}

//总控部分
function loadLayers(name) {
  // 控制图例显示
  showgeologylegendfsd.value = name === '富水带LY';
  showgeologylegendpsd.value = name === '破碎带LY';

  // 地质雷达
  if (name === '地质雷达') {
    isRadar.value = true;
    showzzmsm.value = false;
    isAHD.value = false;
    isDBH.value = false;
    isTSP.value = false;
    isTEM.value = false;
    isBLDZ.value = false;
    return;
  }
  // 超前水平钻
  if (name === '超前水平钻') {
    isRadar.value = false;
    showzzmsm.value = false;
    isAHD.value = true;
    isDBH.value = false;
    isTSP.value = false;
    isTEM.value = false;
    isBLDZ.value = false;
    return;
  }
  // 加深炮孔
  if (name === '加深炮孔') {
    isRadar.value = false;
    showzzmsm.value = false;
    isAHD.value = false;
    isDBH.value = true;
    isTSP.value = false;
    isTEM.value = false;
    isBLDZ.value = false;
    return;
  }
  // TSP反演
  if (name === 'TSP反演') {
    isRadar.value = false;
    showzzmsm.value = false;
    isAHD.value = false;
    isDBH.value = false;
    isTSP.value = true;
    isTEM.value = false;
    isBLDZ.value = false;
    return;
  }
  // 瞬变电磁
  if (name === '瞬变电磁') {
    isRadar.value = false;
    showzzmsm.value = false;
    isAHD.value = false;
    isDBH.value = false;
    isTSP.value = false;
    isTEM.value = true;
    isBLDZ.value = false;
    return;
  }
  // 掌子面素描
  if (name === '掌子面素描') {
    isRadar.value = false;
    showzzmsm.value = true;
    isAHD.value = false;
    isDBH.value = false;
    isTSP.value = false;
    isTEM.value = false;
    isBLDZ.value = false;
    // 判断选择的是否为康定二号隧道的地质部分。
    if (kdUnderLayers.includes(lastChooseLayer)) {
      pre.clearPrimitiveModel();
      pre.deleteTScaler();
    } else {
      pre.deleteEarth();
    }
    return;
  }

  // 其它情况
  isBLDZ.value = true;
  selectedValue.value = name; // 更新BLDZ组件的值
  isRadar.value = false;
  showzzmsm.value = false;
  isAHD.value = false;
  isDBH.value = false;
  isTSP.value = false;
  isTEM.value = false;
  // 加载地下部分
  if (kdUnderLayers.includes(name)) {
    loadUndergroundModel(name);
  }
}

/* ----这里是目录树的实现模块---- */
// 添加中间目录层
function addRootLayer(keys, fatherElem) {
  const elem = document.createElement('div');
  elem.classList.add('layers', 'root-layers');
  elem.innerHTML = `<div class='root-layers-img'></div><span class='root-layers-span'>${keys}</span>`;

  // 添加一个点击展开和缩放的功能
  elem.addEventListener('click', (el) => {
    const isShow = el.target.nextElementSibling.style.display;
    console.log(isShow);
    if (isShow !== 'block') {
      el.target.nextElementSibling.style.display = 'block';
      el.target.firstElementChild.style.transform = 'rotate(90deg)';
    } else {
      el.target.nextElementSibling.style.display = 'none';
      el.target.firstElementChild.style.transform = 'rotate(0deg)';
    }
  });
  // 内容元素
  const elemContent = document.createElement('div');
  elemContent.classList.add('content-layers');
  fatherElem.appendChild(elem);
  fatherElem.appendChild(elemContent);
  // 返回内容元素,内容元素用来装下级目录
  return elemContent;
}

// 添加叶子目录层
function addJobLayers(keys, fatherElem) {
  const elem = document.createElement('div');
  elem.classList.add('layers', 'job-layers');
  elem.innerText = keys;
  fatherElem.appendChild(elem);

  // 第一次进入选择的按钮
  if (keys == '掌子面素描' && lastChooseLayer == undefined) {
    // 加载图层的功能
    loadLayers('掌子面素描'); //进入
    lastChooseLayer = '掌子面素描';
    console.log(lastChooseLayer);
    elem.classList.add('job-layers-choose');
    chooseLayer = elem;
  }

  // 添加点击功能
  elem.addEventListener('click', (el) => {
    const chooseName = 'job-layers-choose';
    if (el.target.classList.contains(chooseName)) {
      return;
    }
    // 关闭之前选择的节点
    chooseLayer?.classList.remove(chooseName);
    // 现在选择的节点
    lastChooseLayer = chooseLayer?.innerText;
    console.log(lastChooseLayer);
    chooseLayer = el.target;
    chooseLayer.classList.add(chooseName);
    console.log('el.target', el.target);
    // 加载图层的功能
    loadLayers(el.target.innerText); // 进入
  });
}

// 建立目录树
function buildContents(fContents, fatherElem) {
  if (fContents instanceof Array) {
    for (const keys of fContents) {
      addJobLayers(keys, fatherElem);
    }
    return;
  }
  for (const keys of Object.keys(fContents)) {
    const elem = addRootLayer(keys, fatherElem);
    buildContents(fContents[keys], elem);
  }
}
/* ----目录树实现模块结束---- */

//
const ctx = getCurrentInstance();
const _this = ctx.appContext.config.globalProperties;
function loopRender() {
  requestAnimationFrame(loopRender);
  const { viewer } = DTScopeEngine;
  if (viewer) {
    viewer.render();
  }
  if (_this.DTGlobe[1]) {
    _this.DTGlobe[1].draw();
  }
}

onMounted(() => {
  DTScopeEngine.getViewer(() => {
    let viewer = DTScopeEngine.viewer;
    let loadingPromise = loadFromDTGlobeConfig(viewer, models.dtglobeCzml);
    loadingPromise
      .then((res) => {
        // console.log('加载结果:', res);
        // console.log(DTScopeEngine.viewer.DTScene);
      })
      .catch((err) => {
        console.error('模型加载失败', err);
      });
    // let viewer = DTScopeEngine.viewer;
    pre = new Previous(viewer);
    let timerId = undefined;
    timerId = setTimeout(function monitor() {
      if (pre == 'undefined') {
        timerId = setTimeout(monitor, 300);
      } else {
        clearTimeout(timerId);
        buildContents(contents1, document.getElementById('contents1'));
        buildContents(contents2, document.getElementById('contents2'));
      }
    }, 100);
  });
});

// onBeforeUnmount(() => {
//   // 清理全局视图状态
//   const viewer = DTScopeEngine.viewer;
//   if (viewer) {
//     viewer.scene.globe.show = true;  // 恢复默认值
// 		viewer.scene.skyAtmosphere.show = true;
//   }

//   // 释放pre实例的资源
//   if (pre) {
//     pre.deleteTScaler();
//     pre.clearPrimitiveModel();
//     pre.loadEarth();  // 恢复地球显示
//     pre = undefined;  // 解除引用
//   }

//   // 取消动画循环
// 	cancelAnimationFrame(loopRender);
// 	// viewer.entities.removeAll();
// });

onBeforeUnmount(() => {
  // 获取ID为'contents'的元素
  let viewer = DTScopeEngine.viewer;
  removeFromDTGlobeConfig(viewer, models.layerUids);
  // buildingctner.clearLabel('scene');
  viewer.scene.globe.show = true;
  viewer.scene.skyAtmosphere.show = true;

  const contentsElement1 = document.getElementById('contents1');
  const contentsElement2 = document.getElementById('contents2');

  // 检查元素是否存在
  if (contentsElement1) {
    contentsElement1.innerHTML = '';
  }
  if (contentsElement2) {
    contentsElement2.innerHTML = '';
  }
  pre.deleteTScaler();
  // pre.deleteTEG();
  pre.clearPrimitiveModel();
  pre.loadEarth();
});

// 假设用 isRadar 控制显示哪个界面
// 你可以根据实际业务逻辑设置 isRadar 的值
const isBLDZ = ref(false); // 不良地质
const isRadar = ref(false); // 地质雷达
const showzzmsm = ref(true); // 掌子面素描
const isAHD = ref(false); // 超前水平钻
const isDBH = ref(false); // 加深炮孔
const isTSP = ref(false); // TSP反演
const isTEM = ref(false); // 瞬变电磁
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables';

.contents {
  color: rgb(80 213 213);
  font-weight: bolder;
}

#main-panel {
  z-index: 0;
  width: 100vw;
  height: 100vh;
}

#left-panel {
  position: absolute;

  // top: calc(50% + 25px);
  top: 75px;

  // right: 0.1rem;
  left: 20px;
  z-index: 2;
  width: 10vw;

  // height: 20px;
  // transform: translateY(-50%);

  // background-color: white;
}

.left {
  width: 100%;
  height: 650px;
  height: 100%;
  border: 2px solid rgb(8 175 164 / 83%);

  /* 蓝绿色边框 */

  // box-shadow: inset 0 0 8px 2px rgb(186, 190, 192);
  border-radius: 0.8em;
  flex-direction: column;
  font-size: 22px;
  background-color: rgb(0 0 0 / 62.6%);

  .header {
    // flex-shrink: 0; /* 确保 header 高度固定 */
    width: 100%;
    height: 50px;

    /* 设定一个固定高度 */
    margin-bottom: 0.5em;
    padding-top: 0.3em;
    padding-bottom: 0.3em;
    padding-left: 1em;
    border-radius: 0.6em 0.6em 0 0;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 1em;
    font-weight: 600;
    white-space: 1em;
    background-color: rgb(8 175 164 / 83%);

    /* 点击或悬停时填充蓝绿色 */
    // background: linear-gradient(to right, rgb($color-title-01, 1), 40%, rgba($color-title-01, 0));
  }

  .content {
    // flex-grow: 1; /* 让 content 填充剩余空间 */
    // overflow-y: auto; /* 允许滚动，防止内容溢出 */
    padding-left: 10px;

    //  box-shadow: inset 0 0 10px 5px rgba(171, 178, 187, 0.8);
  }
}

.geologylegendfsd {
  position: absolute;
  right: 20px;
  top: 720px;
  width: 140px;
  height: 120px;
  background-image: url('./Assets/images/FSD.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.geologylegendpsd {
  position: absolute;
  right: 20px;
  top: 720px;
  width: 140px;
  height: 120px;
  background-image: url('./Assets/images/PSD.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>

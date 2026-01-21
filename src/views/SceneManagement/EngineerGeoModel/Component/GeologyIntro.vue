<!--
 * @Author: xiongxu
 * @Date: 2023-02-09 12:46:08
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-18 09:45:07
 * @FilePath: \Geology-v3\src\views\SceneManagement\EngineerGeoModel\Component\GeologyIntro.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->

<template>
  <div>
    <div class="intro-container">
      <div class="text-container">
        <h3 class="title">地质概况</h3>
        <p class="text">
          康定2号隧道海拔3220m～3820m，最大埋深1215m，地质条件复杂，岩性以花岗岩、砂板岩为主，Ⅳ、Ⅴ级围岩占比达85.5%，隧道穿越多条断层破碎带及活动断裂带，存在岩爆、高地温、软岩大变形、低瓦斯、突泥突水等不良地质，其中岩爆段落2340m，占比22%；高地温（最高达近60℃）段落5120m,占比47%；软岩大变形段落2620m，占比24%；低瓦斯段落3606m，占比达33%；突泥突水2253m，占比21%
        </p>
      </div>
    </div>
    <div v-show="chartstate" class="warpb-r">
      <div class="echarts-warpb">
        <div id="mainr" class="pieb" />
      </div>
      <div class="r-container">
        <ChartCard
          v-for="(item, index) in dataR"
          :key="index"
          :length="item.value"
          :proportion="(item.value / sum).toFixed(2)"
          :custom-color="colorR[index]"
          :legend="item.name"
        />
      </div>
    </div>
    <div class="warpb-l">
      <div class="echarts-warpb">
        <div id="mainl" class="pieb" />
      </div>
      <div class="r-container">
        <ChartCard
          v-for="(item, index) in dataL"
          :key="index"
          :length="item.value"
          :proportion="(item.value / sum).toFixed(2)"
          :custom-color="colorL[index]"
          :legend="item.name"
        />
      </div>
    </div>
  </div>
  <div class="keyin-legend">
    <div class="key" style="color: rgb(144 224 100)">A-岩爆</div>
    <div class="key" style="color: rgb(255 200 150)">S-高地温</div>
    <div class="key" style="color: rgb(255 255 255)">D-瓦斯</div>
    <div class="key" style="color: rgb(163 127 253)">F-突泥突水</div>
    <div class="key" style="color: rgb(150 200 255)">G-软岩大变形</div>
    <div class="key" style="color: rgb(255 255 0)">H-取消</div>
  </div>
</template>

<script setup lang="ts">
import ChartCard from './ChartCard.vue';
import { GeologyExpose } from '../Utils/NewOpera/GeologyExpose';
import { onMounted, ref, onUnmounted, watch, computed, onBeforeUnmount } from 'vue';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import * as echarts from 'echarts';
import store from '../store';

let chartL = undefined;
let chartR = undefined;
let chartstate = true;
let colorL = ref(['#48cda6', '#fd87fb', '#11abff']);
let colorR = ref(['#48cda6', '#fd87fb', '#11abff', '#ffdf6f']);
let dataL = ref(
  Object.freeze([
    { value: 2340, name: '岩爆' },
    { value: 7090, name: '大变形' },
    { value: 6420, name: '高温热害' },
  ])
);
let dataR = ref(
  Object.freeze([
    { value: 2340, name: 'Ⅲ级' },
    { value: 4420, name: 'Ⅳ级' },
    { value: 3820, name: 'Ⅴ级' },
    { value: 203, name: 'Ⅵ级' },
  ])
);
let sum = 20792.861;

let titleCommonStyle = {
  // x: 'center',
	// left: 10,
	left: 'center',
	// top: 10,
	top: 5,
  color: '#FFFFFF',
  textStyle: {
    fontSize: 15,
    lineHeight: 20,
    width: 400,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
};

let seriesCommon = {
  type: 'pie',
  radius: ['50', '60%'],
  avoidLabelOverlap: false,
  center: ['22%', '55%'],
  left: 0,
};

let seriesLabel = {
  show: true,
  color: '#FFFFFF',
  fontSize: '14',

  position: 'center',
};

let option1 = {
  title: {
    text: '岩爆分布情况',
    ...titleCommonStyle,
  },
  color: ['#87D3A0', '#34A239'],
  series: [
    {
      name: '岩爆等级',
      data: [
        { value: 520, name: '轻微岩爆' },
        { value: 1820, name: '中等岩爆' },
      ],
      ...seriesCommon,
      label: { ...seriesLabel, formatter: '总长2340m' },
    },
  ],
};
let option2 = {
  title: {
    text: '高地温分布情况',
    ...titleCommonStyle,
  },
  color: ['#EA5706', '#E70909', '#BD1E03'],
  series: [
    {
      name: '高地温等级',
      data: [
        { value: 1880, name: '热害轻微' },
        { value: 2940, name: '热害中等' },
        { value: 300, name: '热害较严重' },
      ],
      ...seriesCommon,
      label: { ...seriesLabel, formatter: '总长5120m' },
    },
  ],
};
let option3 = {
  title: {
    text: '低瓦斯分布情况',
    ...titleCommonStyle,
  },
  color: ['#FFFFFF', '#000000'],
  series: [
    {
      name: '低瓦斯分布',
      data: [
        { value: 3606, name: '低瓦斯' },
        { value: 7200, name: '非瓦斯' },
      ],
      ...seriesCommon,
      label: { ...seriesLabel, formatter: '总长3606m' },
    },
  ],
};
let option4 = {
  title: {
    text: '突泥突水分布情况',
    ...titleCommonStyle,
  },
  color: ['#9574E6', '#D8E438'],
  series: [
    {
      name: '涌水类型',
      data: [
        { value: 2253, name: '涌水区域' },
        { value: 8547, name: '非涌水区域' },
      ],
      ...seriesCommon,
      label: { ...seriesLabel, formatter: '总长2253m' },
    },
  ],
};
let option5 = {
  title: {
    text: '软岩大变形分布情况',
    ...titleCommonStyle,
  },
  color: ['#00B0F0', '#0070C0', '#0404CC'],
  series: [
    {
      name: '变形等级',
      data: [
        { value: 1160, name: '轻微大变形' },
        { value: 640, name: '中等大变形' },
        { value: 820, name: '严重大变形' },
      ],
      ...seriesCommon,
      label: { ...seriesLabel, formatter: '总长2620m' },
    },
  ],
};

let optionL = {
  title: {
    text: '不良地质占比',
    ...titleCommonStyle,
  },
  color: colorL.value,
  series: [
    {
      name: '围岩等级',
      ...seriesCommon,
      data: dataL.value,
      label: {
        ...seriesLabel,
        formatter: '20792.861 m\n全长',
      },
    },
  ],
};
let optionR = {
  title: {
    text: '围岩等级分布(总长10.8km)',
    ...titleCommonStyle,
  },
  color: colorR.value,
  series: [
    {
      name: '围岩等级',
      ...seriesCommon,
      data: dataR.value,
      label: {
        ...seriesLabel,
        formatter: '20792.861 m\n全长',
      },
    },
  ],
};

let currentItemIndex = computed(() => store.state.currentItemIndex);
watch(currentItemIndex, (value) => {
  initChart(value);
});

onMounted(() => {
  const callback = () => {
    // terrain excavation
    let expose = new GeologyExpose({
      viewer: DTScopeEngine.viewer,
      store: store,
    });
    expose.activate();
    // 初始化左右chart
    chartR = initChartB('mainr', optionR);
    chartL = initChartB('mainl', optionL);
  };
  DTScopeEngine.getViewer(callback);
});
onBeforeUnmount(() => {
  clearScene();
});
function initChartB(id, option) {
  let myChart = echarts.init(document.getElementById(id));
  myChart.setOption(option);
}

function initChart(_index) {
  let choose = undefined;
  switch (_index) {
    case '3-1':
      choose = option1;
      break;
    case '3-2':
      choose = option2;
      break;
    case '3-3':
      choose = option3;
      break;
    case '3-4':
      choose = option4;
      break;
    case '3-5':
      choose = option5;
      break;
    default:
      choose = undefined;
      break;
  }
  if (choose == undefined) {
    return;
  }
  // update the ChartCard data
  dataR.value = choose.series[0].data;
  colorR.value = choose.series[0].label.color;
  // draw the pie chart
  if (choose !== undefined) {
    if (chartR != null && chartR != undefined) {
      chartR.dispose();
    }
    chartR = echarts.init(document.getElementById('mainr'));
    chartR.setOption(choose);
    chartstate = true;
  } else {
    chartstate = false;
  }
}
function clearScene() {
  let expose = new GeologyExpose({ viewer: DTScopeEngine.viewer });
  expose.deactivate();
  chartR?.dispose();
  chartL?.dispose();
}
</script>

<style lang="scss" scoped>
/* stylelint-disable-next-line scss/dollar-variable-pattern */
$panelTop: 70px;

.intro-container {
  position: absolute;
  top: $panelTop;
  left: 55%;
  z-index: 100;
  width: 650px;
  width: 600px;

  // height: 272px;
  height: 260px;
  border: 2px solid rgb(8 175 164 / 83%);
  border-radius: 20px;
  overflow: hidden;
  background-color: rgb(25 86 94 / 70%);
  transform: translateX(-50%);
  pointer-events: auto;
}

.text-container {
  position: absolute;

  // padding: 15px;

  // border: 2px solid rgb(13 214 184 / 74.8%);

  // border-radius: 20px;
  line-height: 26px;
  font-size: 18px;

  // text-shadow: 4px 4px 4px blue;
  // background-color: rgb(68 107 163 / 80%);
}

.title {
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 2px solid rgb(8 175 164 / 83%);
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-align: center;

  // background-color: rgb(67 153 147 / 83%);
}

.text {
  padding: 0 15px;
}

.charts-container {
  position: absolute;
  top: 700px;
  right: 50px;
  left: 45px;
  padding: 5px;
  border-radius: 40px;
  overflow: hidden;
  background-color: #00040dcc;
}

.warpb-l {
  position: absolute;
  top: $panelTop;
  left: 230px;

  // left: 320px;
  z-index: 99;
  width: 400px;
  height: 260px;
  border: 2px solid rgb(8 175 164 / 83%);
  border-radius: 20px;
  text-align: center;
  background-color: rgb(25 86 94 / 70%);
}

.warpb-r {
  position: absolute;
  top: $panelTop;
  right: 20px;
  z-index: 99;
  width: 420px;
  height: 260px;
  border: 2px solid rgb(8 175 164 / 83%);
  border-radius: 20px;
  text-align: center;
  background-color: rgb(25 86 94 / 70%);
}

.echarts-warpb {
  position: relative;
  width: 100%;
  height: 100%;
}

.r-container {
  position: absolute;
  right: 10px;
  top: 55%;
  transform: translateY(-50%);
}

.pieb {
  width: 400px;
  height: 260px;
  pointer-events: auto;
}

.slide-gyintro-enter-active,
.slide-gyintro-leave-active {
  transition: all 1.5s;
}

.slide-gyintro-enter,
.slide-gyintro-leave-to {
  opacity: 0;
}

.keyin-legend {
  display: flex;
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 9;
  padding: 10px;

  // border: 2px solid rgb(8 175 164 / 83%);
  border-radius: 10px;
  flex-direction: column;

  // flex-direction: row;
  font-size: 20px;

  // background-color: rgb(25 86 94 / 70%);

  background-color: rgb(25 86 94 / 70%);

  // transform: translateX(-50%);

  .key {
    margin: 10px;
  }
}
</style>

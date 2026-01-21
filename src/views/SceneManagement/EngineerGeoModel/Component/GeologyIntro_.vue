<!--
 * @Author: xiongxu
 * @Date: 2023-02-09 12:46:08
 * @LastEditors: xingxu-webgis 1833104160@qq.com
 * @LastEditTime: 2024-02-29 22:41:26
 * @FilePath: \Geology-v3\src\views\SceneManagement\EngineerGeoModel\Component\GeologyIntro.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->

<template>
  <div>
    <div class="intro-container">
      <div class="text-container">
        康定2号隧道海拔3220m～3820m，最大埋深1215m，地质条件复杂，岩性以花岗岩、砂板岩为主，
        Ⅳ、Ⅴ级围岩占比达85.5%，隧道穿越多条断层破碎带及活动断裂带，存在岩爆、高地温、软岩大变形、低瓦斯、
        突泥突水等不良地质，其中岩爆段落2340m，占比22%；高地温（最高达近60℃）段落5120m，
        占比47%；软岩大变形段落2620m，占比24%；低瓦斯段落3606m，占比达33%；突泥突水2253m，占比21%
      </div>
    </div>
    <div class="warpb-r">
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
</template>

<script setup lang="ts">
import ChartCard from './ChartCard.vue';
import { GeologyExpose } from '../Utils/NewOpera/GeologyExpose';
import { onMounted, ref, onUnmounted } from 'vue';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import * as echarts from 'echarts';
let chartL = undefined;
let chartR = undefined;

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
onMounted(() => {
  const callback = () => {
    // terrain excavation
    let expose = new GeologyExpose({
      viewer: DTScopeEngine.viewer,
    });
    expose.activate();
  };
  DTScopeEngine.getViewer(callback);
  // draw pie charts
  let optionL = {
    title: {
      text: '不良地质占比',
      x: 'center',
      left: 10,
      top: 10,
      color: '#333333',
      borderColor: '#4160B5',
      align: 'center',
      // borderWidth: 2,
      borderRadius: 10,
      textStyle: {
        fontSize: 18,
        lineHeight: 20,
        width: 400,
        color: '#FFFFFF',
        fontWeight: 'normal',
      },
    },
    color: colorL.value,
    series: [
      {
        name: '围岩等级',
        type: 'pie',
        radius: ['60', '60%'],
        avoidLabelOverlap: false,
        center: ['22%', '55%'],
        left: 0,
        data: dataL.value,
        label: {
          show: true,
          color: '#FFFFFF',
          fontSize: '18',
          formatter: '20792.861 m\n全长',
          position: 'center',
        },
      },
    ],
  };
  let optionR = {
    title: {
      text: '围岩等级分布(总长10.8km)',
      x: 'center',
      left: 10,
      top: 10,
      color: '#333333',
      borderColor: '#4160B5',
      align: 'center',
      // borderWidth: 2,
      borderRadius: 10,
      textStyle: {
        fontSize: 18,
        lineHeight: 20,
        width: 400,
        color: '#FFFFFF',
        fontWeight: 'normal',
      },
    },
    color: colorR.value,
    series: [
      {
        name: '围岩等级',
        type: 'pie',
        radius: ['60', '60%'],
        avoidLabelOverlap: false,
        center: ['22%', '55%'],
        left: 0,
        data: dataR.value,
        label: {
          show: true,
          color: '#FFFFFF',
          fontSize: '18',
          formatter: '20792.861 m\n全长',
          position: 'center',
        },
      },
    ],
  };
  chartR = initChartB('mainr', optionR);
  chartL = initChartB('mainl', optionL);
});
onUnmounted(() => {
  clearScene();
});
function initChartB(id, option) {
  let myChart = echarts.init(document.getElementById(id));
  myChart.setOption(option);
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
$panelTop: 135px;

.intro-container {
  position: absolute;
  top: $panelTop;
  left: 50%;
  z-index: 100;
  width: 650px;
  height: 272px;
  overflow: hidden;
  transform: translateX(-50%);
  pointer-events: auto;
}

.text-container {
  position: absolute;
  padding: 15px;
  border-radius: 20px 0;
  line-height: 26px;
  font-size: 18px;
  text-shadow: 4px 4px 4px blue;
  background-color: rgb(68 107 163 / 80%);
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
  left: 10px;
  z-index: 99;
  width: 400px;
  height: 260px;
  border-radius: 20px;
  text-align: center;
  background-color: rgb(68 107 163 / 80%);
}

.warpb-r {
  position: absolute;
  top: $panelTop;
  right: 10px;
  z-index: 99;
  width: 400px;
  height: 260px;
  border-radius: 20px;
  text-align: center;
  background-color: rgb(68 107 163 / 80%);
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
</style>

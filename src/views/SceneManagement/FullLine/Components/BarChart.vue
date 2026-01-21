<!--
 * @Author: Lhaha019 2821445109@qq.com
 * @Date: 2025-05-16 16:15:33
 * @LastEditors: Lhaha019 2821445109@qq.com
 * @LastEditTime: 2025-05-28 11:11:49
 * @FilePath: \Geology-v3\src\views\SceneManagement\FullLine\Components\BarChart.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="right">
    <div class="top-row">
      <span>风险选择</span>
      <div class="showBars" @click="toggleBars">{{ showBars ? '隐藏柱状图' : '显示柱状图' }}</div>
    </div>
    <div class="custom-select">
      <select v-model="selectedRisks" @change="onRiskChange">
        <option value="ALL">全部</option>
        <option value="BC">冰川冰湖</option>
        <option value="XP">斜坡变形区</option>
        <option value="WD">稳定历史变形破坏区</option>
        <option value="FH">复活历史变形破坏区</option>
      </select>
      <span class="select-arrow"></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import * as Cesium from 'Cesium';
import { Viewer, Entity, Cartesian3, PolylineGraphics } from 'Cesium';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import disasterPoints from '../Config/disasterPoints.json';

const HEIGHT_SCALE = 6000;
const COLOR_MAP = {
  WD: Cesium.Color.fromCssColorString('rgb(255, 255, 0)'),
  BC: Cesium.Color.fromCssColorString('rgb(0, 176, 240)'),
  FH: Cesium.Color.fromCssColorString('rgb(146, 208, 80)'),
  XP: Cesium.Color.fromCssColorString('rgb(255, 0, 0)'),
};

let viewer: Viewer | null = null;
let barEntities: Entity[] = [];

const selectedRisks = ref('ALL');

const showBars = ref(false); // 初始隐藏柱状图

const toggleBars = () => {
  showBars.value = !showBars.value;
  if (showBars.value) {
    drawBars();
  } else {
    clearEntities();
    const position = Cesium.Cartesian3.fromDegrees(97.584432, 30.2050015, 1600000);
    viewer.camera.flyTo({
      destination: position,
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0,
      },
    });
  }
};

// 监听风险选择变化
const onRiskChange = () => {
  if (showBars.value) {
    clearEntities();
    drawBars();
  }
};

const clearEntities = () => {
  if (viewer) {
    barEntities.forEach((entity) => viewer?.entities.remove(entity));
    barEntities = [];
  }
};

const drawBar = (segment: any, type: string, baseHeight: number) => {
  const mid = segment.mid;
  const height = segment[type] * HEIGHT_SCALE;
  const surfacePosition = Cartesian3.fromDegrees(mid.x, mid.y, baseHeight);
  const endPosition = Cartesian3.fromDegrees(mid.x, mid.y, baseHeight + height);

  const polyline = new PolylineGraphics({
    positions: [surfacePosition, endPosition],
    width: 4,
    material: COLOR_MAP[type],
  });

  const entity = viewer?.entities.add(new Entity({ polyline }));
  if (entity) {
    barEntities.push(entity);
  }
};

const drawBars = () => {
  disasterPoints.forEach((segment) => {
    let baseHeight = 0;

    if (selectedRisks.value === 'ALL') {
      ['WD', 'BC', 'FH', 'XP'].forEach((type) => {
        drawBar(segment, type, baseHeight);
        baseHeight += segment[type] * HEIGHT_SCALE;
        const mid = segment.mid;
      });
    } else {
      drawBar(segment, selectedRisks.value, 0);
      const mid = segment.mid;
    }
  });

  // 调整视角
  const flyToPosition = Cesium.Cartesian3.fromDegrees(97.584432, 20.5050015, 1000000);
  viewer.camera.flyTo({
    destination: flyToPosition,
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-45.0),
      roll: 0.0,
    },
  });
};

onMounted(() => {
  viewer = DTScopeEngine.viewer;
  if (!viewer) {
    console.error('viewer初始化失败');
    return;
  }
});

onBeforeUnmount(() => {
  barEntities.forEach((entity) => viewer?.entities.remove(entity));
});
</script>

<style lang="scss">
.right {
  display: flex;
  position: absolute;
  top: 100px;
  right: 20px;
  z-index: 1;
  padding: 15px;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  background-color: rgb(25 86 94 / 80%);
  gap: 10px;
}

.top-row {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;

  .showBars {
    padding: 2px;
    border-left: 1px solid rgb(23 235 219);
    border-right: 1px solid rgb(23 235 219);
    border-radius: 5px;
    font-size: 12px;
    color: rgb(29 209 194);
    cursor: pointer;
  }
}

.custom-select {
  position: relative;
  width: 170px;

  select {
    width: 100%;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    background-color: #fff;
    cursor: pointer;
    appearance: none;
  }

  .select-arrow {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid #333;
    pointer-events: none;
  }

  select:hover {
    background-color: #f0f0f0;
  }

  select:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgb(0 123 255 / 25%);
  }
}
</style>

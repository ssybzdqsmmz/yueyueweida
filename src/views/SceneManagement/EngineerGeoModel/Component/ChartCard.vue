<!--
 * @Date: 2024-03-19 15:43:39
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-31 08:57:22
 * @FilePath: \Geology-V3\src\views\SceneManagement\EngineerGeoModel\Component\ChartCard.vue
 * @Author: xingxu-webgis 1833104160@qq.com
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="card" :style="{ '--width': customWidth }">
    <div class="fl" :style="{ '--bgColor': customColor }">
      {{ legend }}
    </div>
    <div class="fr">
      <span class="lineStyle"
        >长度&ensp;
        <strong class="fs18">{{ length }}</strong>
        &ensp;&emsp;&emsp;<span class="ar5">m</span></span
      ><br />
      <span class="lineStyle"
        >占比&ensp;
        <strong class="fs18">{{ proportion }}</strong>
        &ensp;&emsp;&emsp;<span class="ar5">%</span></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  length: Number,
  proportion: String,
  legend: String,
  customColor: String,
  customWidth: {
    type: String,
    default: '220px',
  },
});
</script>

<style lang="scss">
.card {
  position: relative;

  // width: var(--width);

	width: 210px;
  height: 45px;
  margin: 5px 0 0;
  border: 2px solid rgb(8 175 164 / 83%);
  border-radius: 10px;
  font-size: 14px;

  // background: linear-gradient(#54b2ca, #3f85a3);

  .fl {
    float: left;
    margin-left: 18px;
    line-height: 45px;

    &::before {
      position: absolute;
      top: 50%;
      left: 5px;
      width: 10px;
      height: 10px;
      border-radius: 10px;
      background: var(--bgColor);
      content: '';
      transform: translateY(-50%);
    }
  }

  .fr {
    float: right;
    width: 130px;
  }

  .ar5 {
    position: absolute;
    right: 5px;
  }
}

.lineStyle {
  float: left;
}

.fs18 {
  font-size: 14px;
}
</style>

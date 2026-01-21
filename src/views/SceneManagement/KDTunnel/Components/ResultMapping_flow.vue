<!--
 * @Date: 2023-03-26 16:45:36
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-14 12:37:46
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnel\Components\ResultMapping_flow.vue
-->
<template>
  <div class="panel0">
    <p class="panel_p">区域坡度多为20-40°，坡向东北，泥石流方量6.58×10^5m³</p>
  </div>
  <div class="panel00">
    <p class="panel_p">模拟计算泥石流灾害结果分析，影响区域周围公路和建筑</p>
  </div>
  <div class="panel">
    <p class="panel_p">隧道入口出泥石流堆积厚度</p>
    <div class="content">
      <div id="flow"></div>
    </div>
  </div>
  <div class="panel2">
    <p class="panel_p2">泥石流运动过程关键点信息</p>
    <div class="content2">
      <el-table max-height="500" highlight-current-row :data="flowpoint" :row-style="{ height: '0' }" :cell-style="{ padding: '2px' }" row-key="id">
        <el-table-column width="67" prop="warningpoint" label="关键点" header-align="center" align="center"></el-table-column>
        <el-table-column width="114" prop="sudu" label="流速(m/s)" header-align="center" align="center" sortable></el-table-column>
        <el-table-column width="104" prop="houdu" label="泥深(m)" header-align="center" align="center" sortable></el-table-column>
        <el-table-column width="120" prop="nengliang" label="能量(J/Kg)" header-align="center" align="center" sortable></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import * as echarts from 'echarts';
let data = reactive([
  {
    name: '泥石流堆积厚度',
    type: 'line',
    data: [3218.1046, 3222.7668, 3224.4753, 3218.1046, 3222.7668, 3224.4753, 3227.1009, 3227.0603, 3226.8766, 3230.226, 3231.5579, 3232.2724],
  },
  {
    name: '剖面地形',
    type: 'line',
    data: [3211.1702, 3211.1702, 3212.2842, 3211.1702, 3211.1702, 3212.2842, 3215.5991, 3217.1086, 3218.5269, 3219.6433, 3220.4072, 3220.9712],
  },
]);
const option = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['泥石流堆积厚度', '剖面地形'],
    selected: {
      泥石流堆积厚度: true,
      剖面地形: true,
    },
  },
  grid: {
    left: '4%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: true,
    },
    data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110],
  },
  yAxis: {
    type: 'value',
    name: '单位：m',
    nameLocation: 'end',
    min: 3210,
    axisLine: {
      show: true,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
  },
  series: data,
};
const flowpoint = reactive([
  {
    warningpoint: 'p1',
    sudu: 34.52958,
    houdu: 12.39748,
    nengliang: 20.61662,
  },
  {
    warningpoint: 'p2',
    sudu: 39.32679,
    houdu: 8.22419,
    nengliang: 15.58126,
  },
  {
    warningpoint: 'p3',
    sudu: 32.71244,
    houdu: 8.22419,
    nengliang: 15.91219,
  },
]);

onMounted(() => {
  let chartDom = document.getElementById('flow');
  let myChart = echarts.init(chartDom);
  chartDom.setAttribute('_echarts_instance_', '');
  myChart.setOption(option);
});
</script>
<style lang="scss" scoped>
.panel0 {
  display: grid;
  position: absolute;
  left: 10px;
  width: 510px;
  height: 30px;
  margin-top: 5px;
  border-width: 5px;
  background-color: #ffffff;
  border-style: solid;
  grid-template-rows: 30px 165px;

  .panel_p {
    margin-top: 0;
    font-size: 16px;
    color: #000000;
  }
}

.panel00 {
  display: grid;
  position: absolute;
  left: 10px;
  width: 510px;
  height: 30px;
  margin-top: 42px;
  border-width: 5px;
  background-color: #ffffff;
  border-style: solid;
  grid-template-rows: 30px 165px;

  .panel_p {
    margin-top: 0;
    font-size: 16px;
    color: #000000;
  }
}

.panel {
  display: grid;
  position: absolute;
  left: 10px;
  width: 510px;
  height: 260px;
  margin-top: 80px;
  border-width: 5px;
  background-color: #ffffff;
  border-style: solid;
  grid-template-rows: 30px 185px;

  .panel_p {
    margin-top: 0;
    font-size: 16px;
    color: #000000;
  }

  .content {
    width: 500px;
    justify-content: center;
  }
}

.panel2 {
  display: grid;
  position: absolute;
  left: 10px;
  width: 510px;
  height: 100px;
  margin-top: 350px;
  padding: 0;
  border-width: 0;
  background-color: #ffffff;
  border-style: solid;
  grid-template-rows: 30px 165px;

  .panel_p2 {
    margin-top: 0;
    margin-left: 5px;
    color: #000000;
    font-size: 16px;
  }

  .content2 {
    display: flex;
    left: 0;
    width: 100%; /* 撑满父容器 */
    margin-top: 0;
    justify-content: center;
  }
}

#flow {
  width: 480px;
  height: 220px;
}
</style>

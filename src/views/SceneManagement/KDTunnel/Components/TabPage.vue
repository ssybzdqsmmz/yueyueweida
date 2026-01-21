<!--
 * @Author: 枫林残忆 2997534654@qq.com
 * @Date: 2024-04-14 12:47:10
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-19 14:25:11
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnel\Components\TabPage.vue
 * @Description: 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * 
-->
<script lang="ts" setup>
import Legend from './Legend.vue';
import KnowledgeVisual from '@/views/Knowledge/KnowledgeVisual.vue';
import KG from '@/views/Knowledge/Knowledgeflow.vue';
import Result from './Result.vue';
import { ref } from 'vue';

const activeTab = ref('knowledge-graph');

const result = ref(null); // 两个组件更新
const knowledge = ref(null);
const legend = ref(null);
const mapTab = ref(0);

defineExpose({
  updateView: (graphName) => {
    result.value.changeHazardResult(graphName);
    legend.value.changeLegendResult(graphName);
    knowledge.value.render(graphName);
  },
});
</script>

<template>
  <div>
    <div class="btn-group">
      <el-button
        @click="
          () => {
            activeTab = 'knowledge-graph';
          }
        "
        >知识图谱</el-button
      >
      <el-button
        @click="
          () => {
            activeTab = 'knowledge-information';
          }
        "
        >统计信息</el-button
      >
    </div>
    <!-- <KnowledgeVisual v-show="activeTab == 'knowledge-graph'" ref="knowledge"></KnowledgeVisual> -->
    <div v-show="activeTab == 'knowledge-graph'" class="knowledge-info">
      <!-- 图谱选择按钮 -->
      <div>
        <component :is="KG" :kgTab="mapTab" />
      </div>
    </div>
    <div v-show="activeTab == 'knowledge-information'" class="knowledge-info">
      <Result ref="result"></Result>
    </div>
    <Legend ref="legend"></Legend>
  </div>
</template>

<style lang="scss" scoped>
.btn-group {
  position: absolute;
  top: 80px;
  right: 50px;

  .el-button {
    border: none;
    border-radius: 10px;
    border-radius: 50px;
    overflow: hidden;
    color: #ffffff;

    // color: $item-title-color;
    // background-color: $bg-color-no-transparent;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
    background-position: center;
    background-size: 200%, 200%;
    background-color: rgb(33 102 111 / 60%);
    box-shadow: 0 4px 8px rgb(0 0 0 / 30%), 0 6px 20px rgb(0 0 0 / 20%), inset 0 1px 0 rgb(255 255 255 / 30%);

    &:hover {
      color: $item-content-active-color;
    }
  }
}

.knowledge-info {
  position: absolute;
  top: 120px;
  right: 10px;
  z-index: 1;
  width: 520px;
  height: 450px;
  background-color: rgb(249 252 255 / 0%);
}
</style>

<!--
 * @Author: anganao
 * @Date: 2024-03-13 14:52:54
 * @LastEditors: anganao
 * @LastEditTime: 2024-03-13 15:27:37
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Components\TerrainExcave.vue
 * @Description: 
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<script setup>
import TerrainClip from '../Utils/TerrainClip.js';
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  TerrainClip.getInstance().bind();
});
onUnmounted(() => {
  TerrainClip.getInstance().unBind();
  clear();
});

function clear() {
  TerrainClip.getInstance().clear();
}
</script>

<template>
  <div class="clear" @click="clear()">
    <img src="../Assets/svg/清除.svg" class="broom" />
  </div>
</template>

<style scoped lang="scss">
.clear {
  position: absolute;
  top: 80px;
  right: 40px;
  z-index: 1;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  font-size: 16px;
  text-align: center;
  background-color: rgb(31 124 116);

  &:hover {
    background-color: rgb(11 73 68);
  }

  .broom {
    width: 40px;
    height: 40px;
    margin: 5px;
  }
}
</style>

<!--
 * @Author: anganao
 * @Date: 2024-03-09 15:46:20
 * @LastEditors: anganao
 * @LastEditTime: 2024-03-12 16:19:30
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Components\RollShutterSub.vue
 * @Description: 
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<template>
  <div id="compareContainer">
    <transition name="slide-left">
      <div class="leftPanel" v-if="status">{{ props.layerDate[0] }}</div>
    </transition>
    <transition name="slide-right">
      <div class="rightPanel" v-if="status">{{ props.layerDate[1] }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
const props = defineProps(['layerDate']);
const status = ref(false);

onMounted(() => {
  status.value = true;
  console.log(props.layerDate);
});
onBeforeUnmount(() => {
  status.value = false;
});
</script>

<style scoped lang="scss">
#compareContainer {
  --board-width: 300px;
  --board-height: 60px;

  position: absolute;
  top: 120px;
  z-index: 1;
  width: 100%;
  height: 300px;
  font-size: 28px;
  letter-spacing: 8px;
  pointer-events: none;

  .leftPanel {
    position: absolute;
    left: 200px;
    width: var(--board-width);
    height: var(--board-height);
    padding-right: 50px;
    border-radius: 15px;
    line-height: var(--board-height);
    text-align: right;
    text-shadow: 0 0 1px #fff, 0 0 30px #228dff, 0 0 50px #228dff;
    background: linear-gradient(90deg, #0000, #235175);
  }

  .rightPanel {
    position: absolute;
    right: 200px;
    width: var(--board-width);
    height: var(--board-height);
    padding-left: 50px;
    border-radius: 15px;
    line-height: var(--board-height);
    text-align: left;
    text-shadow: 0 0 1px #fff, 0 0 30px #228dff, 0 0 50px #228dff;
    background: linear-gradient(-90deg, #0000, #235175);
  }

  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: all 3s;
  }

  .slide-left-enter-from,
  .slide-left-leave-to {
    transform: translateX(-200px);
    opacity: 0;
  }

  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 3s;
  }

  .slide-right-enter-from,
  .slide-right-leave-to {
    transform: translateX(200px);
    opacity: 0;
  }
}
</style>

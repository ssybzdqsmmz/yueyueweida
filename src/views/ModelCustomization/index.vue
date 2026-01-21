<!--
 * @Author: Lincong-pro
 * @Date: 2023-03-30 14:55:14
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-31 13:11:08
 * @FilePath: \geoproject2.0\src\views\ModelCustomization\index.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div class="model-customization" :style="{ '--bottom': config.bottom, '--bar': config.bar }">
    <div class="title"><span>&nbsp;&nbsp;建模流程定制</span></div>
    <div class="container">
      <LeftMenu></LeftMenu>
      <CanvasArea></CanvasArea>
      <Log></Log>
    </div>
    <div class="switchBar" @click="changeShow"></div>
  </div>
</template>

<script lang="ts" setup>
import CanvasArea from './CanvasArea.vue';
import Log from './Log.vue';
import LeftMenu from './LeftMenu.vue';
import { reactive } from 'vue';

const config = reactive({
  bottom: 10,
  bar: 0,
});

const changeShow = () => {
  config.bottom = config.bottom == 10 ? -395 : 10;
  config.bar = config.bar == 0 ? 10 : 0;
};
// close the window when the initial page is loaded
changeShow();
</script>

<style lang="scss" scoped>
@media screen and (min-height: 1079px) {
  .model-customization {
    top: 678px;
  }
}

.model-customization {
  position: absolute;
  bottom: calc(var(--bottom) * 1px);
  left: 50%;
  width: 1445px;
  height: 395px;
  transform: translateX(-50%);
  background-color: rgb(37 75 102 / 37.7%);
  transition: 0.5s ease-in-out;

  .title {
    width: 100%;
    height: 35px;
    background: url('@/assets/images/建模流程定制/titleBar.svg') no-repeat;
    background-size: 100% 100%;

    span {
      line-height: 35px;
    }
  }

  .container {
    display: flex;
  }

  .switchBar {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 50%;
    width: 13px;
    transform-origin: center;
    transform: translate(-50%, calc(-50% - calc(var(--bar) * 1px))) rotate(90deg);
    height: 186px;
    background-image: url('@/assets/images/dtglobe/u538.svg');

    &:hover {
      cursor: pointer;
    }

    transition: 0.5s ease-in-out;
  }
}
</style>

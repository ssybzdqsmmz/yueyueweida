<!--
 * @Author: Guo yongxin
 * @Date: 2022-08-02 21:06:20
 * @LastEditTime: 2024-04-17 20:22:48
 * @LastEditors: anganao 1928882425@qq.com
 * @Description: Root Vue.js File.
 * @FilePath: \Geology-v3\src\App.vue
-->
<template>
  <div id="app">
    <router-view />
  </div>
  <div id="vgeLogo"></div>
</template>

<script setup>
//
</script>

<style lang="scss">
@import '@/assets/styles/base.css';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

@font-face {
  font-family: TRENDS;
  font-size: 36px;
  src: url('@/assets/font/trends.ttf');
}

@font-face {
  font-family: DIN;
  src: url('@/assets/font/DIN-Regular.ttf');
}

.dt-center-slider-icon {
  transform: translate(-3px, -2px);
}

html,
body,
#app,
.wrapper {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  font-family: 'PingFang SC';
  color: rgb(255 255 255 / 100%);
  user-select: none;

  /* 火狐 */
  font-size: 12px;
}

.tooltip-style {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 5px 6px;
  background: rgba($color: #000000, $alpha: 60%);
}

#vgeLogo {
  position: absolute;
  right: 20px;
  bottom: 25px;
  z-index: 100;
  width: 50px;
  height: 50px;
  background-size: 100% 100%;
  background-image: url('vge.png');
  background-repeat: no-repeat;
}

// dat.gui的样式
.dg.main.a {
  position: absolute !important;
  top: 320px;
  right: 0;
  z-index: 100;
}
</style>

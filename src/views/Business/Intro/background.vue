<!--
 * @Author: xiongxu
 * @Date: 2023-03-08 14:18:56
 * @LastEditors: OBKoro1
 * @LastEditTime: 2023-03-08 22:50:32
 * @FilePath: \geoproject2.0\src\views\Login\background.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div>
    <div id="main_bg">
      <slot></slot>
    </div>
    <div id="border"></div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
#border {
  width: 100%;
  height: 7px;
  border-top: 1px solid #c0e9fb;
  border-bottom: 1px solid #c0e9fb;
  background-color: #81d3f8;
}
</style>

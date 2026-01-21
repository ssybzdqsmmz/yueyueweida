<!--
 * @Date: 2023-03-01 12:57:59
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2024-02-26 16:20:15
 * @FilePath: \Geology-V3\src\views\Home.vue
-->
<template>
  <div id="main">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
//
</script>

<style lang="scss" scoped>
#main {
  position: relative;
  width: 100vw;
  min-width: 1041px; // 用户能够缩放的最小宽度
  height: 100vh;
}
</style>

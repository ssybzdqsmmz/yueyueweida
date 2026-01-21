<!--
 * @Author: xiongxu
 * @Date: 2023-03-03 15:16:17
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-13 09:56:42
 * @FilePath: \geoproject2.0\src\views\Login\intro.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div id="intro_main">
    <div v-if="itemIndex == '0'">
      <over-view />
    </div>
    <div v-if="itemIndex == '1'">
      <resource />
    </div>
  </div>
</template>

<script lang="ts" setup>
import OverView from './overview/overview.vue';
import Resource from './resource/resource.vue';

defineProps({
  itemIndex: {
    type: String,
    default: '0',
  },
});
</script>

<style lang="scss" scoped>
#intro_main {
  width: 1920px;
}
</style>

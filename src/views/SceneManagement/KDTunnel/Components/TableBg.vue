<!--
 * @Author: Lincong-pro
 * @Date: 2023-03-21 15:35:39
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-14 09:58:42
 * @FilePath: \Geology-V3\src\views\SceneManagement\DaduRiver\Components\TableBg.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div class="bg">
    <div class="title-plus">
      <div class="title_head"></div>
      <div class="title_text">{{ props.title }}</div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: '事件（事故）列表',
  },
});
</script>
<style lang="scss" scoped>
.bg {
  display: inline-block;
  width: 525px;
  height: 565px;
  margin-top: 10px;

  .title-plus {
    width: 100%;
    height: 35px;
    line-height: 35px;
    color: #ffffff;
    font-size: 20px;
    text-align: left;

    // background-color: rgba(107, 161, 255, 1);
    // background-image: $my-color;
    background-color: #158479;

    .title_head {
      display: inline-block;
      width: 11px;
      height: 23px;
      margin: 6px;
      border: none;
      border-radius: 5px;
      background-color: rgb(12 226 246);
    }

    .title_text {
      display: inline-block;
      height: 100%;
      font-weight: 700;
      vertical-align: top;
    }
  }

  .content {
    height: 550px;
    background-color: rgb(255 255 255 / 54%);
  }
}
</style>

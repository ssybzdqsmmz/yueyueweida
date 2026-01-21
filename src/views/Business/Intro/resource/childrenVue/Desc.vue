<!--
 * @Author: xiongxu
 * @Date: 2023-03-03 15:16:17
 * @LastEditors: OBKoro1
 * @LastEditTime: 2023-03-09 13:20:27
 * @FilePath: \geoproject2.0\src\views\Login\resource\childrenVue\Desc.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div class="intro">
    <div class="content">
      <p class="p_1">——高精度地理地质信息集成共享子平台资源</p>
      <p class="p_2">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;平台提供<span>专业、培训和支持服务</span>。我们提供多项支撑和服务资源，以优化配置并有效利用系统的内容和功能，支持您的任务
        - 您工作。
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
p {
  font-family: '微软雅黑';
  color: black;
}

.intro {
  height: 600px;
  background-image: url('@/assets/images/首页-资源/u136.png');
  background-repeat: no-repeat;
  background-size: auto 100%;

  .content {
    display: inline-block;
    width: 50%;
    height: 600px;
    margin-left: 50%;
    vertical-align: middle;

    .p_1 {
      position: relative;
      top: 100px;
      font-size: 36px;
      font-weight: 700;
      text-align: center;
    }

    .p_2 {
      position: relative;
      top: 150px;
      left: 130px;
      width: 680px;
      padding: 15px;
      line-height: 50px;
      font-size: 26px;

      span {
        font-size: 30px;
        font-weight: 700;
      }
    }
  }

  .right {
    display: inline-block;
    width: 50%;
    height: 600px;
    vertical-align: middle;

    .img_0 {
      width: 915px;
      height: 500px;
    }

    .img_1 {
      position: relative;
      top: -515px;
      left: 180px;
      width: 480px;
      height: 250px;
      box-sizing: content-box;
      border-top: 8px solid #252525;
      border-right: 10px solid #252525;
      border-bottom: 23px solid #252525;
      border-left: 10px solid #252525;
      border-radius: 5px;
    }

    .img_2 {
      position: relative;
      top: -355px;
      left: -165px;
      width: 395px;
      height: 200px;
      box-sizing: content-box;
    }

    .img_3 {
      position: relative;
      top: -465px;
      left: 84px;
      width: 271px;
      height: 140px;
      box-sizing: content-box;
    }
  }
}
</style>

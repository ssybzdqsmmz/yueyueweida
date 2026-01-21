<!--
 * @Author: xiongxu
 * @Date: 2023-03-03 15:16:17
 * @LastEditors: OBKoro1
 * @LastEditTime: 2023-03-09 11:00:54
 * @FilePath: \geoproject2.0\src\views\Login\overview\childrenVue\desc.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div id="intro_1">
    <div class="left">
      <p class="p_1">——多尺度的高精度地理地质三维立体结构框架</p>
      <p class="p_2">
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;研究</span
        >川藏铁路高精度地理地质数据整合入库、高精度地理地质数据多层级服务集成共享、高精度地理地质场景多样化可视化等关键技术，研制国产自主可控的高精度地理地质信息集成共享子平台。
      </p>
    </div>
    <div class="right">
      <img class="img_0" src="@/assets/images/首页-总览/u6.jpg" alt="" />
      <img class="img_3" src="@/assets/images/首页-总览/u7.jpg" alt="" />
      <img class="img_2" src="@/assets/images/首页-总览/u8.jpg" alt="" />
      <img class="img_1" src="@/assets/images/首页-总览/u10.jpg" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
p {
  font-family: '微软雅黑';
  color: black;
}

#intro_1 {
  height: 600px;

  .left {
    display: inline-block;
    width: 50%;
    height: 600px;
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
      width: 600px;
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

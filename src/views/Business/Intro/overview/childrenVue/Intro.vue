<!--
 * @Author: xiongxu
 * @Date: 2023-03-07 21:39:28
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-13 16:50:12
 * @FilePath: \geoproject2.0\src\views\Login\overview\childrenVue\Intro.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div class="left">
    <div class="intro">
      <p class="p_1">{{ props.title }}</p>
      <p class="p_2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ props.intro }}</p>
    </div>
    <div
      class="btn_div"
      :style="
        props.btn.length > 3
          ? ''
          : {
              gridTemplateRows: 'repeat(3, 1fr)',
              gridTemplateColumns: 'auto',
              gap: '40px 0',
            }
      "
    >
      <div v-for="(item, index) in props.btn" :key="index">
        <input
          class="btn"
          :style="
            props.btn.length > 3
              ? ''
              : {
                  width: '360px',
                }
          "
          :class="activeIndex == index.toString() ? 'active' : ''"
          type="button"
          :value="item"
          @click="changeImage(index.toString(), props.imgDivClass)"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const props = defineProps({
  title: {
    type: String,
    default: 'PC—>DTBuilder',
  },
  intro: {
    type: String,
    default: '提供处理地形数据、城市模型数据、点云数据等多源数据的工具集，可以将多源数据整合到统一的坐标系统和场景中。',
  },
  btn: {
    type: Array,
    default() {
      return ['实例化转换', 'BIM模型转换', '倾斜摄影转换', '地形/影像转换'];
    },
  },
  imgDivClass: {
    type: String,
    default: 'image_div_0',
  },
});

//图片展示逻辑
let activeIndex = ref('0');
function changeImage(index, element) {
  activeIndex.value = index;
  let image = document.getElementsByClassName(element);
  let fontsize = document.documentElement.style.fontSize.match(/(\d+(?:\.\d+)?)/)[0];
  //@ts-ignore
  let rem = ((-636 / fontsize) * parseInt(index)).toString() + 'rem';
  //@ts-ignore
  image[0].style.top = rem;
}
</script>

<style lang="scss" scoped>
p {
  font-family: '微软雅黑';
  color: black;
}

.left {
  display: inline-block;
  width: 38%;
  height: 710px;
  vertical-align: middle;

  .intro {
    position: relative;
    width: 100%;
    height: 355px;

    .p_1 {
      position: relative;
      left: 100px;
      top: 70px;
      font-size: 36px;
      font-weight: 700;
    }

    .p_2 {
      position: relative;
      top: 140px;
      left: 60px;
      width: 670px;
      line-height: 50px;
      font-size: 26px;

      span {
        font-size: 30px;
        font-weight: 700;
      }
    }
  }

  .btn_div {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 55px 0;

    > div {
      display: flex;
    }

    .btn {
      display: inline-block;
      width: 260px;
      height: 80px;
      margin: auto;
      border: none;
      line-height: 80px;
      color: #0cb2e0;
      font-family: '微软雅黑';
      font-size: 25px;
      font-weight: 400;
      text-align: center;
      background-color: rgb(11 47 71 / 86.7%);
      font-style: normal;

      &:hover {
        color: rgb(255 255 255);
        background-color: rgb(21 95 166 / 73.7%);
      }
    }

    .active {
      color: rgb(255 255 255);
      background-color: rgb(21 95 166 / 73.7%);
    }
  }
}

.btn:checked ~ .image_div_0 {
  top: -636px;
}
</style>

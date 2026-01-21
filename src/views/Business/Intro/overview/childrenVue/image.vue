<!--
 * @Author: xiongxu
 * @Date: 2023-03-07 21:39:47
 * @LastEditors: 枫林残忆
 * @LastEditTime: 2024-03-02 10:43:14
 * @FilePath: \Geology-V3\src\views\Business\Login\overview\childrenVue\image.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div class="right">
    <div class="content">
      <div id="image_div" :class="imgDivClass">
        <div
          v-for="(item, index) in props.imgInform"
          :key="index"
          class="image"
          :style="{ backgroundImage: 'url(' + item.imgurl + ') ', backgroundSize: 'cover' }"
        >
          <div class="img_intro">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ item.Intro }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  imgInform: {
    type: Array<{ imgurl: string; Intro: string }>,
    default() {
      return [
        {
          imgurl: 'src/assets/images/首页-总览/u110.png',
          Intro: '实例化转换：支持基础模型批量放样；支持实例化形式构建工程三维场景。',
        },
        {
          imgurl: 'src/assets/images/首页-总览/u114.png',
          Intro: 'BIM模型转换：支持将通用BIM交换标准格式(.IFC)转换为轻量化平台可直接加载的3DTiles数据格式，BIM的语义信息将被写入到瓦片属性信息中。',
        },
        {
          imgurl: 'src/assets/images/首页-总览/u112.png',
          Intro: '倾斜摄影转换：支持Webp纹理压缩、Draco三角网压缩，大大降低处理后数据量，提升数据加载效率。',
        },
      ];
    },
  },
  imgDivClass: {
    type: String,
    default: 'image_div_0',
  },
});
</script>

<style lang="scss" scoped>
p {
  font-family: '微软雅黑';
  color: black;
}

.right {
  display: inline-block;
  width: 62%;
  height: 710px;
  vertical-align: middle;

  .content {
    display: block;
    width: 1166px;
    height: 636px;
    margin-top: calc((710px - 636px) / 2);
    margin-left: calc((100% - 1166px) / 2);
    overflow: hidden;
    background-color: #2b4a5f;

    #image_div {
      position: relative;
      width: 1166px;
      transition: 0.5s;

      > .image {
        width: 1136px;
        height: 596px;
        box-sizing: content-box;
        border-top: 20px solid #2b4a5f;
        border-right: 15px solid #2b4a5f;
        border-bottom: 20px solid #2b4a5f;
        border-left: 15px solid #2b4a5f;
        color: black;
        background-color: white;

        .img_intro {
          position: relative;
          top: 425px;
          left: 200px;
          width: 686px;
          height: 129px;
          box-sizing: border-box;
          padding-top: 35px;
          border-width: 1px;
          border-color: rgb(242 242 242 / 80%);
          border-radius: 0;
          line-height: 28px;
          color: #666;
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
          font-size: 16px;
          font-weight: 700;
          text-align: left;
          background-color: rgb(255 255 255 / 70%);
          box-shadow: none;
          border-style: solid;
          font-style: normal;
        }
      }
    }
  }
}
</style>

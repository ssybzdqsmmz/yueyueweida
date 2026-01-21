<!--
 * @Author: xiongxu
 * @Date: 2023-03-03 15:16:17
 * @LastEditors: OBKoro1
 * @LastEditTime: 2023-03-11 12:51:17
 * @FilePath: \geoproject2.0\src\views\Login\overview\overview.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div id="overview">
    <ul v-infinite-scroll="lazyLoading">
      <li>
        <back-ground>
          <component :is="Desc" />
        </back-ground>
      </li>
      <li>
        <back-ground>
          <component :is="Anchor" @go-anchor="goAnchor" />
        </back-ground>
      </li>
      <li v-if="count > 0">
        <back-ground id="DTBuilder">
          <component :is="Intro" />
          <component :is="Image" />
        </back-ground>
      </li>
      <li v-if="count > 1">
        <back-ground id="DTServer">
          <component :is="Image" :img-inform="inform[0].imgInform" :img-div-class="inform[0].imgDivClass" />
          <component :is="Intro" :title="inform[0].title" :intro="inform[0].intro" :btn="inform[0].btn" :img-div-class="inform[0].imgDivClass"
        /></back-ground>
      </li>
      <li v-if="count > 2">
        <back-ground id="DTGlobe">
          <component :is="Image" :img-inform="inform[1].imgInform" :img-div-class="inform[1].imgDivClass" />
          <component :is="Intro" :title="inform[1].title" :intro="inform[1].intro" :btn="inform[1].btn" :img-div-class="inform[1].imgDivClass" />
        </back-ground>
      </li>
      <li v-if="count > 3">
        <back-ground id="App">
          <component :is="Image" :img-inform="inform[2].imgInform" :img-div-class="inform[2].imgDivClass" />
          <component :is="Intro" :title="inform[2].title" :intro="inform[2].intro" :btn="inform[2].btn" :img-div-class="inform[2].imgDivClass"
        /></back-ground>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import BackGround from '../background.vue';
import Desc from './childrenVue/Desc.vue';
import Anchor from '../Anchor.vue';
import Image from './childrenVue/Image.vue';
import Intro from './childrenVue/Intro.vue';
import { reactive, ref } from 'vue';

const state = reactive({
  footer: [
    '咨询服务：平台网络服务QQ群：123456789 咨询邮箱：123456789@qq.com',
    '技术支持：VGE Group',
    'Copyright © 2023 VGE Group. All rights reserved.',
  ],
});
const inform = [
  {
    title: 'PC—>DTServer',
    intro: '多标准数据服务发布与管理，基于在线平台支持海量多源异质数据/模型/知识的统一接入、一体化管理及服务发布。',
    btn: ['数据/模型/知识入库', '数据/模型/知识管理', '数据分享'],
    imgDivClass: 'Image_div_1',
    imgInform: [
      {
        imgurl: 'src/assets/Images/首页-总览/u95.png',
        Intro: '数据/模型/知识入库：支持多源数据/模型/知识入库，填写对应的元数据信息，点击确认，添加成功。',
      },
      {
        imgurl: 'src/assets/Images/首页-总览/u99.png',
        Intro: '数据/模型/知识分享：点击分享按钮，进行数据链接分享，公开性启用后，分享的链接数据可被浏览；公开性禁用后，分享的链接数据不可被浏览。',
      },
      {
        imgurl: 'src/assets/Images/首页-总览/u97.png',
        Intro: '数据/模型/知识管理：管理员能够删除、修改、检查对应数据/模型/知识信息。普通用户仅浏览权限。',
      },
    ],
  },
  {
    title: 'PC—>DTGlobe',
    intro: '基于多层次用户应用需求，基于在线平台支撑海量地理地质信息服务化，满足多层级多专业用户对地理地质信息不同重量级可视化应用。',
    btn: ['基础地理地质场景展示', '飞行/漫游功能', '地形开挖', '灾害信息可视化'],
    imgDivClass: 'Image_div_2',
    imgInform: [
      {
        imgurl: 'src/assets/Images/首页-总览/u77.png',
        Intro: '基础地理/地质环境可视化：提供地理环境展示功能，对工区周围的重要地理环境（如地形、地貌、土壤、气候、水系等）进行可视化表达。',
      },
      {
        imgurl: 'src/assets/Images/首页-总览/u82.png',
        Intro: '飞行/漫游功能：对设施场景进行全方位漫游展示。同时，用户还可根据需求，定制漫游路线。',
      },
      {
        imgurl: 'src/assets/Images/首页-总览/u79.png',
        Intro: '地形开挖：在地形表面，开挖出一定范围的区域，用于显示地形下的场景，经常用于城市管网、地下沟渠，排污通道等地下设施，或者地下地质体等。',
      },
    ],
  },
  {
    title: 'APP—>xxxxxx',
    intro: '基于该层次用户应用需求，基于在线平台支撑海量地理地质信息服务化，满足多层级多专业用户对地理地质信息不同重量级可视化应用。',
    btn: ['基础地理地质场景展示', '飞行/漫游功能', '灾害信息可视化', '灾害预报推送'],
    imgDivClass: 'Image_div_3',
    imgInform: [
      {
        imgurl: 'src/assets/Images/首页-总览/u101.png',
        Intro: '基础地理第/地质环境可视化：提供地理环境展示功能，对工区周围的重要地理环境（如地形、地貌、水系等）进行可视化表达。',
      },
      {
        imgurl: 'src/assets/Images/首页-总览/u82.png',
        Intro: '飞行/漫游功能：对设施场景进行全方位漫游展示。同时，用户还可根据需求，定制漫游路线。',
      },
      {
        imgurl: 'src/assets/Images/首页-总览/u60.png',
        Intro: '灾害信息可视化：提供地质环境展示功能，对工区周围发生的灾害（如滑坡、泥石流、洪水、地震等）进行可视化表达。',
      },
      {
        imgurl: 'src/assets/Images/首页-总览/u100.png',
        Intro: '基础地理第/地质环境可视化：提供地理环境展示功能，对工区周围的重要地理环境（如地形、地貌、水系等）进行可视化表达。',
      },
    ],
  },
];
//锚点定位
function goAnchor(target) {
  document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
}

const count = ref(0);
const lazyLoading = () => {
  if (count.value < 4) {
    count.value += 1;
  }
};
</script>

<style lang="scss" scoped></style>

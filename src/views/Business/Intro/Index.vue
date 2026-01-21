<!--
 * @Author: xiongxu
 * @Date: 2023-03-03 15:25:18
 * @LastEditors: 枫林残忆
 * @LastEditTime: 2024-03-02 10:51:30
 * @FilePath: \Geology-V3\src\views\Business\Index.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div id="main">
    <el-affix>
      <div id="head">
        <div id="head_navigation">
          <el-menu
            default-active="0"
            class="navigation-menu"
            mode="horizontal"
            background-color="rgb(92, 92, 92)"
            text-color="#fff"
            active-text-color="#fff"
            @select="handleSelect"
          >
            <el-menu-item
              v-for="(item, index) in menuItems.data"
              :key="index"
              class="menu-item"
              :class="activeIndex == index.toString() ? 'active' : ''"
              :index="index.toString()"
              >{{ item }}</el-menu-item
            >
          </el-menu>
        </div>
        <div id="title">
          <span> 高精度地理地质信息集成共享子平台</span>
        </div>
      </div>
    </el-affix>
    <component :is="Intro" :item-index="activeIndex" />
    <div class="footer">
      <ul>
        <li v-for="(item, index) in state.footer" :key="index">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Intro from './intro.vue';
import { useRouter } from 'vue-router';
import { ref, reactive } from 'vue';

const state = reactive({
  footer: [
    '咨询服务：平台网络服务QQ群：123456789 咨询邮箱：123456789@qq.com',
    '技术支持：VGE Group',
    'Copyright © 2023 VGE Group. All rights reserved.',
  ],
});
//head导航栏
const menuItems = reactive({
  data: ['总览', '资源', '登录'],
});

// 当前item样式逻辑
const router = useRouter();
let activeIndex = ref('0');
const handleSelect = (key: string, keyPath: string[]) => {
  activeIndex.value = key;
  if (key == '2') {
    router.push('/login');
  }
};
</script>
<style lang="scss" scoped>
#main {
  width: 1920px;
  height: 1080px;
}

p {
  color: #000;
}

#head {
  height: 63px;
  margin-right: 17px;
  background-color: rgb(92 92 92);
}

#title {
  position: absolute;
  top: 0;
  left: 56px;
  width: 659px;
  height: 63px;
  line-height: 63px;
  font-size: 28px;
  text-align: center;
}

#head_navigation {
  position: absolute;
  left: 1583px;
  width: 310px;
  height: 63px;

  .navigation-menu {
    height: 63px;
    border: none;

    .menu-item {
      width: 82px;
      margin-right: 10px;
      margin-left: 10px;
      color: #f2f2f2;
      font-family: '微软雅黑';
      font-size: 16px;
      font-weight: 400;
      font-style: normal;
    }

    .active {
      border-bottom: 5px solid #49b0f2;
      background-color: #000;
    }
  }
}

.footer {
  position: relative;
  height: 165px;
  width: 1920px;

  ul {
    position: absolute;
    top: 30px;
    left: 1109px;
    list-style: none;
    font-size: 21px;
    color: #f2f2f2;

    li {
      height: 35px;
      line-height: 35px;
      text-align: left;
    }
  }

  &::before {
    display: block;
    width: 100%;
    height: 100%;
    background-color: #5c5c5c;
    content: '';
  }
}
</style>

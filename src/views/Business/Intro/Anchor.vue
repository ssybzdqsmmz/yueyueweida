<!--
 * @Author: xiongxu
 * @Date: 2023-03-04 15:14:47
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-13 16:47:46
 * @FilePath: \geoproject2.0\src\views\Login\Anchor.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->

<template>
  <div id="intro_2">
    <div class="grid">
      <div id="title">
        <span>{{ props.title }}</span>
      </div>
      <div id="left">
        {{ props.btn.left.title }}
        <div class="grid_01">
          <div class="anchor">
            <a @click="setAnchor(props.btn.left.btn[0])">{{ props.btn.left.btn[0] }}</a>
          </div>
          <div class="anchor">
            <a @click="setAnchor(props.btn.left.btn[1])">{{ props.btn.left.btn[1] }}</a>
          </div>
          <div class="anchor">
            <a @click="setAnchor(props.btn.left.btn[2])">{{ props.btn.left.btn[2] }}</a>
          </div>
          <!-- 目标位置用name="" -->
        </div>
      </div>
      <div id="right">
        {{ props.btn.right.title }}
        <div class="anchor">
          <a @click="setAnchor('App')">{{ props.btn.right.btn }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Prop } from 'vue';

const emit = defineEmits(['goAnchor']);

function setAnchor(target) {
  emit('goAnchor', target);
}

// 定义属性接口类型
interface Props {
  title?: string;
  btn: { left: { title: string; btn: Array<string> }; right: { title: string; btn: string } };
}

const props = withDefaults(defineProps<Props>(), {
  title: '高精度地理地质信息集成共享子平台体系',
  btn: () => {
    return {
      left: {
        title: 'PC端平台三大系统',
        btn: ['DTBuilder', 'DTServer', 'DTGlobe'],
      },
      right: {
        title: '手机端系统',
        btn: 'xxxxx',
      },
    };
  },
});
</script>

<style lang="scss" scoped>
#intro_2 {
  display: flex;
  height: 360px;
}

.grid {
  display: grid;
  align-self: center;
  width: 1430px;
  height: 270px;
  margin-left: calc((100% - 1430px) / 2);
  grid-template: 2.9fr 1fr /2.5fr 1fr;
  grid-template-areas: 'title title' 'left right';
  gap: 12px;

  > div {
    text-align: center;
  }
}

#title {
  display: flex;
  color: #fff;
  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 1.5px;
  background-color: #98abb7;
  grid-area: title;
  font-style: normal;

  span {
    align-self: center;
    width: 100%;
  }
}

#left {
  line-height: 85px;
  color: #333;
  font-family: '微软雅黑';
  font-size: 28px;
  font-weight: 400;
  text-align: center;
  background-color: #f7f7f7;
  grid-area: left;
  font-style: normal;
}

.anchor {
  height: 75px;
  margin-bottom: 20px;
  background-color: rgb(255 255 255 / 100%);

  a {
    display: inline-block;
    position: relative;
    top: -11px;
    width: 170px;
    line-height: 75px;
    color: #666;
    text-decoration: none;
  }

  &::after {
    display: inline-block;
    position: relative;
    top: -83px;
    left: -86px;
    width: 57px;
    height: 49px;
    background-size: 100% 100%;
    background-image: url('@/assets/images/首页-总览/u23.png');
    content: '';
  }

  &::before {
    display: inline-block;
    position: relative;
    top: calc((100% - 59px) / 2);
    width: 67px;
    height: 59px;
    background-size: 100% 100%;
    background-image: url('@/assets/images/首页-总览/u22.svg');
    content: '';
  }
}

#right {
  line-height: 85px;
  color: #333;
  font-family: '微软雅黑';
  font-size: 28px;
  font-weight: 400;
  text-align: center;
  background-color: #f7f7f7;
  grid-area: right;
  font-style: normal;

  .anchor {
    width: 268px;
    margin-left: calc((100% - 268px) / 2);
  }
}

.grid_01 {
  display: grid;
  width: 900px;
  height: 75px;
  margin-left: calc((100% - 900px) / 2);
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
}
</style>

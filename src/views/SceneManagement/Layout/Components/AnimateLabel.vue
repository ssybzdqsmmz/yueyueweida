<!--
 * @Date: 2024-03-19 15:43:38
 * @LastEditors: xingxu-webgis 1833104160@qq.com
 * @LastEditTime: 2024-03-19 15:53:42
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Components\AnimateLabel.vue
 * @Author: xingxu-webgis 1833104160@qq.com
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<!--
 * @Author: Lincong-pro
 * @Date: 2024-01-08 17:06:51
 * @LastEditors: xingxu-webgis 1833104160@qq.com
 * @LastEditTime: 2024-03-15 10:46:51
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Components\AnimateLabel.vue
 * @Description: 用于动画制作的UI
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<script lang="ts" setup>
import WEventBus from '../Tools/WEventBus';
import { globeWidgetEvents } from './events';
import { ref } from 'vue';

let eventBus = new WEventBus();
interface IAnimationLabel {
  status: boolean;
  text: string;
}
const text = ref('');

eventBus.on(globeWidgetEvents.animateLabel, (data: IAnimationLabel) => {
  let domNode = document.getElementsByClassName('aniamte-label')[0];
  text.value = data.text;
  if (data.status) {
    domNode.classList.add('aniamte-label-hidden');
  } else {
    domNode.classList.remove('aniamte-label-hidden');
  }
});
</script>

<template>
  <div class="aniamte-label">{{ text }}</div>
</template>

<style type="scss" scoped>
.aniamte-label {
  --board-height: 60px;

  position: absolute;
  top: 100px;
  right: -400px;
  z-index: 1;
  width: 400px;
  height: var(--board-height);
  border-radius: 15px;
  line-height: var(--board-height);
  font-size: 30px;
  text-align: center;
  text-shadow: 0 0 1px #fff, 0 0 30px #228dff, 0 0 50px #228dff;
  background: linear-gradient(90deg, #235175, #0000);
  transition: all 1s ease-in-out;
}

.aniamte-label-hidden {
  transform: translateX(-400px);
}
</style>

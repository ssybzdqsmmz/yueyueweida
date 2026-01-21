<!--
 * @Author: h2qisme 12671442+h2qisme@user.noreply.gitee.com
 * @Date: 2024-07-11 11:12:47
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-07-16 17:11:17
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Components\Application.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="bigbox">
    <button @click="navigateTo('tbm')">TBM 平台</button>
    <button @click="navigateTo('geothermal')">高地温平台</button>
    <button @click="navigateTo('sensorMonitoring')">传感器监测</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);

function navigateTo(platform) {
  let url = '';
  if (platform === 'tbm') {
    url = 'http://192.168.1.242:9990';
  } else if (platform === 'geothermal') {
    url = 'http://192.168.1.242:10062';
  } else if (platform === 'sensorMonitoring') {
    url = 'http://mon2.guyuanct.com/#/Main';
  }
  window.open(url, '_blank');
  showModal.value = false;
}
</script>

<style scoped lang="scss">
.bigbox {
  display: flex; /* 使用 flexbox 布局 */
  position: absolute;
  top: 60px;
  right: 470px;
  z-index: 1;
  width: 140px;
  height: auto; /* 高度根据内容自动调整 */
  flex-direction: column; /* 竖直排列 */
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
  font-size: 16px;
  radius: 2px;
  text-align: center;
  background-color: rgb(254 255 255 / 50%);
}

button {
  width: 120px;
  margin: 10px 0; /* 上下外边距 */
  padding: 10px 20px;
  border: 1px solid rgb(22 225 212);
  border-radius: 5px;
  color: white;
  background-color: #1f7c74;
  cursor: pointer;
}

button:hover {
  background-color: #0b4944;
}
</style>

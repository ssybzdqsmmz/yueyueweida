<!--
 * @Author: fuweiaa 2567873016@qq.com
 * @Date: 2024-04-23 10:06:19
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-06-20 14:39:15
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnel\Components\SensorData.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="sensor-data-container" id="iframe-p">
    <iframe id="sensor-web" :src="weburl" @load="onIframeLoad"></iframe>
  </div>
</template>

<script lang="ts" setup>
import { sensor } from '../Config/url';
import { ref, onBeforeUnmount, onMounted } from 'vue';
import axios from 'axios';

let weburl = ref(sensor);

const onIframeLoad = () => {
  console.log('iframe 加载完成');
  attemptLogin();
};

const attemptLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/login', {
      username: '17862612397', // 替换为实际的用户名
      password: '15177336768', // 替换为实际的密码
    });

    const sessionInfo = response.data.sessionInfo;
    console.log('登录成功，会话信息：', sessionInfo);
  } catch (error) {
    console.error('登录失败：', error);
  }
};

onMounted(() => {
  const iframe = document.getElementById('sensor-web') as HTMLIFrameElement;
  iframe.src = weburl.value;
});

onBeforeUnmount(() => {
  let iframe = document.getElementById('sensor-web');
  let parent = document.getElementById('iframe-p');
  if (iframe && parent) {
    parent.removeChild(iframe);
  }
});
</script>

<style scoped lang="scss">
.sensor-data-container {
  position: absolute;
  top: 53vh;
  left: 56vw;
  z-index: 10;
  width: 88vw;
  height: 93vh;
  background-color: rgb(255 255 255 / 50%);
  transform: translate(-50%, -50%);

  #sensor-web {
    width: 100%;
    height: 100%;
  }
}
</style>

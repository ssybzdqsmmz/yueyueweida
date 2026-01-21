<!--
 * @Author: anganao
 * @Date: 2023-09-14 15:00:11
 * @LastEditors: 枫林残忆
 * @LastEditTime: 2024-03-02 12:44:08
 * @FilePath: \Geology-V3\src\views\Business\entry\Entry.vue
 * @Description:
 * Copyright (c) 2023 by VGE, All Rights Reserved.
-->
<template>
  <div class="home">
    <!-- header导航栏 -->
    <div class="navbar">
      <!-- 导航栏容器 -->
      <div class="navbar-container">
        <!-- 左侧 -->
        <div class="navbar-container-left">
          <!-- 左侧导航栏 -->
          <ul class="left-ul">
            <li title=""><router-link active-class="active" to="/intro"> 总览 </router-link></li>
            <li title=""><a target="_blank" active-class="active" href="DTBuilder://startSession"> DTRail-Builder </a></li>
            <li title=""><a target="_blank" active-class="active" :href="appConfig.serverPage"> DTRail-Server </a></li>
            <li title=""><router-link active-class="active" to="/home/3DScene"> DTRail-Globe </router-link></li>
          </ul>
        </div>
        <!-- 右侧导航栏 -->
        <div class="navbar-container-right">
          <div class="navbar-login">
            <!-- <a href="">登录</a> -->
            <router-link active-class="active" to="/login"> 登录 </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="container">
      <div class="text">
        <div class="first">高精度地理地质信息集成共享子平台</div>
        <div class="second">DTRail</div>
        <div class="third">提供全域统一的高精度地理地质信息服务，支撑全线级-区域级-工程级-施工面级地理地质多样化分析应用场景</div>
        <router-link to="/login" class="button">登录</router-link>
      </div>
    </div>
    <div class="footer">
      <p><a href="">隐私策略</a>|<a href="">信任中心</a>|<a href="">法律声明</a>|<a href="">联系VGE</a></p>
    </div>
  </div>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import AppConfig from '@/config/AppConfig';
let appConfig = new AppConfig().appConfig;
</script>

<style scoped>
.home {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: hidden;

  /* overflow-y: scroll; */
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  width: 100%;
  color: #222226;
  font-size: 14px;

  /* 字体粗细，400相当于normal */
  font-weight: 400;
  background-color: #fff;

  /* 阴影  水平阴影距离，垂直阴影距离， 模糊尺寸， 阴影尺寸 颜色 */
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 5%);
}

.navbar-container {
  display: flex;
  width: 100%;

  /* 最小宽度，窗口缩小之后到1280px不会再缩小 */
  min-width: 1280px;
  height: 52px;
  box-sizing: border-box;
  margin-left: 30px;
  padding: 0;
  justify-content: space-between;
  line-height: 52px;
  -webkit-box-pack: justify;
}

.left-ul {
  float: left;
  width: auto;
  height: 100%;

  /* 去除li中的间隙，在li中设置font-size,否则没有内容 */
  font-size: 0;
}

.left-ul li {
  display: inline-block;
  position: relative;
  height: 100%;
  line-height: 48px;
  font-size: 16px;
}

a {
  padding: 0 10px;
  color: #000;

  /* 删除a标签的下划线 */
  text-decoration: none;
}

/* 鼠标停留时的样式 */
.left-ul li:hover {
  background-color: #eee;
}

.navbar-login {
  margin-right: 60px;
}

.container {
  width: 100%;
  height: 90%;
  margin-top: 52px;
  background-position: center center;
  background-size: cover;
  background-image: url('./Assets/earth.jpg');
  background-repeat: no-repeat;
}

.container .text {
  position: relative;
  top: 100px;
  left: 100px;
  width: 500px;
  height: 500px;
  color: #ffffff;
  text-align: center;
}

.container .text .first {
  display: inline-block;
  margin: 10px 0;
  font-size: 25px;
}

.container .text .second {
  display: inline-block;
  margin: 10px 0;
  font-size: 50px;
}

.container .text .third {
  display: inline-block;
  font-size: 15px;
}

.container .text .button {
  display: inline-block;
  position: relative;
  margin-top: 20px;
  padding: 15px 50px;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 18px;
  background-color: #3e43ac;
  cursor: pointer;
}

.footer {
  z-index: 200;
  height: 40px;
  padding: 10px;
  color: #000000;
  background-color: #fdfdfd;
}

.footer p {
  margin: 0;
  font-size: 16px;
  text-align: center;
}
</style>

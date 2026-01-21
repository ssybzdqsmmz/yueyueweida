<!--
 * @Date: 2024-07-10 15:57:59
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-17 18:58:47
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Components\Legend.vue
-->
<template>
  <div id="legendWrapper" v-if="isLegendVisible" :class="{ collapsed: isCollapsed }">
    <!-- 条形按钮，用于控制图例的显示和隐藏 -->
    <div class="toggleButton" @click="toggleLegend">
      <span v-if="isCollapsed">展开图例</span>
      <span v-else>收起</span>
    </div>
    <div id="legendBox">
      <div class="tuli">图例</div>
      <div class="legendColumns">
        <div class="legendContent">
          <div class="legendItem">
            <img src="../Assets/img/三角形.png" alt="Tunnel Icon" />
            <span class="legendText">隧道</span>
          </div>
          <div class="legendItem">
            <img src="../Assets/img/点.png" alt="Bridge Icon" />
            <span class="legendText">桥梁</span>
          </div>
          <div class="legendItem">
            <img src="../Assets/img/地区1.png" alt="Diqu Icon" />
            <span class="legendText">地区</span>
          </div>
          <div class="legendItem">
            <img src="../Assets/img/火车站.png" alt="Station Icon" />
            <span class="legendText">车站</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
// 控制图例整体显示/隐藏
const isLegendVisible = ref(false);
const defaultRoute = '/home/3DScene'; // 默认路由
// 控制图例展开/收起
const isCollapsed = ref(true);

// 控制图例的显示与隐藏
const toggleLegend = () => {
  isCollapsed.value = !isCollapsed.value;
};

const updateLegendVisibility = (toPath) => {
  isLegendVisible.value = toPath === defaultRoute;
};

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    updateLegendVisibility(newPath);
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
#legendWrapper {
  display: flex;
  position: fixed;
  right: 10px; /* 初始放置在右侧 */
  bottom: 100px;
  align-items: center;
  transition: transform 0.3s ease-in-out; /* 添加平滑过渡效果 */
}

#legendBox {
  right: 10px;
  bottom: 100px;
  width: 500px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgb(208 208 208 / 80%);
}

.tuli {
  margin-bottom: 3px;
  color: #f6e60d;
  font-family: Arial, sans-serif;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  text-shadow: -1px 0 0 #000, 0 1px 0 #000, 1px 0 0 #000, 0 -1px 0 #000; /* 添加四个方向的阴影来模拟轮廓线 */
}

.legendColumns {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-between; /* 在两列之间留出空间 */
  gap: 20px;
}

.legendItem {
  display: flex;
  margin-bottom: 5px;
  align-items: center;
}

.legendItem img {
  width: 30px;
  height: 30px;
  margin-right: 5px;
  margin-right: 12px;
}

.legendText {
  color: #000;
  font-size: 21px;
  font-weight: bold;
}

.colorBox {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.toggleButton {
  display: flex;
  width: 30px;
  height: 100px;
  margin-right: 5px;
  padding: 10px;
  border-radius: 5px 0 0 5px;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  text-align: center;
  letter-spacing: 2px; /* 调整字母间距 */
  background-color: #056965;
  cursor: pointer;
  transition: background-color 0.3s;
  writing-mode: vertical-rl;
}

.toggleButton:hover {
  background-color: #408588;
}

/* 当图例隐藏时，将整个 legendWrapper 平移到右侧屏幕外 */
.collapsed {
  transform: translateX(510px); /* 控制平移距离，这个值根据图例宽度调整 */
}
</style>

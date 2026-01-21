<template>
  <div class="geo-info" :class="{ collapsed: isTableCollapsed }" :style="geoStyle" ref="panelRef">
    <div class="panel-header" @mousedown="onDragMouseDown">区域地质详细信息</div>
    <div class="geoInfoTable">
      <el-table :data="geoData" style="width: 100%" height="250px">
        <el-table-column prop="attribute" label="属性" width="130" align="center" />
        <el-table-column prop="information" label="信息" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue';

const leftValue = ref('275px');
const topValue = ref('400px'); // 初始位置
const geoData = ref([]);
const geoStyle = computed(() => ({
  left: leftValue.value,
  top: topValue.value,
}));
const isTableCollapsed = ref(false);
const panelRef = ref<HTMLElement | null>(null);

const cxt = getCurrentInstance();
const bus = cxt.appContext.config.globalProperties.$bus;

onMounted(() => {
  bus.on('expressGeoInfo', (message) => {
    let geoInfo = message.geoValues;
    let position = message.position;
    leftValue.value = position.x + 'px';
    topValue.value = position.y + 'px';
    geoData.value = [
      { attribute: '地质体名称', information: geoInfo.fileName_ch },
      { attribute: '中心经度', information: geoInfo.x || '/' },
      { attribute: '中心纬度', information: geoInfo.y || '/' },
      { attribute: '中心高程', information: geoInfo.z || '/' },
      { attribute: '半径', information: geoInfo.r || '/' },
      { attribute: '高度', information: geoInfo.h || '/' },
    ];
  });
});
onBeforeUnmount(() => {
  bus.off('expressGeoInfo');
});

// 拖动功能
let dragOffsetX = 0;
let dragOffsetY = 0;
let dragging = false;

function onDragMouseDown(e: MouseEvent) {
  dragging = true;
  const panel = panelRef.value;
  if (!panel) {
    return;
  }
  const rect = panel.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
  document.addEventListener('mousemove', onDragMouseMove);
  document.addEventListener('mouseup', onDragMouseUp);
}

function onDragMouseMove(e: MouseEvent) {
  if (!dragging) {
    return;
  }
  leftValue.value = `${e.clientX - dragOffsetX}px`;
  topValue.value = `${e.clientY - dragOffsetY}px`;
}

function onDragMouseUp() {
  dragging = false;
  document.removeEventListener('mousemove', onDragMouseMove);
  document.removeEventListener('mouseup', onDragMouseUp);
}
</script>

<style lang="scss" scoped>
.geo-info {
  position: absolute;
  top: 80px;
  right: 400px;
  width: 320px;
  height: 350px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, rgb(3 29 48 / 95%), rgb(10 35 50 / 90%));
  box-shadow: 0 0 20px rgb(0 255 255 / 15%), inset 0 0 3px rgb(255 255 255 / 6%);
  transition: transform 0.8s ease-in-out;
  backdrop-filter: blur(6px);
  transform: translateX(0);
  user-select: none;

  &.collapsed {
    transform: translateX(800px);
  }

  .panel-header {
    height: 40px;
    padding: 12px 20px;
    border-bottom: 1px solid rgb(0 255 255 / 10%);
    color: #ffffff;
    font-family: 'HarmonyOS Sans', 'Segoe UI', sans-serif;
    font-size: 16px;
    font-weight: 600;
    background: rgb(8 74 89) !important;
    cursor: move;
    user-select: none;
  }

  .geoInfoTable {
    padding: 0;
  }
}

:deep(.el-table),
:deep(.el-table__body),
:deep(.el-table__header),
:deep(.el-table__inner-wrapper),
:deep(.el-scrollbar__view),
:deep(.el-scrollbar__wrap),
:deep(.el-table__body-wrapper),
:deep(.el-table__header-wrapper),
:deep(.el-table__empty-block),
:deep(.el-table__cell),
:deep(.el-table__row) {
  background-color: transparent !important;
}

:deep(.el-table__empty-block) {
  background-color: transparent !important;
}

:deep(.el-table thead th) {
  border-bottom: none !important;
  color: white !important;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  background: rgb(8 74 89) !important;
  opacity: 1 !important;
  box-shadow: none !important;
}

:deep(.el-table .cell) {
  line-height: 22px;
  font-size: 14px;
  color: white;
  font-weight: 500;
  font-family: 'Microsoft Yahei', sans-serif;
  text-align: center;
}

:deep(.el-table td.el-table__cell) {
  border-bottom: none !important;
  text-align: center;
  background-color: transparent !important;
}

:deep(.el-table__body tr) {
  border-bottom: 1px solid rgb(0 255 255 / 8%) !important;
}

:deep(.el-table__header-wrapper) {
  height: 40px;
}
</style>

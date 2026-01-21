<!--
 * @Author: Guo yongxin
 * @Date: 2022-08-02 22:06:26
 * @LastEditTime: 2024-04-09 12:58:45
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @Description: Initialize DTScope CesiumJS Engine Viewer.
 * @FilePath: \Geology-V3\src\components\DTGlobe\DTGlobe.vue
 * @FilePath: \Geology-V3\src\components\DTGlobe\DTGlobe.vue
-->

<template>
  <div class="cesiumdiv">
    <div id="cesiumContainer" :class="cursorTypeStyle" />
    <div v-show="isCustom" class="customCursor" :class="cursorTypeStyle" />
    <div class="position-container">
      鼠标位置
      <span>Lon：{{ lonlat.lon }} °</span>
      <span>Lat：{{ lonlat.lat }} °</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { ref, reactive, getCurrentInstance, onBeforeMount, onBeforeUnmount } from 'vue';
import { nextTick } from 'process';
import Cesium, { ScreenSpaceEventHandler, ScreenSpaceEventType, defined, Cartographic, Cartesian3 } from 'Cesium';
import { throttle, debounce } from '@/utils/Performance';

const ctx = getCurrentInstance();
const _this = ctx.appContext.config.globalProperties;

const cursorTypeStyle = ref('');
const isCustom = ref(false);
const lonlat = reactive({
  lon: '0.00',
  lat: '0.00',
});

onBeforeUnmount(() => {
  DTScopeEngine.destroy();
});

onBeforeMount(() => {
  nextTick(() => {
    DTScopeEngine.getInstance(_this);
    let viewer = DTScopeEngine.viewer;

    let handler = new ScreenSpaceEventHandler(viewer.canvas);

    // 左键拖动样式
    handler.setInputAction((movement) => {
      cursorTypeStyle.value = 'panStyle';
    }, ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction((movement) => {
      cursorTypeStyle.value = '';
    }, ScreenSpaceEventType.LEFT_UP);

    // 只在最后用户停止缩放的时候执行
    const wheelDebounce = debounce(() => {
      cursorTypeStyle.value = ''; // 恢复正常
    }, 500);

    // 更新界面的标签
    const positionThrottle = throttle((movement) => {
      const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
      if (defined(cartesian)) {
        const cartographic = Cartographic.fromCartesian(cartesian);
        const longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
        const latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
        lonlat.lat = latitudeString;
        lonlat.lon = longitudeString;
      }
    }, 200);

    handler.setInputAction((movement) => {
      cursorTypeStyle.value = 'zoomStyle';
      wheelDebounce();
    }, ScreenSpaceEventType.WHEEL);

    // 右键缩放样式
    handler.setInputAction((movement) => {
      let fixedPosition = movement.position;
      cursorTypeStyle.value = 'hiddenStyle';
      isCustom.value = true;

      let zoomCustomContainer = document.getElementsByClassName('customCursor')[0] as HTMLElement;

      zoomCustomContainer.style.left = fixedPosition.x + 'px';
      zoomCustomContainer.style.top = fixedPosition.y + 'px';
    }, ScreenSpaceEventType.RIGHT_DOWN);

    // 右键抬起恢复样式
    handler.setInputAction((movement) => {
      cursorTypeStyle.value = '';
      isCustom.value = false;
    }, ScreenSpaceEventType.RIGHT_UP);

    // 更新 DTGlobe下侧的鼠标位置信息
    handler.setInputAction((movement) => {
      positionThrottle(movement);
    }, ScreenSpaceEventType.MOUSE_MOVE);
  });
});
</script>

<style>
#cesiumContainer {
  height: 100%;
}

.cesiumdiv {
  /* margin-top: -5px; */
  width: 100%;
  height: 100%;
}

.cesium-widget-credits {
  display: none !important;
}

.center-viewer-bottom {
  display: none !important;
}

.cesium-widget canvas {
  height: 100% !important;
}

.hiddenStyle {
  cursor: none;
}

.panStyle {
  cursor: url('@/assets/images/cursor/pan.png') 8 8, auto;
}

.zoomStyle {
  cursor: url('@/assets/images/cursor/zoom.png') 24 24, auto;
}

.customCursor {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  width: 48px;
  height: 48px;
  background: url('@/assets/images/cursor/zoom.png') no-repeat;
  background-size: 100% 100%;
}

.position-container {
  display: flex;
  position: absolute;
  right: 400px;
  bottom: 5px;
  height: 30px;
  padding-left: 5px;
  align-items: center;
  background-color: rgb(0 0 0 / 60%);

  span {
    flex: 1;
    width: 100px;
    padding-left: 10px;
  }
}
</style>

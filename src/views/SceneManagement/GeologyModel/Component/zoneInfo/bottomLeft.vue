<template>
  <Right v-if="infoShow && infoType === 'fault'" />
  <GeoInfo v-if="infoShow && infoType === 'geo'" />
</template>

<script setup>
import Right from './right.vue';
import GeoInfo from './GeoInfo.vue';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { onMounted, reactive, ref, getCurrentInstance } from 'vue';

// 断裂模型数据
import FaultInfo_1 from './faultInfo.json';
import FaultInfo_2 from './faultInfo_xz.json';

// 区域地质模型数据
import Geo_KD from './康定区域地质模型.json';
import Geo_TQ from './天全地质模型.json';
import Geo_XZ from './西藏区域地质模型.json';
import Geo_YA from './雅安区域地质模型.json';
import Geo_ZH from './孜河区域地质模型.json';

const infoShow = ref(false);
const infoType = ref('fault');
const position = ref({ x: 0, y: 0 });

const geoInfoAll = [...Geo_KD, ...Geo_TQ, ...Geo_XZ, ...Geo_YA, ...Geo_ZH];
const faultInfoAll = [...FaultInfo_1, ...FaultInfo_2];

const cxt = getCurrentInstance();
const bus = cxt.appContext.config.globalProperties.$bus;
let scene = reactive([{ name: '场景监控#01', src: '', show: true }]);
let isActive = ref('场景监控#01');

function isChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str);
}

function handleGeoFeature(propertyValues, movement) {
  infoType.value = 'geo';
  infoShow.value = true;
  // 用 fileName 查找地质体
  const geoEntry = geoInfoAll.find((item) => item.fileName === propertyValues.fileName);
  let geoValues;
  if (geoEntry) {
    geoValues = geoEntry;
  } else {
    geoValues = {
      fileName_ch: '/',
      x: '/',
      y: '/',
      z: '/',
      r: '/',
      h: propertyValues.h || '/',
    };
  }
  position.value.x = movement.position.x;
  position.value.y = movement.position.y;
  bus.emit('expressGeoInfo', { geoValues, position });
}

function handleFaultFeature(propertyValues, movement) {
  infoType.value = 'fault';
  infoShow.value = true;
  const infoEntry = faultInfoAll.find((item) => item.fault_name === propertyValues.fileName || item.fault_ch === propertyValues.fileName);
  let faultValues;
  if (infoEntry) {
    faultValues = {
      fault_ch:
        infoEntry.fault_ch && isChinese(infoEntry.fault_ch)
          ? infoEntry.fault_ch
          : infoEntry.fault_ch || infoEntry.fault_name || propertyValues.fileName || '/',
      fault_wide: infoEntry.fault_wide || '/',
      faultplanedip: infoEntry.faultplanedip || '/',
      faultlineorientation: infoEntry.faultlineorientation || '/',
      natureoffracture: infoEntry.natureoffracture || '/',
    };
  } else {
    faultValues = {
      fault_ch: propertyValues.fileName || '/',
      fault_wide: '/',
      faultplanedip: '/',
      faultlineorientation: '/',
      natureoffracture: '/',
    };
  }
  position.value.x = movement.position.x;
  position.value.y = movement.position.y;
  bus.emit('expressBIMInfo', { faultValues, position });
}

onMounted(() => {
  DTScopeEngine.getViewer(() => {
    let viewer = DTScopeEngine.viewer;
    let canvas = viewer.canvas;
    let handler = new Cesium.ScreenSpaceEventHandler(canvas);

    let highlightedFeature = null;

    handler.setInputAction(async (movement) => {
      let pickedFeature = viewer.scene.pick(movement.position);

      if (highlightedFeature) {
        infoShow.value = false;
        highlightedFeature.color = Cesium.Color.WHITE;
        highlightedFeature = null;
      }

      if (Cesium.defined(pickedFeature) && pickedFeature instanceof Cesium.Cesium3DTileFeature) {
        let properties = pickedFeature.getPropertyNames();
        let propertyValues = {};
        properties.forEach(function (name) {
          propertyValues[name] = pickedFeature.getProperty(name);
        });
        pickedFeature.color = new Cesium.Color(255.0, 0.0, 0.0, 0.5);
        highlightedFeature = pickedFeature;

        // 判断是否为地质模型
        const isGeoModel = propertyValues.fileName && geoInfoAll.some((item) => item.fileName === propertyValues.fileName);
        // 判断是否为昌都至林芝部分的地质模型
        const isGeoModelFile = propertyValues.fileName && propertyValues.fileName.includes('geoModel_');

        if (isGeoModel) {
          handleGeoFeature(propertyValues, movement);
          // 如果是昌都至林芝地质模型则不显示断裂面板
          // } else if (propertyValues.fileName) {
        } else if (propertyValues.fileName && !isGeoModelFile) {
          handleFaultFeature(propertyValues, movement);
        } else {
          infoShow.value = false;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  });
});
</script>

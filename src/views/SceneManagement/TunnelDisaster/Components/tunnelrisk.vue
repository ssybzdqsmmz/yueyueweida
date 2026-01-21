<!--
 * @Author: h2qisme 874175299@qq.com
 * @Date: 2024-04-13 14:38:28
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-12 16:49:12
 * @FilePath: \Geology-v3\src\views\SceneManagement\TunnelDisaster\Components\tunnelrisk.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="right">
    <span>风险选择</span>
    <div class="custom-select">
      <select v-model="selectedRisk" @change="onRiskChange">
        <option value="全部">全部</option>
        <option value="岩爆">岩爆</option>
        <option value="塌方">塌方</option>
        <option value="掉块">掉块</option>
        <option value="大变形">大变形</option>
        <option value="涌水">涌水</option>
        <option value="破碎带">破碎带</option>
      </select>
      <span class="select-arrow"></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as Cesium from 'Cesium';
import { Viewer, Entity, Cartesian3, PolylineGraphics, LabelStyle } from 'Cesium';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import mergedData from '../config/merged.json';

// 风险类型映射
let riskTypeMapping = {
  岩爆: 'yanbao',
  塌方: 'tafang',
  掉块: 'diaokuai',
  大变形: 'dabianxing',
  涌水: 'yongshui',
  破碎带: 'posuidai',
  全部: 'riskTotal',
};

let selectedRisk = ref('全部');
let viewer: Viewer | null = null;
let tunnelEntities: Entity[] = [];

// 监听风险选择变化
let onRiskChange = () => {
  // 先删除所有已加载的实体
  clearEntities();
  // 重新加载选中的风险类型
  loadCoordinatesAndDrawLines();
};

// 清除所有实体
let clearEntities = () => {
  if (viewer) {
    tunnelEntities.forEach((entity) => {
      viewer?.entities.remove(entity);
    });
    tunnelEntities = [];
  }
};

// 加载坐标并绘制柱状图
let loadCoordinatesAndDrawLines = () => {
  try {
    if (!viewer) {
      return;
    }

    let coordinates = mergedData.points; // 访问 merged.json 数据
    let riskField = riskTypeMapping[selectedRisk.value]; // 获取对应的风险字段名

    coordinates.forEach((coord) => {
      // 获取选中风险类型的值
      let riskValue = coord[riskField];

      // 如果该隧道没有选中类型的风险，则不显示
      if (riskValue <= 0) {
        return;
      }

      // 根据选中的风险类型计算柱状图的高度
      // 全部风险使用原始lineHeight，其他风险类型根据其值计算合适的高度
      let displayHeight = selectedRisk.value === '全部' ? Number(coord.lineHeight) : Number(riskValue) * 50; // 根据具体风险值计算高度，乘以系数使其可见

      let startPoint = Cartesian3.fromDegrees(Number(coord.longitude), Number(coord.latitude), 0);
      let endPoint = Cartesian3.fromDegrees(Number(coord.longitude), Number(coord.latitude), displayHeight * 8);
      let lineColor;

      // 根据风险值确定颜色
      if (displayHeight > 30000) {
        lineColor = Cesium.Color.fromCssColorString('#bf1932'); // 严重
      } else if (displayHeight > 20000) {
        lineColor = Cesium.Color.fromCssColorString('#e2583e'); // 高风险
      } else if (displayHeight > 10000) {
        lineColor = Cesium.Color.fromCssColorString('#f0c05a'); // 中等风险
      } else if (displayHeight > 5000) {
        lineColor = Cesium.Color.fromCssColorString('#45b5aa'); // 低风险
      } else {
        lineColor = Cesium.Color.fromCssColorString('#3191d6'); // 很低风险
      }

      let polyline = new PolylineGraphics({
        positions: [startPoint, endPoint],
        width: 7,
        material: lineColor,
      });

      // 构建标签文本，包含风险值
      let labelText = `${coord.tunnelName}\n${selectedRisk.value}: ${riskValue}`;

      let lineEntity = new Entity({
        polyline: polyline,
        // @ts-ignore
        label: {
          text: new Cesium.ConstantProperty(labelText),
          font: '11px sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          eyeOffset: new Cesium.Cartesian3(0, 0, 100),
          style: new Cesium.ConstantProperty(LabelStyle.FILL_AND_OUTLINE),
          verticalOrigin: new Cesium.ConstantProperty(Cesium.VerticalOrigin.TOP),
          pixelOffset: new Cesium.ConstantProperty(new Cesium.Cartesian2(0, 5)),
          horizontalOrigin: new Cesium.ConstantProperty(Cesium.HorizontalOrigin.CENTER),
          backgroundColor: new Cesium.ConstantProperty(Cesium.Color.TRANSPARENT),
          showBackground: new Cesium.ConstantProperty(false),
          scale: new Cesium.ConstantProperty(1.0),
          distanceDisplayCondition: undefined,
          definitionChanged: undefined,
          show: undefined,
          translucencyByDistance: undefined,
          pixelOffsetScaleByDistance: undefined,
          // clone: function (result?: Cesium.LabelGraphics): Cesium.LabelGraphics {
          // 	throw new Error('Function not implemented.');
          // },
          // merge: function (source: Cesium.LabelGraphics): Cesium.LabelGraphics {
          // 	throw new Error('Function not implemented.');
          // },
        },
        position: endPoint,
        // 添加自定义属性用于点击展示详情
        properties: {
          // @ts-ignore
          tunnelName: coord.tunnelName,
          riskTotal: coord.riskTotal,
          segmentedMileage: coord.segmentedMileage,
          riskType: selectedRisk.value,
          riskValue: riskValue,
          yanbao: coord.yanbao,
          tafang: coord.tafang,
          diaokuai: coord.diaokuai,
          dabianxing: coord.dabianxing,
          yongshui: coord.yongshui,
          posuidai: coord.posuidai,
        },
      });

      let entityAdded = viewer?.entities.add(lineEntity);
      if (entityAdded) {
        tunnelEntities.push(entityAdded);
      }
    });
  } catch (error) {
    console.error('加载坐标数据失败:', error);
  }
};

// 点击事件处理函数
// @ts-ignore

let handleClick = (movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
  if (!viewer) {
    return;
  }

  let pickedObject = viewer.scene.pick(movement.position);
  if (Cesium.defined(pickedObject) && pickedObject.id instanceof Entity && pickedObject.id.polyline) {
    let entity = pickedObject.id;
    let properties = entity.properties;
    if (properties) {
      let tunnelName = properties.tunnelName?.getValue();
      let riskValue = properties.riskValue?.getValue();
      let riskType = properties.riskType?.getValue();

      console.log('隧道名称:', tunnelName);
      console.log('风险类型:', riskType);
      console.log('风险值:', riskValue);
      console.log('岩爆:', properties.yanbao?.getValue());
      console.log('塌方:', properties.tafang?.getValue());
      console.log('掉块:', properties.diaokuai?.getValue());
      console.log('大变形:', properties.dabianxing?.getValue());
      console.log('涌水:', properties.yongshui?.getValue());
      console.log('破碎带:', properties.posuidai?.getValue());

      // 这里可以添加点击后显示详情的逻辑
      // 例如弹出窗口显示该隧道的风险详情
    }
  }
};

// 初始化
let init = () => {
  viewer = DTScopeEngine.viewer;

  if (!viewer) {
    console.error('viewer初始化失败');
    return;
  }

  // 加载坐标数据并绘制
  loadCoordinatesAndDrawLines();

  // 添加点击事件监听器
  viewer.screenSpaceEventHandler.setInputAction(handleClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

onMounted(() => {
  DTScopeEngine.getViewer(() => {
    init();
  });
});

onBeforeUnmount(() => {
  if (viewer) {
    // 移除点击事件监听
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    // 清除所有实体
    clearEntities();
  }
});
</script>

<style lang="scss">
.right {
  display: flex;
  position: absolute;
  top: 100px;
  right: 50px;
  z-index: 1;
  padding: 15px;
  border-radius: 10px;
  align-items: center;
  font-size: 14px;
  background-color: rgb(25 86 94 / 80%);
  gap: 10px;
}

.custom-select {
  position: relative;
  width: 100px;

  select {
    width: 100%;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    background-color: #fff;
    cursor: pointer;
    appearance: none;
  }

  .select-arrow {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid #333;
    pointer-events: none;
  }

  select:hover {
    background-color: #f0f0f0;
  }

  select:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgb(0 123 255 / 25%);
  }
}
</style>

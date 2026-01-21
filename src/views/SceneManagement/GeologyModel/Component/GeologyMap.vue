<template>
  <!-- 不需要额外容器，直接使用主场景容器 -->
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import geologicalData from '../Config/sichuan_groups.json';
import { DTScopeEngine } from '@/utils/Common/Viewer';

onMounted(() => {
  // 使用全局Viewer实例
  const viewer = DTScopeEngine.viewer;
  if (!viewer) {
    console.error('全局Viewer未初始化');
    return;
  }

  // 添加地质群组数据
  geologicalData.features.forEach(feature => {
    const properties = feature.properties;
    const coordinates = feature.geometry.coordinates;
    
    const description = `
      <div style="max-width:400px">
        <h3>${properties.群组名称}</h3>
        <p><strong>代号:</strong> ${properties.代号 || '无'}</p>
        <p><strong>位置:</strong> ${properties.位置 || '无'}</p>
        <p><strong>地质时代:</strong> ${properties.地质时代 || '无'}</p>
        <p><strong>厚度:</strong> ${properties.厚度 || '无'}</p>
        <p><strong>岩性:</strong></p>
        <ul>
          ${properties.岩性.map(rock => `<li>${rock}</li>`).join('')}
        </ul>
      </div>
    `;

    viewer.entities.add({
      name: properties.群组名称,
      position: Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1]),
      point: {
        pixelSize: 6,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 1
      },
      label: {
        text: properties.群组名称,
        font: '12pt sans-serif',
        fillColor: Cesium.Color.GOLD,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 1,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, 10),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      },
      description: description
    });
  });

  // 调整视角（可选）
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(102.5, 30.5, 800000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0
    },
    duration: 2
  });
});

onUnmounted(() => {
  // 清理本组件添加的实体
  const viewer = DTScopeEngine.viewer;
  if (viewer) {
    // 这里需要记录添加的实体ID以便清理
    // 实际实现时需根据您的实体管理策略
  }
});
</script>
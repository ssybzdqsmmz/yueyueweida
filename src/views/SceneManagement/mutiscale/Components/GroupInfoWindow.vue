<template>
  <transition name="slide-up">
    <div v-if="group" class="info-window">
      <div class="info-header">
        <h2>{{ group.群组名称 }} ({{ group.符号 }})</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="info-content">
        <div class="info-section">
          <h3><i class="fas fa-info-circle"></i> 基本信息</h3>
          <table>
            <tr>
              <th>代号</th>
              <td>{{ group.代号 }}</td>
            </tr>
            <tr>
              <th>地质时代</th>
              <td>{{ group.地质时代 }}</td>
            </tr>
            <tr>
              <th>厚度</th>
              <td>{{ group.厚度 }}</td>
            </tr>
            <tr>
              <th>位置</th>
              <td>{{ group.位置 }}</td>
            </tr>
            <tr>
              <th>坐标</th>
              <td>{{ group.正层型坐标 }}</td>
            </tr>
          </table>
        </div>
        
        <div class="info-section">
          <h3><i class="fas fa-layer-group"></i> 岩性组成</h3>
          <div class="rock-types">
            <span v-for="(rock, index) in group.岩性" :key="index" class="rock-tag">
              {{ rock }}
            </span>
          </div>
        </div>
        
        <div class="info-section">
          <h3><i class="fas fa-map"></i> 地层关系</h3>
          <table>
            <tr>
              <th>上覆地层</th>
              <td>{{ group.上覆地层 }}</td>
            </tr>
            <tr>
              <th>下伏地层</th>
              <td>{{ group.下伏地层 }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { GeologyGroup } from '../Utils/geologyVisualizer'

defineProps<{
  group: GeologyGroup | null;
}>();

defineEmits(['close']);
</script>

<style scoped>
.info-window {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 450px;
  background: rgba(15, 25, 40, 0.95);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  z-index: 100;
  backdrop-filter: blur(10px);
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.info-header {
  background: rgba(52, 152, 219, 0.3);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-header h2 {
  font-size: 1.4rem;
  color: #fff;
}

.close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.info-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.info-section {
  margin-bottom: 25px;
}

.info-section h3 {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2ecc71;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px 15px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

th {
  color: #3498db;
  width: 100px;
}

.rock-types {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.rock-tag {
  background: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

/* 动画效果 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
</style>
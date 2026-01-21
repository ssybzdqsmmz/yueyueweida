<template>
  <div class="sidebar" :class="{ 'collapsed': !show }">
    <div class="info-panel" v-if="show">
      <h2><i class="fas fa-info-circle"></i> 地质群组信息</h2>
      <p>本系统展示了四川省地质群组的地理分布信息，点击地图上的标记点可以查看详细地质数据。</p>
      
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">{{ groups.length }}</div>
          <div class="stat-label">群组总数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ eraGroups['元古代'] || 0 }}</div>
          <div class="stat-label">元古代群组</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ eraGroups['早元古代'] || 0 }}</div>
          <div class="stat-label">早元古代群组</div>
        </div>
      </div>

      <div class="search-box">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="搜索群组名称..."
        >
        <i class="fas fa-search"></i>
      </div>

      <h3><i class="fas fa-map-marked-alt"></i> 地质群组列表</h3>
      <div class="group-list">
        <div 
          v-for="group in filteredGroups" 
          :key="group.代号"
          class="group-item"
          :class="{ 'active': selectedGroup && selectedGroup.代号 === group.代号 }"
          @click="$emit('group-selected', group)"
        >
          <div class="group-name">{{ group.群组名称 }}</div>
          <div class="group-symbol">{{ group.符号 }}</div>
          <div class="group-location">{{ group.位置 }}</div>
        </div>
      </div>
    </div>
    <button class="toggle-sidebar" @click="$emit('toggle')">
      <i class="fas" :class="show ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import type { GeologyGroup } from '../Utils/geologyVisualizer'

const props = defineProps({
  show: Boolean,
  groups: {
    type: Array as PropType<GeologyGroup[]>,
    required: true
  },
  selectedGroup: Object as PropType<GeologyGroup | null>
});

defineEmits(['toggle', 'group-selected']);

const searchTerm = ref('');

// 按地质时代统计群组数量
const eraGroups = computed(() => {
  const counts: Record<string, number> = {};
  props.groups.forEach(group => {
    const era = group.地质时代;
    counts[era] = (counts[era] || 0) + 1;
  });
  return counts;
});

// 过滤群组列表
const filteredGroups = computed(() => {
  if (!searchTerm.value) return props.groups;
  
  const term = searchTerm.value.toLowerCase();
  return props.groups.filter(group => 
    group.群组名称.toLowerCase().includes(term) ||
    group.位置.toLowerCase().includes(term) ||
    group.地质时代.toLowerCase().includes(term)
  );
});
</script>

<style scoped>
.sidebar {
  width: 350px;
  background: rgba(15, 25, 40, 0.85);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  display: flex;
  z-index: 5;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.3);
}

.sidebar.collapsed {
  width: 0;
  overflow: hidden;
}

.info-panel {
  padding: 25px;
  width: 100%;
  overflow-y: auto;
  height: calc(100vh - 80px);
}

.info-panel h2 {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  color: #3498db;
}

.info-panel h3 {
  margin: 25px 0 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2ecc71;
}

.info-panel p {
  line-height: 1.6;
  color: #ddd;
  margin-bottom: 20px;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin: 25px 0;
}

.stat-item {
  text-align: center;
  flex: 1;
  padding: 15px;
  background: rgba(52, 152, 219, 0.15);
  border-radius: 10px;
  margin: 0 5px;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 700;
  color: #3498db;
}

.stat-label {
  font-size: 0.9rem;
  color: #bbb;
}

.search-box {
  position: relative;
  margin: 20px 0;
}

.search-box input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border-radius: 30px;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 1rem;
}

.search-box input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.2);
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #ccc;
}

.group-list {
  margin-top: 15px;
}

.group-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid #3498db;
}

.group-item:hover {
  background: rgba(52, 152, 219, 0.15);
  transform: translateX(5px);
}

.group-item.active {
  background: rgba(52, 152, 219, 0.25);
  border-left: 3px solid #2ecc71;
}

.group-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #3498db;
}

.group-symbol {
  font-size: 0.9rem;
  color: #2ecc71;
  margin-bottom: 5px;
}

.group-location {
  font-size: 0.9rem;
  color: #bbb;
}

.toggle-sidebar {
  position: absolute;
  right: -40px;
  top: 20px;
  width: 40px;
  height: 40px;
  background: rgba(15, 25, 40, 0.85);
  border: none;
  border-radius: 0 8px 8px 0;
  color: white;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 3px 0 8px rgba(0, 0, 0, 0.2);
}
</style>
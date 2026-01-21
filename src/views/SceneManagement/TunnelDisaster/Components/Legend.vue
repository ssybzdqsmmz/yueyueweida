<!--
 * @Author: anganao 1928882425@qq.com
 * @Date: 2024-03-12 17:12:30
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-19 09:41:35
 * @FilePath: \Geology-v3\src\views\SceneManagement\TunnelDisaster\Components\Legend.vue
 * @Description: 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * 
-->
<script lang="ts" setup>
import { ref } from 'vue';
interface Item {
  color: string;
  label: string;
}
interface Props {
  data: Item[];
  round: boolean;
}
let props = defineProps<Props>();
let isShow = ref(true);
</script>

<template>
  <div v-if="isShow" :class="props.round ? 'lin-round' : ''" class="lin-legend">
    <div class="line" v-for="item in props.data" :key="item.label">
      <span :style="{ '--color': item.color }" class="iconfont icon-dingwei"></span>
      <div>{{ item.label }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lin-legend {
  display: grid;
  position: absolute;
  bottom: 380px;
  right: 20px;
  z-index: 1;
  font-size: 20px;
  background: url('../images/layerManager.png') no-repeat;
  background-size: 100% 100%;

  // background-color: rgb(0 0 0 / 60%);

  .line {
    display: flex;
    margin: 5px;
    align-items: center;

    span {
      margin-right: 5px;
      color: var(--color);
    }
  }
}

.lin-round {
  border-radius: 10px;
}
</style>

<!--
 * @Author: 枫林残忆 2997534654@qq.com
 * @Date: 2024-04-14 09:34:50
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-14 12:45:43
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnel\Components\Result.vue
 * @Description: 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * 
-->
<script lang="ts" setup>
import { ref } from 'vue';
import RG_flow from './ResultMapping_flow.vue';
import TableBg from './TableBg.vue';
import { Graphs } from '@/views/Knowledge/Utils/Graph';

const hazard = ref(Graphs.DebrisflowHazard);
defineExpose({
  changeHazardResult: (disaster) => {
    hazard.value = disaster;
  },
});
</script>

<template>
  <component :is="TableBg" :title="'地质灾害 - 模拟计算'">
    <div>
      <div class="mapselect"></div>
      <component v-if="Graphs.DebrisflowHazard == hazard" :is="RG_flow" />
    </div>
  </component>
</template>

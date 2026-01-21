<!--
 * @Author: cl
 * @Date: 2021-03-02 14:26:39
 * @LastEditTime: 2024-05-07 10:54:59
 * @LastEditors: Lincong-pro lincong_pro@163.com
 * @FilePath: \Geology-v3\src\components\SvgIcon\index.vue
-->
<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
const props = withDefaults(defineProps<{ iconClass: string; className: string }>(), {
  className: '',
});
let iconName = computed(() => {
  return `#icon-${props.iconClass}`;
});
let svgClass = computed(() => {
  if (props.className) {
    return 'svg-icon ' + props.className;
  }
  return 'svg-icon';
});

defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
  name: 'SvgIcon',
});
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentcolor;
  overflow: hidden;
}
</style>

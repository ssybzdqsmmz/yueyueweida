<!--
 * @Author: 枫林残忆 2997534654@qq.com
 * @Date: 2024-04-13 19:31:31
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-13 20:09:32
 * @FilePath: \Geology-V3\src\LinUI\LinTabs.vue
 * @Description: Tab标签封装
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * 
-->
<script lang="ts" setup>
import { ref, watch, useSlots, VNode, Component } from 'vue';

const props = defineProps<{ modelValue: string }>(); // 父组件向子组件传递的单向数据流
const emit = defineEmits(['update:modelValue']);
const slots = useSlots();
if (slots && slots.default) {
  slots.default().forEach((vn: VNode) => {
    const component = vn.type as Component; // @ts-ignore
    console.log(component.__name);
    const props = vn.props || {};
    props['v-if'] = false;
    console.log(props);
  });
}

const activeTab = ref(props.modelValue); // 用于和父组件同步的中间响应式变量
watch(
  () => props.modelValue,
  (activeName) => {
    activeTab.value = activeName;
  }
);

const setActiveTab = (tabName: string) => {
  activeTab.value = tabName; // 做一些操作
  emit('update:modelValue', tabName); // 通知父组件进行更新-必须更新
};

// watch(() => slots.default, () => {

// })
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>

<!--
 * @Author: 枫林残忆
 * @Date: 2024-03-06 19:56:18
 * @LastEditors: 枫林残忆
 * @LastEditTime: 2024-03-09 13:39:39
 * @FilePath: \Geology-V3\src\views\SceneManagement\Layout\Components\RoamEdit\ViewPort.vue
 * @Description: 新增视点面板
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<template>
  <div v-if="panelShow" class="roam-edit roam-viewport">
    <div class="roam-title-bg">
      <span class="content">{{ props.title }}</span>
      <span @click="panelShow = false" class="close-btn"></span>
    </div>

    <div class="roam-body">
      <div class="notion">
        <div class="notion-icon"></div>
        <span class="notion-text">{{ props.notion }}</span>
      </div>
      <div class="edit-path-name">
        <span>名称</span>
        <input v-model="editData.name" placeholder="请输入名称" type="text" />
      </div>
      <div class="edit-path-name">
        <span>时长</span>
        <input type="number" v-model.number="editData.duration" class="input-label" placeholder="请输入时长" />
        <div class="scale-label">秒</div>
      </div>
      <div class="descrip">
        <div class="btn-group">
          <div @click="cancle">取消</div>
          <div @click="save">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
const panelShow = ref(false);

// 定义如下属性
const props = defineProps<{ title: string; notion: string }>();

// 定义如下事件 - 将数据抛出，用户自行处理数据
const emit = defineEmits(['cancle', 'save']);

let editFrame = {
  name: '',
  duration: 0,
}; // 用于保存当前要编辑的视角
const editData = reactive(editFrame);

function viewportWindow(frame) {
  editData.name = frame.name;
  editData.duration = frame.duration;
  editFrame = frame;
  panelShow.value = true;
}
function addViewportWindow() {
  panelShow.value = true;
}

defineExpose({ viewportWindow, addViewportWindow });

function cancle() {
  panelShow.value = !panelShow.value;
  emit('cancle', editFrame);
}

function save() {
  panelShow.value = !panelShow.value;
  editFrame.name = editData.name;
  editFrame.duration = editData.duration;
  emit('save', editFrame);
}
</script>

<style lang="scss">
@import './common';

.edit-path-name {
  // 关闭Input的默认行为
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }

  input[type='number'] {
    appearance: textfield; /* Firefox */
  }
}
</style>

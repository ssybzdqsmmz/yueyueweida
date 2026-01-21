<!--
 * @Author: 枫林残忆
 * @Date: 2024-03-06 20:00:21
 * @LastEditors: 枫林残忆
 * @LastEditTime: 2024-03-09 13:46:18
 * @FilePath: \Geology-V3\src\views\SceneManagement\Layout\Components\RoamEdit\Path.vue
 * @Description: 路径编辑窗口
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<template>
  <div v-if="panelShow" class="roam-edit roam-path">
    <div class="roam-title-bg">
      <span class="content">{{ props.title }}</span>
      <span @click="panelShow = false" class="close-btn"></span>
    </div>

    <div class="roam-body">
      <div class="edit-path-name">
        <span>路径名称</span>
        <input v-model="currentPath" placeholder="请输入路径名称" type="text" />
      </div>
      <div @click="openAddViewportWindow" class="add">
        <span class="add-icon"></span>
        <span>新增视点</span>
      </div>

      <div class="descrip">
        <div class="frane-title">
          <span>路径视点</span>
          <span>共计{{ viewPathData.length }}个视点</span>
        </div>
        <el-scrollbar class="fixed-height">
          <div v-for="frame in viewPathData" :key="frame.img" class="frame-viewport-body">
            <div class="frame-viewport">
              <span class="left-icon"></span>
              <img :src="frame.img" />
              <span class="right-title">{{ frame.name }}</span>
            </div>
            <div class="edit-icon-container">
              <span @click="flyToViewPort(frame.ViewPoint, frame.duration)" class="navigation"></span>
              <span @click="openEditViewportWindow(frame)" class="adjust"></span>
              <span @click="removeViewPort(frame)" class="delete"></span>
            </div>
          </div>
        </el-scrollbar>

        <div class="btn-group">
          <div @click="panelShow = !panelShow">取消</div>
          <div @click="updatePath">保存</div>
        </div>
      </div>
    </div>
  </div>

  <!--视图编辑窗口-->
  <ViewPort
    ref="editViewPort"
    @cancle="handleEditCancle"
    @save="handleEditSave"
    title="编辑视点"
    notion="编辑视点：编辑当前地图视角视点时间"
  ></ViewPort>
  <!--视图保存窗口-->
  <ViewPort @save="handleAddViewport" ref="addViewPort" title="新增视点" notion="新增视点：将当前地图视角保存为一个视点"></ViewPort>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { setCameraViewPoint, getCameraViewportForServer } from '../../Utils/CameraControl';
import WEventBus from '../../Tools/WEventBus';
import { v4 as uuidv4 } from 'uuid';
import { getRoamPath, updateRoamPath, addRoamPath, uploadImage } from '../../Service/ServerAPI';
import { loadingEvents } from '../events';
import ViewPort from './ViewPort.vue';
import html2canvas from 'html2canvas';
import { imgServer } from '../../Service/ServiceProperties';

const props = defineProps<{
  title: string;
}>();

const panelShow = ref(false);
const viewPathData = ref([]);

const editViewPort = ref(null);
const addViewPort = ref(null);

/**
 * 控制视图编辑面板
 * @param frame 帧
 */
function openEditViewportWindow(frame) {
  editViewPort.value.viewportWindow(frame); // 打开视图窗口
}

/**
 * 控制视图添加面板
 */
function openAddViewportWindow() {
  addViewPort.value.addViewportWindow();
}

const currentPath = ref(''); // 当前新增或编辑的路径

let eventBus = new WEventBus();

function flyToViewPort(viewPort, duration) {
  let viewer = DTScopeEngine.viewer;
  setCameraViewPoint(viewer, viewPort, duration);
}

/**
 * 基于 uuid 更新viewPathData
 * @param editFrame 当前编辑帧
 */
function updateFrame(editFrame: any) {
  for (let i = 0; i < viewPathData.value.length; ++i) {
    if (viewPathData.value[i].uuid == editFrame.uuid) {
      viewPathData.value[i].name = editFrame.name;
      viewPathData.value[i].duration = editFrame.duration;
      break;
    }
  }
}

/**
 * @description: 添加帧
 * @param {*} viewPort 视角
 * @return {void}
 */
function addFrame(viewPort) {
  viewPathData.value.push(viewPort); // 更新响应式数据
}

// 视点编辑
function handleEditCancle(frame) {
  handleEditSave(frame); // 必须调用才能更新
}

function handleEditSave(frame) {
  updateFrame(frame);
}

async function handleAddViewport(frame) {
  eventBus.emit(loadingEvents.changeLoadingWidget, true); // 进度条
  let viewer = DTScopeEngine.viewer;
  // 截取canvas当前的图片
  //@ts-ignore
  let canvas = await html2canvas(document.getElementsByClassName('cesium-widget')[0], {
    allowTaint: true,
    useCORS: true, //支持图片跨域
    scale: 1, //设置放大的倍数
  });
  canvas.toBlob(async (blob) => {
    const res = await uploadImage(blob);
    let view = {
      name: frame.name,
      duration: frame.duration,
      ViewPoint: getCameraViewportForServer(viewer),
      img: imgServer + res.data.url,
      uuid: uuidv4(),
    };

    addFrame(view); // 更新视点
    eventBus.emit(loadingEvents.changeLoadingWidget, false); // 进度条
  });
}

const emit = defineEmits(['updatePathList']);
defineExpose({
  openPathEditor: async (roamPath: string) => {
    // 传递了编辑路径
    if (roamPath) {
      currentPath.value = roamPath;
      let res = await getRoamPath(roamPath);
      viewPathData.value = res.data; // TODO 下面这个逻辑有待修改
      currentPath.value = roamPath.slice(0, roamPath.length - 5);
    }
    panelShow.value = true;
  },
});

function removeViewPort(frame) {
  for (let i = 0; i < viewPathData.value.length; i++) {
    if (viewPathData.value[i].uuid == frame.uuid) {
      viewPathData.value.splice(i, 1);
      break;
    }
  }
}

function updatePath() {
  const handlePathOperation = (operationFunction) => {
    eventBus.emit(loadingEvents.changeLoadingWidget, true); // 进度条
    operationFunction()
      .then(() => {
        panelShow.value = false;
        eventBus.emit(loadingEvents.changeLoadingWidget, false); // 进度条
      })
      .catch(() => {
        eventBus.emit(loadingEvents.changeLoadingWidget, false); // 进度条
      });
  };

  if (props.title == '新增路径') {
    handlePathOperation(() =>
      addRoamPath(currentPath.value + '.json', viewPathData.value).then(() => {
        emit('updatePathList'); // 通知父窗体更新列表状态
        viewPathData.value = []; // 清空子窗体状态
        currentPath.value = ''; // 清空标题
      })
    );
  } else {
    handlePathOperation(() => updateRoamPath(currentPath.value + '.json', viewPathData.value));
  }
}
</script>

<style lang="scss" scoped>
@import './common';

.fixed-height {
  height: 140px;
  margin-bottom: 10px;
}
</style>

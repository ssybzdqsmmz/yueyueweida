<!--
 * @Author: 枫林残忆
 * @Date: 2024-03-06 20:01:46
 * @LastEditors: 枫林残忆
 * @LastEditTime: 2024-03-10 09:39:37
 * @FilePath: \Geology-V3\src\views\SceneManagement\Layout\Components\RoamEdit\RoamSelect.vue
 * @Description: 帧漫游窗口
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<template>
  <!-- 帧漫游 -->
  <div v-if="roamSelect" class="roam-edit">
    <div class="roam-title-bg">
      <span class="content">帧漫游</span>
      <span @click="roamSelect = false" class="close-btn"></span>
    </div>
    <div class="roam-body">
      <div @click="openRoamPathEditor" class="add">
        <span class="add-icon"></span>
        <span>新增路径</span>
      </div>
      <div class="descrip">
        <div class="frane-title">
          <span>路径数据</span>
          <span>共计{{ roamPaths.length }}条路径</span>
        </div>
        <el-scrollbar class="fixed-height">
          <div v-for="(roamPath, index) in roamPaths" :key="roamPath" class="frame-body">
            <div class="frame-body-title">
              {{ roamPath.slice(0, roamPath.length - 5) }}
              <span @click="deletePath(roamPath)" class="delete-btn"></span>
              <span @click="openPathEditor(roamPath)" class="edit-btn"></span>
            </div>
            <div class="frame-timeline">
              <span @click="playRoamPath($event, roamPath, index)" class="play-btn"></span>
              <canvas width="32" height="32" :class="['circle-status', 'circle-status' + roamPath.slice(0, roamPath.length - 5)]"></canvas>
              <span
                @mousedown="mouseDown($event, roamPath)"
                @mousemove="mouseMove"
                @mouseup="mouseUp"
                :class="['scroll-bar', 'scroll-bar' + roamPath.slice(0, roamPath.length - 5)]"
              >
                <div class="scroll-bar-valid">
                  <div class="scroll-bar-btn"></div>
                </div>
              </span>
              <el-checkbox @change="(value) => updateClock(value, roamPath)" v-model="checkboxes[index]">循环播放</el-checkbox>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
  <Path title="编辑路径" ref="editPath"></Path>
  <Path title="新增路径" @updatePathList="updatePathList" ref="addPath"></Path>
</template>

<script lang="ts" setup>
import { getAllPaths, getRoamPath, deleteRoamPath } from '../../Service/ServerAPI';
import { onMounted, ref } from 'vue';
import FrameRoam from '../../Tools/FrameRoam';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import Path from './Path.vue';
import { loadingEvents } from '../events';
import WEventBus from '../../Tools/WEventBus';
import { ClockRange } from 'Cesium';

const roamPaths = ref([]);
const roamSelect = ref(false);

const editPath = ref(null);
const addPath = ref(null);
const checkboxes = ref([]);

let eventBus = new WEventBus();
eventBus.addExcludeFilter(loadingEvents.changeLoadingWidget);
eventBus.addExcludeFilter('ChangeProgress');
eventBus.addExcludeFilter('ChangeProgressClock');
eventBus.addExcludeFilter('CLAMPED');

let activePath = '';

eventBus.on('ChangeProgress', (progress: number) => {
  //@ts-ignore
  let scrollBar: HTMLElement = document.getElementsByClassName('scroll-bar' + activePath)[0];
  let validProgressBar = scrollBar.children[0]; //@ts-ignore
  validProgressBar.style.width = Math.floor(progress * scrollBar.clientWidth) + 'px';

  const canvasClass = 'circle-status' + activePath;
  let canvas = document.getElementsByClassName(canvasClass)[0];
  if (progress == 0) {
    canvas.parentNode.querySelector('.play-btn').classList.remove('play-btn-pause');
  }
  //@ts-ignore
  let ctx = canvas.getContext('2d', { antialias: true }); //@ts-ignore
  const x = canvas.width / 2; //@ts-ignore
  const y = canvas.width / 2;
  const radius = 15;
  //@ts-ignore
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 开始绘制
  ctx.beginPath();
  ctx.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + ((progress * 360) / 180) * Math.PI);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgb(81, 171, 251)';
  ctx.stroke();
});

/**
 * 根据当前选择编辑的路径进行修改
 * @param roamPath 文件路径
 */
function openPathEditor(roamPath: string) {
  editPath.value.openPathEditor(roamPath);
}

/**
 * 删除漫游路径
 * @param roamPath 漫游路径
 */
async function deletePath(roamPath: string) {
  eventBus.emit(loadingEvents.changeLoadingWidget, true); // 进度条
  await deleteRoamPath(roamPath);
  getAllPaths()
    .then((res) => {
      eventBus.emit(loadingEvents.changeLoadingWidget, false);
      roamPaths.value = res.data;
      checkboxes.value = Array(res.data.length).fill(false);
    })
    .catch(() => {
      eventBus.emit(loadingEvents.changeLoadingWidget, false); // 进度条
    });
}

/**
 * 打开编辑窗口
 */
function openRoamPathEditor() {
  addPath.value.openPathEditor();
}

defineExpose({
  openPanel: () => {
    roamSelect.value = true;
  },
});

const playRoamPath = (() => {
  let frameRoam;
  let isPause = true;
  let preRoamPath = '';
  let preRoamBtn;

  eventBus.on('CLAMPED', () => {
    isPause = true;
  });

  return async ($event, roamPath, index) => {
    if (roamPath != preRoamPath) {
      preRoamBtn?.classList.remove('play-btn-pause');
      frameRoam?.destroy();
      isPause = true;
      eventBus.emit('ChangeProgress', 0); // 置空进度条
    }

    // 样式处理
    let playBtn = $event.target;
    if (isPause) {
      playBtn.classList.add('play-btn-pause');
    } else {
      playBtn.classList.remove('play-btn-pause');
    }
    preRoamBtn = playBtn;
    isPause = !isPause;

    activePath = roamPath.slice(0, roamPath.length - 5);

    // 漫游状态管理
    if (!frameRoam || frameRoam.isDestroyed()) {
      let viewer = DTScopeEngine.viewer;
      const res = await getRoamPath(roamPath);
      const jsonData = res.data;
      console.log(checkboxes.value[index]);
      frameRoam = new FrameRoam(viewer, jsonData, checkboxes.value[index]);
      frameRoam.start();
    } else {
      frameRoam.pause(isPause);
    }
    preRoamPath = roamPath;
  };
})();

async function updatePathList() {
  let res = await getAllPaths();
  roamPaths.value = res.data;
  checkboxes.value = Array(res.data.length).fill(false);
}

let initialX = 0;
let offsetX = 0;

const mouseDown = ($event: MouseEvent, roamPath: string) => {
  initialX = $event.clientX;
  activePath = roamPath.slice(0, roamPath.length - 5);
};

const mouseMove = (event: MouseEvent) => {
  if (initialX != 0) {
    offsetX = event.clientX - initialX;

    initialX = event.clientX;
    let className = 'scroll-bar' + activePath;
    let scrollBar = document.getElementsByClassName(className)[0];
    let scrollBarValid = scrollBar.children[0];
    //@ts-ignore
    scrollBarValid.style.width = scrollBarValid.clientWidth + offsetX + 'px'; //@ts-ignore
    eventBus.emit('ChangeProgressClock', (scrollBarValid.clientWidth + offsetX) / scrollBar.clientWidth); //@ts-ignore
  }
};

const mouseUp = () => {
  initialX = 0;
  offsetX = 0;
};

function updateClock(value, roamPath) {
  console.log(value, activePath, roamPath);
  if (activePath == '') {
    return;
  }
  if (activePath == roamPath.slice(0, roamPath.length - 5)) {
    let viewer = DTScopeEngine.viewer;
    if (!value) {
      viewer.clock.clockRange = ClockRange.CLAMPED;
    } else {
      viewer.clock.clockRange = ClockRange.LOOP_STOP;
    }
  }
}

onMounted(() => {
  updatePathList();
});
</script>

<style lang="scss" scoped>
@import './common';

.fixed-height {
  height: 192px;
}

:deep(.play-btn-pause) {
  background: url('../../Assets/roam/pause.svg') no-repeat !important;
  background-size: 120% 120% !important;
  background-position: center center !important;
}
</style>

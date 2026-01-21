<!--
 * @Author: Lincong-pro
 * @Date: 2023-03-30 14:51:06
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-01 18:53:39
 * @FilePath: \geoproject2.0\src\views\ModelCustomization\Log.vue
 * @Description: 主要用于推流后台数据【日志监控】
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div class="log-container">
    <el-tabs v-model="activeTab" type="card" tab-position="top">
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><calendar /></el-icon>
            <span>节点信息</span>
          </span>
        </template>
        <div class="el-scrollbar">测试</div>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><DataAnalysis /></el-icon>
            <span>实时数据</span>
          </span>
        </template>
        <el-table style="width: 100%" max-height="275" :data="logData" row-key="id" default-expand-all>
          <el-table-column width="60" prop="level" label="级别">
            <template #default="scope">
              <el-tag :type="scope.row.level">
                {{ scope.row.level }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column width="115" prop="time" label="时间" sortable></el-table-column>
          <el-table-column width="308" show-overflow-tooltip prop="message" label="详情" sortable>
            <template #default="{ row }">
              <el-tooltip :content="row.message" :raw-content="true" placement="top">
                {{ row.message }}
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Tickets /></el-icon>
            <span>执行日志</span>
          </span>
        </template>
        <div class="el-scrollbar">测试</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { Calendar, DataAnalysis, Tickets } from '@element-plus/icons-vue';
import { ref, reactive, onBeforeMount } from 'vue';
import DWebSocket from '@/utils/Network/WebSocket';
import AnsiUp from 'ansi_up';

const ansi_up = new AnsiUp();

const activeTab = ref('1');
// 实时输出日志
const logData = reactive([]);

const connect = () => {
  logData.push({ message: '远程服务器连接成功', level: 'success', time: new Date().Format('hh:mm:ss') });
};

const disconnect = () => {
  logData.push({ message: '远程服务器连接成功', level: 'danger', time: new Date().Format('hh:mm:ss') });
};

const logging = (pack) => {
  pack.message = ansi_up.ansi_to_html(pack.message);
  if (logData.length <= 100) {
    logData.unshift(pack);
  } else {
    logData.pop();
    logData.unshift(pack);
  }
};

onBeforeMount(() => {
  const dWebSocket = new DWebSocket({ connect: connect, disconnect: disconnect, logging: logging });
});
</script>

<style lang="scss" scoped>
.log-container {
  display: flex;
  width: 548px;
  height: 360px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  background: rgb(37 75 102 / 80%);

  .el-tabs {
    --table-header-bg-color: #254b66;
    --tabs-height: 355px;

    width: 503px;
    height: var(--tabs-height); // 46 * 5 + 40 + 40 + 5[border] + 40[padding .el-table]

    :deep(.el-table) {
      --el-table-row-hover-bg-color: rgb(35 145 255 / 29.8%);
      --el-table-bg-color: transparent;

      position: relative;
      top: 20px;
    }

    :deep(.el-table tr) {
      border: #409eff;
      background-color: rgb(35 145 255 / 10%);
      cursor: pointer;
    }

    :deep(.el-table .el-table__header) {
      margin: 0 10px;
      background-color: var(--table-header-bg-color);
    }

    :deep(.el-scrollbar__view) {
      margin-left: 10px;
    }

    :deep(.el-table .el-table__header .el-table__cell) {
      height: 28px; // 因为有border
      border: 1px solid #f5f7fa;
      color: #ffffff;
      font-family: '微软雅黑 Bold';
      font-weight: 700;
      text-align: center;
      background-color: var(--table-header-bg-color);
    }

    :deep(.el-table__inner-wrapper::before) {
      width: calc(100% - 20px);
      margin-left: 10px;
    }

    :deep(.el-table .cell) {
      padding: 0;
    }

    :deep(.el-table__row .el-table__cell) {
      color: #ffffff;
      font-weight: 400;
      text-align: center;
    }

    :deep(.el-table__row td.el-table__cell:nth-of-type(3)) {
      display: flex;
      height: 46px;
      padding: 0 5px;
    }

    :deep(.el-table__row td.el-table__cell:nth-of-type(3) .cell) {
      display: -webkit-box;
      width: 298px;
      height: 46px;
      text-align: left;
      white-space: normal;

      // overflow: hidden;
      // text-overflow: ellipsis; // cannot set height
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .custom-tabs-label {
      display: inline-block;

      i {
        display: inline;
        height: 18px;
        margin-left: 2px;
        vertical-align: middle;
      }
    }

    .el-tab-pane {
      display: flex;
      height: calc(var(--tabs-height) - 40px);
      border: solid white;
      border-width: 0 1px 1px;
    }

    :deep(.el-tabs__header) {
      margin: 0;
    }

    :deep(.el-tabs__item.is-active) {
      border-bottom-width: 2px;
      border-bottom-color: #409eff;
      color: #409eff;
    }

    :deep(.el-tabs__item) {
      margin-top: -1px;
      padding: 0 20px;
      color: #ffffff;
      font-family: '微软雅黑';
      font-size: 18px;
      font-weight: 700px;
    }

    :deep(.el-tabs__nav) {
      float: right;
    }

    .el-scrollbar {
      height: calc(300px - var(--el-tabs-header-height));
      list-style: none;
      font-size: 16px;

      li {
        padding: 2px 2px 2px 3px;

        :deep(span) {
          display: block;
          width: 100%;
        }
      }
    }
  }
}
</style>

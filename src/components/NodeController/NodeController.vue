<!--
 * @Author: changfanhao
 * @Date: 2023-03-29 13:16:31
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-01 11:22:46
 * @FilePath: \geoproject2.0\src\components\NodeController\NodeController.vue
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div class="main_nodecontroller">
    <div class="outer_title">
      <!--添加节点按钮-->
      <div class="outer_title_add">
        <div class="outer_title_add_label" @click="changeBack()">添加</div>
        <div v-show="first_show" class="outer_title_add_back01" :style="{ '--back-width': back_width }">
          <div v-for="item in cascater_items" :key="item.label" class="outer_title_add_first">
            <span class="outer_title_add_first_label">{{ item.label }}</span>
            <span class="iconfont icon-xiangyoujiantou"></span>
            <div id="outer_title_add_back02" class="outer_title_add_back02">
              <div v-for="sub in item.children" :key="sub.label" class="outer_title_add_second" @click="addNewNode()">
                <span class="outer_title_add_second_label">{{ sub.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--添加节点按钮-->
    </div>
    <div class="outer_content">
      <div id="outer_for_size" class="outer_for_resize">
        <div id="container_nodecontroller" class="container_nodecontroller"></div>
        <teleportContainer />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NodeControl from '@/utils/NodeControl';
import { onMounted, reactive, ref } from 'vue';
import { register, getTeleport } from '@antv/x6-vue-shape';
import ImportData from '@/components/NodeController/NodePanels/ImoortData.vue';
import OutputData from './NodePanels/OutputData.vue';
import ModelAnalyse from './NodePanels/ModelAnalyse.vue';
//样式控制变量
//添加面板
let back_width = ref('0');
let first_show = ref(false);
//end

let el_cascader_value = ref('');
const cascater_items = [
  {
    value: '导入数据',
    label: '导入数据',
    children: [
      {
        value: 'json',
        label: 'json',
      },
      {
        value: 'excel',
        label: 'excel',
      },
    ],
  },
  {
    label: '分析模型',
    value: '分析模型',
    children: [
      {
        label: '滑坡分析',
        value: '滑坡分析',
      },
      {
        label: '滚石模拟',
        value: '滚石模拟',
      },
    ],
  },
];

register({
  shape: 'custom-vue-node-importdata',
  component: ImportData,
});
register({
  shape: 'custom-vue-node-outputdata',
  component: OutputData,
});
register({
  shape: 'custom-vue-node-modelanalyse',
  component: ModelAnalyse,
});
let teleportContainer = getTeleport();

const node = [];

onMounted(() => {
  let container = document.getElementById('container_nodecontroller');
  const nodecontrol = new NodeControl(container);
  const domDiv = document.getElementById('outer_for_resize');
  node.push(nodecontrol.addNode());
});

//样式控制函数
//添加节点
function changeBack() {
  back_width.value = back_width.value == '0' ? '10em' : '0';
  first_show.value = first_show.value == true ? false : true;
}
//end
//节点相关功能
//1、添加节点按钮
function addNewNode() {
  changeBack();
}
</script>

<style scoped lang="scss">
.main_nodecontroller {
  position: absolute;
  top: 25vh;
  left: 25vw;
  width: 60em;
  height: 30em;
  font-size: 16px;

  .outer_title {
    width: 100%;
    height: 5%;
    background-color: black;
  }

  .outer_content {
    width: 100%;
    height: 95%;

    .outer_for_resize {
      width: 100%;
      height: 100%;

      .container_nodecontroller {
        width: 100%;
        height: 100%;
      }
    }
  }
}

/* 添加节点按钮样式 */
.outer_title_add {
  width: 2.6em;
  height: 1.5em;
  font-size: 16px;

  .outer_title_add_label {
    width: 100%;
    height: 100%;
    padding-top: 0.2em;
    border-radius: 0.3em;
    font-size: 0.8em;
    text-align: center;
  }

  .outer_title_add_back01 {
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
    width: var(--back-width);
    padding-top: 0.2em;
    border-radius: 0.3em;
    font-size: 0.8em;
    background-color: rgb(24 24 24);

    .outer_title_add_first {
      width: 100%;
      height: 1.6em;
      margin-bottom: 0.2em;
      border-radius: 0.3em;
      text-align: center;

      .iconfont {
        position: relative;
        left: 3em;
        font-size: 0.8em;
      }

      .outer_title_add_back02 {
        position: relative;
        top: -1.3em;
        left: 10em;
        width: 0;
        height: 10em;
        padding-top: 0.2em;
        border-radius: 0.3em;
        overflow: hidden;
        background-color: rgb(24 24 24);

        .outer_title_add_second {
          width: 100%;
          height: 1.6em;
          margin-bottom: 0.2em;
          border-radius: 0.3em;
          text-align: center;
        }
      }
    }
  }
}

.outer_title_add_label:hover {
  background-color: #853434;
}

.outer_title_add_first:hover {
  background-color: rgb(71 114 179);

  .outer_title_add_back02 {
    width: 10em !important;
  }
}

.outer_title_add_second:hover {
  background-color: rgb(71 114 179);
}

/* end */
</style>

<!--
 * @Author: 杨语涵 861896230@qq.com
 * @Date: 2023-04-23 15:38:10
 * @LastEditors: Lincong-pro lincong_pro@163.com
 * @LastEditTime: 2024-05-06 13:01:00
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnel\Components\Legend.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="main">
    <div class="title-plus">图例(灾害模拟)</div>
    <div class="left">
      <div class="leftTitle">灾害影响对象</div>
      <div class="leftIcon">
        <div class="leftRow">
          <div class="leftHead"></div>
          <div class="leftCell">整体影响范围</div>
        </div>
        <div class="leftRow">
          <div class="leftHead modifier1"></div>
          <div class="leftCell">重度破坏建筑</div>
        </div>
        <div class="leftRow">
          <div class="leftHead modifier2"></div>
          <div class="leftCell">轻度破坏建筑</div>
        </div>
        <div class="leftRow">
          <div class="leftHead modifier3"></div>
          <div class="leftCell">基本完好建筑</div>
        </div>
        <div class="leftRow">
          <div class="leftHead modifier4"></div>
          <div class="leftCell">破坏道路</div>
        </div>
      </div>
    </div>
    <div class="middle">
      <component v-if="hazard == Graphs.DebrisflowHazard" :is="LE_flow" />
    </div>
    <div class="right">
      <div class="rightTitle">监测点位</div>
      <div class="rightIcon">
        <div class="rightHead"></div>
        <div class="rightCell">气象监测站</div>
      </div>
      <div class="rightIcon">
        <div class="rightHead1"></div>
        <div class="rightCell">地表GNSS</div>
      </div>
      <div class="rightIcon1"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import LE_flow from './Legend_flow.vue';
import { useStore } from 'vuex';
import { Graphs } from '@/views/Knowledge/Utils/Graph';

const hazard = ref(Graphs.DebrisflowHazard);
const store = useStore();
//获取灾害类型 与模拟计算相关联
computed({
  get: () => {
    return store.getters.hazard;
  },
  set: (value) => {
    return store.commit('dtglobe_store/hazard', value);
  },
});

defineExpose({
  changeLegendResult: (disaster) => {
    hazard.value = disaster;
  },
});
</script>

<style lang="scss" scoped>
.main {
  position: absolute;
  top: 723px;
  right: 12px;
  width: 556px;
  height: 253px;
  background-color: rgb(238 238 238 / 100%);
  opacity: 0.9;

  .title-plus {
    width: 546px;
    height: 49px;
    margin-left: 10px;
    line-height: 49px;
    color: #000000;
    font-size: 18px;
    text-align: left;
  }

  .left {
    position: absolute;
    top: 49px;
    height: 204px;
    width: 220px;

    .leftTitle {
      width: 180px;
      height: 28px;
      margin: 6px 20px 5px;
      line-height: 28px;
      color: #000000;
      font-size: 16px;
      text-align: left;
    }

    .leftIcon {
      display: grid;
      width: 180px;
      height: 165px;
      margin: 0 20px;
      grid-template-rows: repeat(5, 1fr);

      .leftRow {
        display: grid;
        grid-template-columns: 61px 119px;

        .leftHead {
          margin: 3px;
          background-color: rgb(218 222 173 / 100%);
        }

        .leftCell {
          margin: 3px;
          line-height: 27px;
          color: #000000;
          font-size: 16px;
          text-align: left;
        }

        .modifier1 {
          background-color: rgb(217 0 27 / 77.6%);
        }

        .modifier2 {
          background-color: rgb(252 153 4 / 77.6%);
        }

        .modifier3 {
          background-color: rgb(13 104 18 / 77.6%);
        }

        .modifier4 {
          background-color: rgb(238 238 238 / 100%);
          background-image: url('@/assets/images/地灾监测/u2522.svg');
        }
      }
    }
  }

  .middle {
    position: absolute;
    top: 49px;
    left: 200px;
    height: 204px;
    width: 163px;

    .middleTitle {
      width: 128px;
      height: 28px;
      margin: 6px 17.5px 5px;
      line-height: 28px;
      color: #000000;
      font-size: 16px;
      text-align: left;
    }

    .middleIcon {
      display: flex;
      width: 123px;
      height: 165px;
      margin: 0 20px;
    }
  }

  .right {
    position: absolute;
    top: 49px;
    left: 383px;
    height: 204px;
    width: 163px;

    .rightTitle {
      width: 106px;
      height: 28px;
      margin: 6px 28.5px 5px;
      line-height: 28px;
      color: #000000;
      font-size: 16px;
      text-align: left;
    }

    .rightIcon {
      display: grid;
      width: 118px;
      height: 37px;
      margin: 0 22.5px;
      grid-template-columns: 37px 86px;

      .rightHead {
        margin: 5px;
        background-image: url('../Assets/svg/气象.svg');
        background-size: 100%;
      }

      .rightHead1 {
        margin: 4px;
        background-image: url('../Assets/svg/GNSS.svg');
        background-size: 100%;
      }

      .rightCell {
        margin: 3px;
        line-height: 31px;
        color: #000000;
        font-size: 16px;
        text-align: left;
      }
    }

    .rightIcon1 {
      float: right;
      width: 80px;
      height: 80px;
      background-image: url('vge.png');
      background-size: 100%;
    }
  }
}

@media screen and (max-height: 970px) {
  .main {
    // position: absolute;
    // top: 662px;
    // right: 18px;
    width: 556px;
    height: 253px;
    background-color: rgb(238 238 238 / 100%);
    opacity: 0.9;
    transform-origin: 100% 0%;
    scale: 0.7;
  }
}
</style>

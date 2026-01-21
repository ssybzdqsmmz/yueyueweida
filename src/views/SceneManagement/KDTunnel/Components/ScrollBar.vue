<!--
 * @Author: Lincong-pro
 * @Date: 2023-03-15 09:05:28
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-16 20:43:03
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnel\Components\ScrollBar.vue
 * @Description: 灾害信心可视化控制面板
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div class="container">
    <div class="main">
      <div class="control-area">
        <div class="play-bar">
          <span class="iconfont icon-hanhan-01 icon-font-left"></span>
          <span class="iconfont icon-font-play" :class="pauseStatus ? 'icon-bofang' : 'icon-zanting'" @click="playDisaster"></span>
          <span class="iconfont icon-font-right icon-hanhan-011"></span>
          <input v-model.number="frame" type="text" />
          <div class="adapter">
            <span class="unit">s</span>
          </div>
          <div class="up-down-adapter">
            <span class="iconfont icon-xiangshangjiantou icon-up" @click="changeFrame('up')"></span>
            <span class="iconfont icon-xiangxiajiantou icon-down" @click="changeFrame('down')"></span>
          </div>
        </div>
        <div class="slider-block">
          <el-slider v-model.number="frame" :disabled="!pauseStatus" :max="progressMax"></el-slider>
        </div>
      </div>
    </div>
    <LandSlide></LandSlide>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LandSlide from './LandSlideCopy.vue';

export default {
  name: 'ScrollBar',
  computed: {
    ...mapState('simulation', ['disasterFrame', 'simulationPause', 'progressMax']),
    frame: {
      // frame control
      get() {
        return this.disasterFrame;
      },
      set(val) {
        console.log('frame:', val);
        this.$store.commit('simulation/setDisasterFrame', val);
      },
    },
    pauseStatus: {
      // continue or pause
      get() {
        return this.simulationPause;
      },
      set(val) {
        this.$store.commit('simulation/setSimulationPause', val);
      },
    },
  },
  methods: {
    changeFrame(flag) {
      if (flag == 'up') {
        this.frame = this.frame + 1;
      } else {
        this.frame = this.frame - 1;
      }
    },
    playDisaster() {
      // 切换图标样式
      this.pauseStatus = !this.pauseStatus;
    },
  },
  components: { LandSlide },
};
</script>

<style lang="scss" scoped>
@import '../Assets/variables';

.container {
  --scroll-width: 620px;

  position: absolute;
  bottom: 100px;

  .main {
    display: inline-block;
    position: relative;
    z-index: 20;
    width: var(--scroll-width);
    margin-left: calc(50vw - calc(var(--scroll-width) / 2));
    padding: 5px 0;
    border-width: 0;
    border-radius: 5px;
    color: #ffffff;
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
    font-size: 18px;
    font-weight: 700;
    background-color: rgb(55 94 84 / 78.5%);
    font-style: normal;

    .title {
      position: relative;
      width: 100%;
      height: 35px;
      border-width: 0;
      line-height: 35px;

      // background: url("@/assets/icons/titleBar.svg") no-repeat;
      background-size: 100% 100%;
      background-color: transparent;

      p {
        margin: 0;
        text-rendering: optimizelegibility;
        font-kerning: normal;
      }
    }

    .board {
      position: relative;
      width: 419px;
      height: 24px;
      margin: 0 auto;
      margin-top: 5px;
      line-height: 24px;
      color: #666666;
      font-family: '微软雅黑';
      font-size: 14px;
      font-weight: 400;
      text-align: center;
      letter-spacing: normal;
      background-color: white;
    }

    .control-area {
      position: relative;
      height: 70px;
      box-sizing: border-box;
      margin: 0 auto;
      margin-top: 7px;

      .play-bar {
        display: block;
        cursor: pointer;

        .icon-font-left {
          margin-left: 188px; // need compute
          line-height: 30px;
          color: rgb(35 152 156);
          font-size: 22px;
          vertical-align: middle;
        }

        .icon-font-play {
          margin-left: 60px;
          line-height: 38px;
          color: rgb(35 152 156);
          font-size: 30px;
          vertical-align: middle;
        }

        .icon-font-right {
          height: 30px;
          margin-left: 59px;
          line-height: 30px;
          color: rgb(35 152 156);
          font-size: 22px;
          vertical-align: middle;
        }

        // input不支持伪元素
        input {
          display: inline-block;
          position: relative;
          width: 58px;
          height: 26px;
          margin-left: 33px;
          padding: 11px 10px;
          border: 1px solid rgb(0 83 90);
          border-radius: 5px;
          outline: none;
          line-height: 38px;
          color: white;
          font-weight: 400;
          text-align: center;
          text-transform: none;
          vertical-align: middle;
          background: linear-gradient(180deg, rgb(0 145 145 / 85%) 0%, rgb(0 179 179 / 85%) 70%, rgb(0 176 176 / 85%) 100%);
          font-style: normal;
        }

        .adapter {
          display: inline-block;
          position: relative;
          width: 12px;
          height: 26px;
          margin-left: 1px;
          text-align: center;
          vertical-align: middle;

          .unit {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 12px;
            height: 16px;
            color: #ffffff;
            font-size: 14px;
            vertical-align: bottom;
          }
        }

        .up-down-adapter {
          display: inline-block;
          width: 16px;
          height: 30px;
          margin-left: 2px;
          word-wrap: wrap;
          vertical-align: middle;

          span {
            display: flex;
            height: 8px;
            width: 15px;
            color: rgb(35 152 156);

            &:hover {
              cursor: pointer;
            }
          }

          .icon-up {
            margin-bottom: 8px;
          }
        }
      }

      .slider-block {
        display: flex;
        width: 543px;
        height: 16px;
        margin: 5px auto;
        align-items: center;

        :deep(.el-slider) {
          --el-slider-height: 16px;
          --el-slider-button-size: 25px;
          --el-slider-button-wrapper-size: 25px;
          --el-slider-button-wrapper-offset: -7px;
          --el-slider-stop-bg-color: $progree-icon-color;
          --el-slider-main-bg-color: rgb(0 179 179 / 85%);
          --el-slider-runway-bg-color: rgb(255 255 255 / 75.5%);

          width: 100%;
        }

        :deep(.el-slider__bar) {
          height: 10px;
        }
      }
    }
  }
}
</style>

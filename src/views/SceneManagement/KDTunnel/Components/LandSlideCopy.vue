<!--
 * @Author: Lincong-pro
 * @Date: 2023-07-09 10:55:51
 * @LastEditors: anganao 1928882425@qq.com
 * @LastEditTime: 2024-04-18 00:09:45
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnel\Components\LandSlideCopy.vue
 * @Description: 滑坡
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
<template>
  <div class="container"></div>
</template>

<script>
import { mapState } from 'vuex';
import { LANDSLIDE_SIMULATION_URL, MUDSLIDE_SIMULATION_URL } from '../Utils/landslide/url';
import LandslideSimulation from '../Utils/landslide/LandSlideSimulation.js';
import useKGraphics from '../Utils/landslide/useKGraph';
import { DTScopeEngine } from '@/utils/Common/Viewer';

let graphic = undefined;
let isFirstFlashing = true;

const config = {
  viewer: undefined,
  url: undefined, // 用于切换数据，不必多次复制一个组件
  loop: false,
};
let landslideData = undefined;
let loadingPromises = [];
let toParams = undefined; // 查询参数详情

export default {
  name: 'LandSlide',
  computed: {
    ...mapState('simulation', ['disasterFrame', 'simulationPause', 'progressMax']),
    frame: {
      // frame control
      get() {
        return this.disasterFrame;
      },
      set(val) {
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
  mounted() {
    loadingPromises.push(
      new Promise((resolve) => {
        setTimeout(() => {
          DTScopeEngine.getViewer((viewer) => {
            isFirstFlashing = true;
            graphic = useKGraphics(DTScopeEngine.viewer);

            console.log('chushihua neiceng');
            // loadingPromises.push(graphic.loadingPromise);
            // graphic.loadingPromise.then(() => {
            //   resolve('');
            // });
            resolve('');
          });
        }, 2000);
      })
    );
  },
  watch: {
    // update the true frame
    disasterFrame: function (frame) {
      if (this.simulationPause && landslideData) {
        this.pauseSimulation();
        landslideData.showFrameByS(frame);
      }

      if (frame > 10 && isFirstFlashing) {
        graphic.flashing(true);
        isFirstFlashing = false;
      }

      if (frame == this.progressMax) {
        isFirstFlashing = true;
        graphic.flashing(false);
      }
    },
    // update the status
    pauseStatus: function (status) {
      if (status) {
        this.pauseSimulation();
      } else {
        this.goonSimulation();
      }
    },
    // $route: {
    //   handler(to) {
    //     this.clear();
    //     toParams = to;
    //   },
    //   deep: true,
    // },
  },
  beforeUnmount() {
    this.clear();
  },
  activated() {
    DTScopeEngine.getViewer(() => {
      // isFirstFlashing = true
      graphic = useKGraphics(DTScopeEngine.viewer);
    });
  },
  methods: {
    simulation() {
      DTScopeEngine.getViewer(() => {
        config.viewer = DTScopeEngine.viewer;
        config.loop = false;
        landslideData = new LandslideSimulation(config);
        loadingPromises.push(
          new Promise((resolve) => {
            console.log('youdianren1');
            landslideData.addPrimitivesByS().then(() => {
              console.log('youdianren');
              this.$store.commit('simulation/setProgressMax', landslideData.frameNum - 1);
              // 播放动画
              landslideData.showPrimitiveByS();
              resolve('');
            });
          })
        );
      });
    },
    /**
     * @description: 清理场景数据
     */
    clear() {
      Promise.all(loadingPromises).then(() => {
        this.$store.commit('simulation/setSimulationPause', true);
        this.$store.commit('simulation/setDisasterFrame', 0);
        landslideData?.clearAll();
        landslideData = undefined;
        graphic.loadingPromise.then(() => {
          graphic?.flashing(false);
          graphic?.deactivate();
          graphic?.destroy();
        });
      });
    },
    /**
     * @description: 暂停模拟
     */
    pauseSimulation() {
      if (landslideData) {
        clearInterval(landslideData.intervalID);
        landslideData.pauseSimulation();
        // store.commit("dtglobe_store/setSimulationPause", true)
      }
    },
    /**
     * @description: 继续模拟
     */
    goonSimulation() {
      // 用户暂停 + 切换场景
      if (typeof landslideData === 'undefined' && this.pauseStatus == false) {
        this.updateUrl();
        this.simulation();
        return;
      } else if (typeof landslideData === 'undefined') {
        return;
      }
      landslideData.showPrimitiveByS();
      landslideData.goonSimulation();
      this.$store.commit('simulation/setSimulationPause', false);
    },
    /**
     * @description: 更新需要加载的数据
     */
    updateUrl() {
      let chooseData = undefined; // 更新 url 地址
      if (typeof toParams == 'undefined') {
        chooseData = this.$route.query.item;
      } else {
        chooseData = toParams.query.item;
      }
      switch (chooseData) {
        case 'landslide': {
          config.url = LANDSLIDE_SIMULATION_URL;
          break;
        }
        case 'debrisFlow': {
          config.url = MUDSLIDE_SIMULATION_URL;
          break;
        }
        default: {
          config.url = MUDSLIDE_SIMULATION_URL;
          break;
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  position: absolute;
  top: 20vh;
  left: 5vw;
  z-index: 10;
}
</style>

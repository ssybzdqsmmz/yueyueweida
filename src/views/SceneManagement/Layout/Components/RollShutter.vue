<script setup>
//import { Switch } from 'element-plus';
import { ExploreLayers } from '../utils/ExploreLayers.js';
import * as layer from '../utils/layer';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { ipServer } from '../Service/ServiceProperties';
import sceneConfig from '../Config/RollConfig.json';
import sceneView from '../Config/RollViewPort.json';
import RollShutterSub from './RollShutterSub.vue';
const rollSwitch = ref(false);
const valueTrs = ref([10, 20, 30, 40, 11, 21, 12, 22, 32, 42, 13, 23, 33]);
const layerDate = ref([]);

let explore = undefined;
let leftLayers = [];
let rightLayers = [];

// key的关联设置
// key%10的值一样，说明这几个图层相关联(此时最多只能有10个相关联的图层)
const dataTrs = ref([
  {
    key: 10,
    label: '康定二号隧道入口工区正洞DSM_0415',
    disabled: false,
    date: '2020/04',
  },
  {
    key: 0,
    label: '康定二号隧道入口工区正洞DSM_0116',
    disabled: false,
    date: '2020/01',
  },
  {
    key: 20,
    label: '康定二号隧道入口工区DSM_202306',
    disabled: false,
    date: '2023/06',
  },
  {
    key: 30,
    label: '康定二号隧道入口工区DSM_202404',
    disabled: false,
    date: '2024/04',
  },
  {
    key: 40,
    label: '康定二号隧道入口工区DSM_202407',
    disabled: false,
    date: '2024/07',
  },
  {
    key: 1,
    label: '康定二号隧道出口工区_DSM202103',
    disabled: false,
    date: '2021/03',
  },
  {
    key: 11,
    label: '康定二号隧道出口工区_DSM202104',
    disabled: false,
    date: '2021/04',
  },
  {
    key: 21,
    label: '康定二号隧道出口工区_DSM202105',
    disabled: false,
    date: '2021/05',
  },
  {
    key: 2,
    label: '色季拉山DSM202205',
    disabled: false,
    date: '2022/05',
  },
  {
    key: 52,
    label: '色季拉山DSM202306',
    disabled: false,
    date: '2023/06',
  },
  {
    key: 22,
    label: '色季拉山DSM202307',
    disabled: false,
    date: '2023/07',
  },
  {
    key: 32,
    label: '色季拉山DSM202404',
    disabled: false,
    date: '2024/04',
  },
  {
    key: 42,
    label: '色季拉山DSM202407',
    disabled: false,
    date: '2024/07',
  },
  {
    key: 3,
    label: '大渡河特大桥DSM202205',
    disabled: false,
    date: '2022/05',
  },
  {
    key: 13,
    label: '大渡河特大桥DSM202207',
    disabled: false,
    date: '2022/07',
  },
  {
    key: 23,
    label: '大渡河特大桥DSM',
    disabled: false,
    date: '2019/10',
  },
  {
    key: 33,
    label: '大渡河特大桥DSM202404',
    disabled: false,
    date: '2024/04',
  },
]);

let models = layer.generateDTGlobeConfig(ipServer, sceneConfig);
// 添加模型图层
DTScopeEngine.getViewer(() => {
  let loadingPromise = layer.loadFromDTGlobeConfig(DTScopeEngine.viewer, models.dtglobeCzml);
});

// 控制图层
function layerControl(layerNames) {
  DTScopeEngine.getViewer(() => {
    DTScopeEngine.viewer.DTScene.layers.forEach((layers) => {
      layers._array.forEach((layer) => {
        DTScopeEngine.viewer.DTScene.setLayerVisiability(layer, layerNames.indexOf(layer._label) !== -1);
      });
    });
  });
}
// 控制视角
function cameraControl(destination, orientation) {
  DTScopeEngine.getViewer(() => {
    let viewer = DTScopeEngine.viewer;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(...destination),
      orientation: orientation,
    });
  });
}
//通过id获取图层名称
function getlayer(id) {
  for (let i = 0; i < dataTrs.value.length; i++) {
    if (dataTrs.value[i].key == id) {
      return dataTrs.value[i];
    }
  }
}

// 选中一个时，与他对应得数据可选择，其余不可选择
function layersLock(ev) {
  if (leftLayers.length === 0 && rightLayers.length === 0) {
    for (let i = 0; i < dataTrs.value.length; i++) {
      dataTrs.value[i].disabled = false;
    }
    return;
  }
  if (ev.length === 0) {
    return;
  }
  const key = ev[0] % 10;
  for (let i = 0; i < dataTrs.value.length; i++) {
    dataTrs.value[i].disabled = dataTrs.value[i].key % 10 !== key;
  }
}
function selectLeft(ev) {
  leftLayers = ev;
  layersLock(ev);
}
function selectRight(ev) {
  rightLayers = ev;
  layersLock(ev);
}
function change() {
  leftLayers = [];
  rightLayers = [];
  for (let i = 0; i < dataTrs.value.length; i++) {
    dataTrs.value[i].disabled = false;
  }
}
// 卷帘分析开关, 实际上只会加载leftlayer[0]和rightlayer[0]两个图层
function rollButton() {
  if (!rollSwitch.value) {
    explore.recover();
    // 开启图层
    for (let i = 0; i < dataTrs.value.length; i++) {
      if (leftLayers.indexOf(dataTrs.value[i].key) !== -1 || rightLayers.indexOf(dataTrs.value[i].key) !== -1) {
        dataTrs.value[i].disabled = false;
      }
    }
    // 清除时间
    layerDate.value = [];
    return;
  }
  if (leftLayers.length === 0 || rightLayers.length === 0) {
    rollSwitch.value = false;
    alert('请选择图层');
    return;
  }
  // 卷帘开启时锁住所有图层
  for (let i = 0; i < dataTrs.value.length; i++) {
    dataTrs.value[i].disabled = true;
  }
  const id = leftLayers[0] % 10;
  const left = getlayer(leftLayers[0]);
  const right = getlayer(rightLayers[0]);
  // 加载图层和视角
  layerControl([left.label, right.label]);
  cameraControl(sceneView[id].destination, sceneView[id].orientation);
  // 更改时间
  layerDate.value = [left.date, right.date];
  explore.initDSM(right.label, left.label);
  explore.compare();
}

onMounted(() => {
  DTScopeEngine.getViewer(() => {
    explore = new ExploreLayers({ viewer: DTScopeEngine.viewer });
  });
});

onBeforeUnmount(() => {
  DTScopeEngine.getViewer(() => {
    explore.recover();
    removeFromDTGlobeConfig(DTScopeEngine.viewer, models.layerUids);
  });
});
</script>

<template>
  <RollShutterSub :layerDate="layerDate" v-if="layerDate.length"></RollShutterSub>
  <div class="rollshutter-outer">
    <div class="rollshutter-title">图层选择</div>
    <div class="rollshutter-content">
      <el-switch v-model="rollSwitch" @change="rollButton"></el-switch>
      <el-transfer
        v-model="valueTrs"
        :data="dataTrs"
        :titles="['左侧图层', '右侧图层']"
        @left-check-change="selectLeft"
        @right-check-change="selectRight"
        @change="change"
      ></el-transfer>
    </div>
  </div>
</template>

<style lang="scss">
.rollshutter-outer {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 1;
  padding: 10px;
  background-color: rgb(13 73 80 / 60%);

  .rollshutter-title {
    width: inherit;
    font-family: DIN;
    font-size: 20px;
    font-weight: 500;
    text-align: center;
  }

  .rollshutter-content {
    .el-switch.is-checked {
      .el-switch__core {
        border-color: rgb(59 189 178);
        background-color: rgb(22 83 90);
      }
    }

    .el-button {
      border: none;
      background-color: rgb(32 100 108);
    }

    .el-transfer-panel {
      width: 400px;
      background-color: rgb(59 189 178);

      .el-transfer-panel__body {
        border-color: rgb(59 189 178);
        color: white;
        background-color: rgb(18 74 82);

        span {
          color: white;
        }

        .el-checkbox__input.is-disabled {
          .el-checkbox__inner {
            background-color: rgb(158 158 158 / 80%);
          }
        }

        .el-checkbox.is-disabled span {
          color: rgb(158 158 158 / 80%);
        }

        .el-checkbox__input.is-checked .el-checkbox__inner {
          border-color: rgb(59 189 178);
          background-color: rgb(18 78 85);
        }
      }

      .el-transfer-panel__header {
        border-color: rgb(59 189 178);
        color: white;
        background-color: rgb(38 114 122);

        span {
          color: white;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner {
          border: none;
          background-color: rgb(18 78 85);
        }

        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          border: none;
          background-color: rgb(18 78 85);
        }
      }
    }
  }
}
</style>

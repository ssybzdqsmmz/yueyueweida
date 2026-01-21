<!--
 * @Author: Lincong-pro
 * @Date: 2024-02-26 13:26:21
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-07-03 15:36:17
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\LayerPanel.vue
 * @Description: 
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<template>
  <div class="bg">
    <el-scrollbar class="bg-content">
      <div class="item" v-for="item in Items" :key="item.title">
        <div class="item-title" @click="onEvent(item)">{{ item.title }}</div>

        <div class="item-content" v-for="child in item.children" :key="child.name">
          <div class="item-content-box">
            <svg-icon iconClass="home-dw" className="item-content-box-dw" :class="child.name == isActive ? 'iconActive' : 'iconNo'"> </svg-icon>
            <svg-icon
              :iconClass="'home-left-' + child.icon"
              className="item-content-box-in"
              :class="child.name == isActive ? 'iconActive' : 'iconNo'"
            ></svg-icon>
          </div>

          <span @click="onEvent(child)" class="item-content-text" :class="child.name == isActive ? 'active' : ''">{{ child.name }}</span>
        </div>
      </div>
    </el-scrollbar>
    <div @click="controlPanel" class="bar"></div>
  </div>
</template>

<script lang="ts" setup>
import Items from './Config/LayerManager.json';
import { useRouter } from 'vue-router';
import WEventBus from './Tools/WEventBus';
import { ref, onMounted } from 'vue';
import { initSceneConfig } from './Tools/InitScene';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { generateKmlConfig, loadFromKmlConfig } from '@/views/SceneManagement/Layout/Tools/Layer';
import { loadMap } from '@/utils/Maps/MapSource';
import { adjustLayerAndView } from '@/views/SceneManagement/Layout/Tools/InitScene';
import { ipServer } from '@/views/SceneManagement/Layout/Service/ServiceProperties';
import KmlLayerConfig from '@/views/SceneManagement/Layout/Config/kmlLayer.json';
import { scaleChange, updateScale } from '@/views/SceneManagement/Layout/Tools/PostRender';
import LODLabel from '@/views/SceneManagement/Layout/Config/LODLabel.json';
import { loadCenterLine } from '@/views/SceneManagement/GeologyModel/Services/InitScene';
initSceneConfig(Items);
const router = useRouter();

let eventBus = new WEventBus();

const controlPanel = (function () {
  let hidden = false;
  return () => {
    //
    hidden = !hidden;
    if (hidden) {
      document.getElementsByClassName('bg')[0].classList.remove('bg-visible');
      document.getElementsByClassName('bg')[0].classList.add('bg-hidden');
    } else {
      document.getElementsByClassName('bg')[0].classList.remove('bg-hidden');
      document.getElementsByClassName('bg')[0].classList.add('bg-visible');
    }
  };
})();

const adjustLabel = (function () {
  let stationDataSource;
  let viewer;

  return {
    callback: (lod: string) => {
      if (!stationDataSource) {
        viewer = DTScopeEngine.viewer;
        stationDataSource = viewer.dataSources.getByName('地名路段')[0];
        if (!stationDataSource) {
          return; // 图层未初始化完毕
        }
      }
      for (let i = 0; i < stationDataSource.entities.values.length; i++) {
        let group = stationDataSource.entities.values[i];
        if (typeof group.label != 'undefined') {
          let text = group.label.text._value;
          let labels = LODLabel[lod];

          if (labels.includes(text)) {
            group.label.show = true;
          } else {
            group.label.show = false;
          }
        }
      }
      if (!stationDataSource.show) {
        stationDataSource.show = true;
      }
    },
    clearTrash: () => {
      viewer.dataSources.remove(stationDataSource, true);
      stationDataSource = undefined;
    },
  };
})();
let centerLineUrl = 'FullLine/Line/json/CZ0327_1.json'; // 全线黄色线路json文件

function initScene() {
  let viewer = DTScopeEngine.viewer;
  viewer.scene.globe.depthTestAgainstTerrain = false;
  let kmlConfig = generateKmlConfig(ipServer, KmlLayerConfig);
  loadMap(viewer);

  eventBus.once('clearTrash', loadFromKmlConfig(viewer, kmlConfig)); // 清理垃圾
  eventBus.once('clearTrash', adjustLayerAndView(viewer)); // 注册垃圾回调函数
  eventBus.once('clearTrash', loadCenterLine(viewer, ipServer, centerLineUrl)); // 清理黄色路线
  eventBus.once('clearTrash', adjustLabel.clearTrash);

  let scaleChangeBind = scaleChange.bind(null, viewer);
  let updateScaleBind = updateScale.callback.bind(null, viewer);
  eventBus.once('clearTrash', updateScale.clearTrash); // 清除比例尺

  viewer.scene.postRender.addEventListener(scaleChangeBind);
  viewer.scene.postRender.addEventListener(updateScaleBind);
  eventBus.on('updateLabel', adjustLabel.callback);

  eventBus.once('clearTrash', () => {
    eventBus.off('updateLabel', adjustLabel.callback);
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.postRender.removeEventListener(scaleChangeBind); // 取消比例尺监听事件
    viewer.scene.postRender.removeEventListener(updateScaleBind);
  });
}

onMounted(() => {
  setTimeout(() => {
    document.getElementsByClassName('bg')[0].classList.add('bg-visible');
  }, 1000);
});

/**
 * @description: 触发对应的回调实现路由+filter的功能
 * @param {any} item
 * @return {void}
 */

const onEvent = (item: any) => {
  // console.log('当前触发事件，', 'item.name:' + item.name + 'item.topic:' + item.topic);
  isActive.value = item.name;
  eventBus.emit(item.topic);
};
const isActive = ref('');

eventBus.on('kd_in', () => {
  router.push({ path: '/home/3DScene/kdtunnel', query: { item: 'default' } }); // 康定二号基础地理场景
});
eventBus.on('kd_in_base', () => {
  router.push({ path: '/home/3DScene/kdtunnel', query: { item: 'base' } });
});
eventBus.on('kd_in_debrisFlow', () => {
  router.push({ path: '/home/3DScene/kdtunnel', query: { item: 'debrisFlow' } });
});
eventBus.on('kd_in_sensor', () => {
  router.push({ path: '/home/3DScene/kdtunnel', query: { item: 'sensor' } });
});
eventBus.on('kd_in_roam', () => {
  router.push({ path: '/home/3DScene/kdtunnel', query: { item: 'roam' } });
});
eventBus.on('kd_in_badGeology', () => {
  router.push({ path: '/home/3DScene/kdtunnel', query: { item: 'badGeology' } });
});

// 康定二号隧道出口
eventBus.on('kd_out_base', () => {
  router.push({ path: '/home/3DScene/kdtunnelout', query: { item: 'base' } }).catch((error) => {
    console.error(error); // 捕获并处理导航错误
  });
});
eventBus.on('kd_out_fieldRoam', () => {
  router.push({ path: '/home/3DScene/kdtunnelout', query: { item: 'fieldRoam' } }).catch((error) => {
    console.error(error); // 捕获并处理导航错误
  });
});
eventBus.on('kd_out_tunnelRoam', () => {
  router.push({ path: '/home/3DScene/kdtunnelout', query: { item: 'tunnelRoam' } }).catch((error) => {
    console.error(error); // 捕获并处理导航错误
  });
});
eventBus.on('kd_out_tunnelDigit', () => {
  router.push({ path: '/home/3DScene/kdtunnelout', query: { item: 'tunnelDigit' } }).catch((error) => {
    console.error(error); // 捕获并处理导航错误
  });
});
// 地质环境场景
eventBus.on('geology', () => {
  router.push('/home/3DScene/geologymodel');
});
// 区域地质模型
eventBus.on('geology_region', () => {
  const params = { item: 'region' };
  router.push({ path: '/home/3DScene/geologymodel', query: params });
});
eventBus.on('geology_engineer', () => {
  router.push('/home/3DScene/gqgeomodel');
});
eventBus.on('geology_construction', () => {
  router.push('/home/3DScene/csfgeomodel');
});

// 全线地质灾害
eventBus.on('disaster', () => {
  router.push('/home/3DScene/fullLine');
});

eventBus.on('disaster_region', () => {
  const params = { item: 'region' };
  router.push({ path: '/home/3DScene/fullLine', query: params });
});

eventBus.on('disaster_tunnel', () => {
  const params = { item: 'tunnel' };
  router.push({ path: '/home/3DScene/tunnel', query: params });
});

eventBus.on('disaster_aline', () => {
  const params = { item: 'aline' };
  router.push('/home/3DScene');
  initScene();
});

// // 拉月隧道
// eventBus.on('layue-tunnel_ht-hi', () => {
//   router.push('/home/3DScene/layue');
// });

// eventBus.on('disaster_surface', () => {
// 	const params = { item: 'surface' };
// 	router.push({ path: '/home/3DScene/fullLine', query: params });
// });
</script>

<style lang="scss" scoped>
.bg {
  position: absolute;
  top: calc(50% + 25px);
  left: 5px;
  z-index: 10;
  width: 220px;
  height: 800px;
  background: url('./Assets/layerManager.png') no-repeat;
  background-size: 100% 100%;
  transform: translate(-220px, -50%);
  transition: all 1s ease-in-out;

  .bg-content {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 2px 3px;
  }

  .item {
    margin: 18px 0 0 22px;

    &-title {
      margin-bottom: 11px;
      color: #f3fffe;
      font-family: TRENDS;
      font-size: 16px;
    }

    &-content {
      display: flex;
      height: 25px;
      margin-bottom: 12px;
      line-height: 35px;

      :hover {
        cursor: pointer;
      }

      &-box {
        display: inline-block;
        position: relative;
        width: 32.25px;
        height: 30.32px;
        margin-right: 11px;

        &-dw {
          width: 32.25px;
          height: 30.32px;
        }

        &-in {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10px;
          height: 12px;
          margin-top: -6px;
          margin-left: -8px;
        }
      }

      &-text {
        font-size: 14px;
        color: #b8d1d3;
      }
    }
  }

  .iconActive {
    color: #19ffec;
  }

  .iconNo {
    color: #8ebaba;
  }

  .bar {
    display: block;
    position: absolute;
    top: 50%;
    right: -10px;
    z-index: 1;
    width: 7px;
    height: 200px;
    border-radius: 5px;
    background: rgba($color: #7e7c7c, $alpha: 60%);
    transform: translateY(-50%);

    &:hover {
      background: rgba($color: #ffffff, $alpha: 60%);
      cursor: pointer;
    }
  }
}

.bg-visible {
  transform: translate(0, -50%);
}

.bg-hidden {
  transform: translate(-220px, -50%);
}
</style>

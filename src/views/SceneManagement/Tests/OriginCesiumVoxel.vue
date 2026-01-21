<!--
 * @Author: 枫林残忆 2997534654@qq.com
 * @Date: 2024-03-31 09:00:04
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-17 14:25:20
 * @FilePath: \Geology-V3\src\views\SceneManagement\Tests\OriginCesiumVoxel.vue
 * @Description: 测试-将间接体渲染+直接提渲染合并到cesium中
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * 
-->
<template>
  <canvas id="palette"></canvas>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import VoxelPrimitiveFactory from './Utils/VoxelPrimitiveFactory';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import Cesium from 'Cesium';
import { loadCWT } from './Utils/Layer';

import dataConfig from './Config/data.json';

function printWebglContextInfo(gl: any) {
  console.log('Webgl version is: ' + gl.getParameter(gl.VERSION));
}

onMounted(async () => {
  DTScopeEngine.getViewer(async () => {
    let viewer = DTScopeEngine.viewer as Cesium.Viewer;
    printWebglContextInfo(viewer.canvas.getContext('webgl'));

    VoxelPrimitiveFactory.init('palette', true);
    // let voxel = await VoxelPrimitiveFactory.add(
    //   'http://192.168.3.47:9995/CZSCZQ-2/GEOLOGY/volumeSlice/KDGMVoxel/PDK280+267.60.jpg',
    //   'http://192.168.3.47:9995/CZSCZQ-2/GEOLOGY/volumeSlice/KDGMVoxel/PDK280+267.60_copy.json'
    // );
    // viewer.scene.primitives.add(voxel);
    setTimeout(() => {
      viewer.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(101.89161859750723, 29.98214792568178, 5107.936080431159),
        orientation: {
          heading: 5.445859035665518,
          pitch: -0.56947581080325,
          roll: 6.283135604505708,
        },
        easingFunction: Cesium.EasingFunction.LINEAR_NONE,
        duration: 3,
        complete: async () => {
          // let voxels = [];
          // await dataConfig.forEach(async (item: { config: string; img: string }) => {
          //   let itemConfig = 'http://192.168.3.47:9995' + item.config;
          //   let itemImg = 'http://192.168.3.47:9995' + item.img;
          //   let voxel = await VoxelPrimitiveFactory.add(itemImg, itemConfig);
          //   voxels.push(voxel);
          //   console.warn(voxels);
          // });
          // viewer.scene.primitives.add(voxels[0]);
          // console.warn(viewer.scene.primitives);
          for (let i = 0; i < dataConfig.length; i++) {
            let itemConfig = 'http://192.168.3.47:9995' + dataConfig[i].config;
            let itemImg = 'http://192.168.3.47:9995' + dataConfig[i].img;
            let voxel = await VoxelPrimitiveFactory.add(itemImg, itemConfig);
            viewer.scene.primitives.add(voxel);
          }

          // let voxel2 = await VoxelPrimitiveFactory.add(
          //   'http://192.168.3.47:9995/CZSCZQ-2/GEOLOGY/volumeSlice/KDGMVoxel/PDK280+346.00.jpg',
          //   'http://192.168.3.47:9995/CZSCZQ-2/GEOLOGY/volumeSlice/KDGMVoxel/PDK280+346.00_copy.json'
          // );
          // viewer.scene.primitives.add(voxel2);

          // voxels.forEach((voxel) => {
          //   viewer.scene.primitives.add(voxel);
          // });
        },
      });
    }, 3000);
    loadCWT(viewer);
  });
});
</script>

<style lang="scss" scoped>
#palette {
  position: absolute;
  right: 0;
  top: 140px;
  z-index: 10;
}
</style>

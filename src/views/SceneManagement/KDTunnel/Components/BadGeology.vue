<template>
  <div class="legend">
    <!-- <div class="single-legend">
      <div class="color color-bg"></div>
      <p class="text">不良地质</p>
    </div>
    <div class="single-legend">
      <div class="color color-sc"></div>
      <p class="text">折多塘浅层溜坍</p>
    </div>
    <div class="single-legend">
      <div class="color color-t"></div>
      <p class="text">折多塘岩堆</p>
    </div>
    <div class="single-legend">
      <div class="color color-h"></div>
      <p class="text">折多塘浅层溜坍房屋</p>
    </div> -->
  </div>
</template>

<script setup>
import Cesium from 'Cesium';
import { onMounted, onBeforeUnmount } from 'vue';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { badGeologyUrl, shallowCollapseUrl, houseUrl, talusUrl, labels } from '../Config/url';
import { ipServer } from '../Services/ServiceProperties';

let kmlsources = [];
let label = [];
let buildingctner = undefined;
let promisese = [];

function changeColor(entities, color) {
  for (let i = 0; i < entities.length; i++) {
    if (entities[i].polyline && entities[i].polyline.material) {
      entities[i].polyline.material = color;
    }
    if (entities[i].polygon && entities[i].polygon.material) {
      entities[i].polygon.material = color;
    }
    if (entities[i].point && entities[i].point.material) {
      entities[i].point.material = color;
    }
  }
}

function addLabel(url) {
  return new Promise((resolve) => {
    const viewer = DTScopeEngine.viewer;
    Cesium.Resource.fetch(url).then((entities) => {
      entities = JSON.parse(entities);
      console.log(entities);
      for (let i = 0; i < entities.length; i++) {
        const lb = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(...entities[i].coord),
          label: {
            text: entities[i].name,
            font: '500 30px',
            scale: 1.2,
            fillColor: Cesium.Color.WHITE,
            showBackground: true,
            style: Cesium.LabelStyle.FILL,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
          },
        });
        label.push(lb);
      }
      resolve('');
    });
  });
}

function loadKmz(url, color) {
  return new Promise((resolve) => {
    DTScopeEngine.getViewer(() => {
      const viewer = DTScopeEngine.viewer;
      Cesium.KmlDataSource.load(url, {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true,
      }).then((dataSource) => {
        let kmldata = viewer.dataSources.add(dataSource);
        changeColor(dataSource.entities.values, color);
        kmlsources.push(dataSource);
        resolve('');
      });
    });
  });
}

onMounted(() => {
  DTScopeEngine.getViewer(() => {
    promisese.push(loadKmz(badGeologyUrl, Cesium.Color.fromCssColorString('#e24d39').withAlpha(0.5)));
    promisese.push(loadKmz(shallowCollapseUrl, Cesium.Color.fromCssColorString('#dfb03b').withAlpha(0.5)));
    promisese.push(loadKmz(houseUrl, Cesium.Color.fromCssColorString('#3c98ee').withAlpha(0.7)));
    promisese.push(loadKmz(talusUrl, Cesium.Color.fromCssColorString('#a75a1f').withAlpha(0.5)));
    promisese.push(addLabel(labels));
  });
});

onBeforeUnmount(() => {
  Promise.all(promisese).then(() => {
    const viewer = DTScopeEngine.viewer;
    for (let i = 0; i < kmlsources.length; i++) {
      viewer.dataSources.remove(kmlsources[i], true);
    }
    label.forEach((lb) => {
      viewer.entities.remove(lb);
    });
  });
});
</script>

<style scoped lang="scss">
.legend {
  display: flex;
  position: absolute;
  right: 20px;
  bottom: 80px;
  z-index: 10;
  padding-right: 10px;
  padding-left: 10px;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  background-color: rgb(255 255 255 / 20%);

  .single-legend {
    display: flex;
    margin-top: 10px;
    flex-direction: row;
    align-items: center;

    .color {
      width: 40px;
      height: 18px;
      margin-right: 10px;
    }

    .text {
      color: rgb(0 0 0);
      font-weight: 300;
      font-size: 16px;
    }

    .color-bg {
      background-color: #e24d39cc;
    }

    .color-sc {
      background-color: #dfb03bcc;
    }

    .color-t {
      background-color: #a75a1fcc;
    }

    .color-h {
      background-color: #3c98eecc;
    }
  }
}
</style>

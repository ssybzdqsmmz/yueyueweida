<template>
  <div>123</div>
</template>

<script>
import * as Cesium from 'Cesium';
import { DTScopeEngine } from '@/utils/Common/Viewer';

function addPoints(data) {
  DTScopeEngine.getviewer(() => {
    let viewer = DTScopeEngine.viewer;
  });
}

function offsetByDistance() {
  Sandcastle.declare(offsetByDistance);
  const image = new Image();
  image.onload = function () {
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(94.43587002900006, 29.528199493000045),
      billboard: {
        position: Cesium.Cartesian3.fromDegrees(94.43587002900006, 29.528199493000045),
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 5.0, 1.5e7, 0.5),
        image: image,
      },
      label: {
        text: 'Label on top of scaling billboard',
        font: '20px sans-serif',
        showBackground: true,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        pixelOffset: new Cesium.Cartesian2(0.0, -image.height),
        pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5),
      },
    });
  };
  image.src = '../images/1.jpg';
}

function disasterControl(label) {
  if (label === '钻爆法') {
    addPoints(DBM);
    return;
  }
  if (label === 'TBM') {
    addPoints(TBM);
    return;
  }
  if (label === '全线') {
    addPoints(FullLine);
    return;
  }
}
</script>

/*
 * @Author: 枫林残忆
 * @Date: 2024-03-01 10:36:53
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-17 16:12:18
 * @FilePath: \Geology-V3\src\views\SceneManagement\Batang\Services\KmlLoader.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { Viewer, KmlDataSource, Cartesian3, Math } from 'Cesium';
import { rate } from './ServiceProperties';
import { globeWidgetEvents } from '../../Layout/Components/events';
import WEventBus from '../../Layout/Tools/WEventBus';

let eventBus = new WEventBus();
/**
 * @description: 动画控制函数
 * @param {*} viewer
 * @param {*} items
 * @param {number[]} cameraView
 * @param {Cartesian3} lookAt
 * @param {number} min 左侧最小角度
 * @param {number} max 右侧最大角度
 * @param {number} duration 碰到边界的次数
 * @return {Promise}
 */
const aniamtionFunc = (viewer: Viewer, items, cameraView, lookAt, min, max, duration) => {
  let index = 0; // 控制帧动画
  let replayTimes = 0;
  let preLayer: KmlDataSource;
  let headingPitchRange: number[] = [
    // Math.toDegrees(2.9598691509007464),
    // Math.toDegrees(-0.9335952255542326),
    Math.toDegrees(cameraView[0]),
    Math.toDegrees(cameraView[1]),
    500,
  ];
  let timerId;
  let promise = new Promise((resolve) => {
    timerId = setInterval(() => {
      if (typeof preLayer != 'undefined') {
        //@ts-ignore
        preLayer.show = false;
      }

      eventBus.emit(globeWidgetEvents.animateLabel, {
        status: true,
        text: items[index].label,
      });
      // eventBus.emit("changeLoadingAnimate", false) // 关闭过渡动画
      let kmlDataSource = viewer.dataSources.getByName(items[index].label)[0];
      kmlDataSource.show = true; //@ts-ignore
      preLayer = kmlDataSource;

      ++index;
      if (index == items.length) {
        replayTimes++;
        if (replayTimes == duration * 1) {
          clearInterval(timerId);
          eventBus.emit(globeWidgetEvents.animateLabel, {
            status: false,
            text: '',
          });
          resolve('时序动画播放完毕');
        }
        index = 0;
      }
    }, 1200 * rate);
  });

  return {
    pauseAnimation: () => {
      // 移除item
      for (let i = 0; i < items.length; i++) {
        let label = items[i].label;
        let kmlDataSource = viewer.dataSources.getByName(label)[0];
        viewer.dataSources.remove(kmlDataSource, true);
      }
      // 清除动画
      clearInterval(timerId);
      eventBus.emit(globeWidgetEvents.animateLabel, {
        status: false,
        text: '',
      });
    },
    readyPromise: promise,
  };
};

/**
 * @description: 时间序列动画循环
 * @param {*} items
 * @return {*}
 */
function timeSeries(items) {
  let viewer: Viewer = DTScopeEngine.viewer;

  const promises = [];
  let dataSources = [];

  for (let i = 0; i < items.length; ++i) {
    const promise = new Promise((resolve) => {
      // requestIdleCallback(() => {
      let item = items[i];

      KmlDataSource.load(item.kml, {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true,
      }).then((dataSource) => {
        dataSource.name = item.label;
        dataSource.show = false;
        dataSources.push(dataSource);

        viewer.dataSources.add(dataSource);
        dataSource.entities.values.forEach((entity) => {
          if (typeof entity.rectangle != 'undefined') {
            //@ts-ignore
            entity.rectangle.material.transparent = true; //@ts-ignore
          }
        });

        if (i == items.length - 1) {
          setTimeout(() => {
            resolve('最后一个加载成功');
          }, 2000);
        } else {
          resolve('test');
        }
      });
    });
    promises.push(promise);
  }
  return Promise.all(promises).then(() => {
    return dataSources;
  });
}

/**
 * @description: 巴塘时序数据加载
 * @param {*} data
 * @return {*}
 */
async function batangTimeSeries(data) {
  let viewer = DTScopeEngine.viewer;
  let dataSources = await timeSeries(data);

  let destroyDataSource = () => {
    dataSources.forEach((dataSource) => {
      viewer.dataSources.remove(dataSource, true);
    });
  };

  let viewPoint = {
    Orientation: {
      heading: 1.106219723023644,
      pitch: -0.6227643230398643,
      roll: 0.0032174395183144355,
    },
    Position: {
      longitude: 99.3841736,
      latitude: 30.2912141,
      height: 5966.5398656,
    },
  };

  let { readyPromise, pauseAnimation } = aniamtionFunc(
    viewer,
    data,
    [viewPoint.Orientation.heading, viewPoint.Orientation.pitch],
    Cartesian3.fromDegrees(viewPoint.Position.longitude, viewPoint.Position.latitude, viewPoint.Position.height),
    45,
    77,
    1
  );
  return {
    readyPromise,
    pauseAnimation,
    destroyDataSource,
  };
}

export { batangTimeSeries };

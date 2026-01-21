/*
 * @Author: Lincong-pro
 * @Date: 2024-02-25 18:16:43
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2024-02-26 08:27:51
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnel\Services\Site.ts
 * @Description: 对当个点的模型进行切换
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import { Viewer, Matrix4, EasingFunction, Cartesian3, Transforms, Model, DirectionalLight } from 'Cesium';
import { Positions, Rulers1000m, Rulers100m, Rulers10m } from './TunnelInfo';
import TScaler from './TunnelScaler';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { TFSModel, TSPModel, TSPModelConfig } from './ServiceProperties';
import VoxelRender from '../Shader/VoxelRender';

/**
 * @description: 看向固定的点
 * @param {Viewer} viewer
 * @param {*} status
 * @return {void}
 */
function lookAtFixed(viewer: Viewer, status) {
  viewer.scene.camera.lookAtTransform(Matrix4.IDENTITY);
  if (status) {
    viewer.scene.camera.flyTo({
      easingFunction: EasingFunction.QUINTIC_OUT,
      destination: Cartesian3.fromElements(-1138123.2102885062, 5413122.241687714, 3171382.583795801),
      orientation: {
        heading: 5.497791654142265,
        pitch: -0.6154907919216184,
        roll: 0.0,
      },
      duration: 1,
      complete: () => {
        viewer.camera.lookAt(Cartesian3.fromDegrees(101.873124, 29.9938189, 3241.74), new Cartesian3(50, -50, 50));
      },
    });
  } else {
    viewer.scene.camera.lookAtTransform(Matrix4.IDENTITY);
  }
}

const modelMapping = new Map<string, any>([
  [
    'TEG',
    (viewer) => {
      //@ts-ignore
      const LocalFrameToFixedFrame = Transforms.localFrameToFixedFrameGenerator('up', 'east');
      const modelMatrixA = LocalFrameToFixedFrame(Cartesian3.fromDegrees(101.78831283519401, 30.04137419729661, 3632.5594175092197));
      return viewer.scene.primitives.add(
        Model.fromGltf({
          modelMatrix: modelMatrixA,
          url: 'http://10.20.96.254:10086/CZSCZQ-2/GeologyProject/DemoTextureDiff.glb', //!需要替换
        })
      );
    },
  ],
  [
    'TSP',
    async (viewer: Viewer, colours: any, type: string) => {
      viewer.scene.camera.lookAtTransform(Matrix4.IDENTITY);
      if (type === 'vp') {
        let primitive = new VoxelRender(TSPModel);
        await primitive.generateWebGLConfig(colours, TSPModelConfig);
        lookAtFixed(viewer, true);
        viewer.scene.primitives.add(primitive);
        return;
        // initVolume('data/TSP/Vp.raw.json');
      }
      if (type === 'vs') {
        // initVolume('data/TSP/Vs.raw.json');
      }
      if (type === 'pr') {
        // initVolume('data/TSP/Pr.raw.json');
      }
      if (type === 'rt') {
        // initVolume('data/TSP/Rt.raw.json');
      }
    },
  ],
  [
    'TEM',
    (viewer: Viewer, type: string) => {
      viewer.scene.camera.lookAtTransform(Matrix4.IDENTITY);

      if (type === 'tem') {
        // initVolume('data/TEM/TEM.raw.json');
      }
      if (type === 'temrt') {
        // initVolume('data/TEM/TEMRt.raw.json');
      }

      // if (Vue.prototype.DTGlobe.showVolume) {
      //   viewer.scene.camera.flyTo({
      //     easingFunction: Cesium.EasingFunction.QUINTIC_OUT,
      //     destination: {
      //       x: -1138216.6617071424,
      //       y: 5413159.92750569,
      //       z: 3171343.5485766563,
      //     },
      //     orientation: {
      //       heading: 5.639690960179587,
      //       pitch: -0.5404391077808919,
      //       roll: 0.0,
      //     },
      //     duration: 1,
      //     complete: () => {
      //       viewer.camera.lookAt(new Cesium.Cartesian3.fromDegrees(101.873732, 29.993712, 3245.82), new Cesium.Cartesian3(75, -100, 75));
      //     },
      //   });
      // } else {
      //   // viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      // }
      viewer.scene.camera.flyTo({
        easingFunction: EasingFunction.QUINTIC_OUT,
        destination: Cartesian3.fromElements(-1138123.2102885062, 5413122.241687714, 3171382.583795801),
        orientation: {
          heading: 5.639690960179587,
          pitch: -0.5404391077808919,
          roll: 0.0,
        },
        duration: 1,
        complete: () => {
          viewer.camera.lookAt(Cartesian3.fromDegrees(101.873732, 29.993712, 3245.82), new Cartesian3(75, -100, 75));
        },
      });

      const lbs = new Array();
      // lbs.push(dtmmap['tscaler'].addLabelByMileage(280392, 35, 'temlb_1'));

      // // dtmmap["tscaler"].mileageBBox(280366, new Cesium.Cartesian3(55, 125, 25), "temlb_1", Cesium.Color.YELLOW);
      // dtmmap['tscaler'].mileageLBnd(280366, new Cesium.Cartesian3(55, 125, 25), 'temlb_1', Cesium.Color.YELLOW);

      // dtmmap['temlb'] = lbs;

      // dtmmap['temlb'].forEach((element) => {
      //   element.show = !element.show;
      // });
    },
  ],
  [
    'GPR', // itemgpr 、gprlb
    (viewer: Viewer, type: string) => {
      //@ts-ignore
      const LocalFrameToFixedFrame = Transforms.localFrameToFixedFrameGenerator('up', 'east');
      const modelMatrix = LocalFrameToFixedFrame(Cartesian3.fromDegrees(101.78831283519401, 30.04025419729661, 3632.5594175092197));
      viewer.scene.primitives.add(
        Model.fromGltf({
          modelMatrix: modelMatrix,
          url: 'data/GPR/model_' + type + '.glb',
        })
      );

      // if (dtmmap['gprlb'] === undefined) {
      //   const lbs = new Array();
      //   lbs.push(dtmmap['tscaler'].addLabelByMileage(280416, 15, 'gprlb_1'));

      //   // dtmmap["tscaler"].mileageBBox(280366, new Cesium.Cartesian3(55, 125, 25), "temlb_1", Cesium.Color.YELLOW);
      //   dtmmap['tscaler'].mileageLBnd(280408, new Cesium.Cartesian3(20, 125, 15), 'gprlb_1', Cesium.Color.YELLOW);

      //   dtmmap['gprlb'] = lbs;
      // } else {
      //   dtmmap['gprlb'].forEach((element) => {
      //     element.show = !element.show;
      //   });
      // }
    },
  ],
  [
    'AHD',
    (viewer: Viewer) => {
      //@ts-ignore
      const LocalFrameToFixedFrame = Transforms.localFrameToFixedFrameGenerator('up', 'east');
      const modelMatrix = LocalFrameToFixedFrame(Cartesian3.fromDegrees(101.78831283519401, 30.04025419729661, 3632.5594175092197));
      viewer.scene.primitives.add(
        Model.fromGltf({
          modelMatrix: modelMatrix,
          url: 'data/AHD/model.glb',
        })
      );
      lookAtFixed(viewer, true);

      // if (dtmmap['ahdlb'] === undefined) {
      //   const lbs = new Array();
      //   lbs.push(dtmmap['tscaler'].addLabelByMileage(280413, 15, 'ahdlb_1'));

      //   // dtmmap["tscaler"].mileageBBox(280366, new Cesium.Cartesian3(55, 125, 25), "temlb_1", Cesium.Color.YELLOW);
      //   dtmmap['tscaler'].mileageLBnd(280398, new Cesium.Cartesian3(30, 125, 15), 'ahdlb_1', Cesium.Color.YELLOW);

      //   dtmmap['ahdlb'] = lbs;
      // } else {
      //   dtmmap['ahdlb'].forEach((element) => {
      //     element.show = !element.show;
      //   });
      // }
    },
  ],
  [
    'DBH',
    (viewer: Viewer) => {
      //@ts-ignore
      const LocalFrameToFixedFrame = Transforms.localFrameToFixedFrameGenerator('up', 'east');
      const modelMatrix = LocalFrameToFixedFrame(Cartesian3.fromDegrees(101.78855283519401, 30.040214597296615, 3631.759417509219));
      viewer.scene.primitives.add(
        Model.fromGltf({
          modelMatrix: modelMatrix,
          url: 'data/DBH/model.glb',
        })
      );

      lookAtFixed(viewer, true);

      // if (dtmmap['dbhlb'] === undefined) {
      //   const lbs = new Array();
      //   lbs.push(dtmmap['tscaler'].addLabelByMileage(280406, 15, 'dbhlb_1'));

      //   // dtmmap["tscaler"].mileageBBox(280366, new Cesium.Cartesian3(55, 125, 25), "temlb_1", Cesium.Color.YELLOW);
      //   dtmmap['tscaler'].mileageLBnd(280394, new Cesium.Cartesian3(25, 125, 15), 'dbhlb_1', Cesium.Color.YELLOW);

      //   dtmmap['dbhlb'] = lbs;
      // } else {
      //   dtmmap['dbhlb'].forEach((element) => {
      //     element.show = !element.show;
      //   });
      // }
    },
  ],
  [
    'TFS',
    (viewer: Viewer, modelUrl: string) => {
      //@ts-ignore
      const LocalFrameToFixedFrame = Transforms.localFrameToFixedFrameGenerator('up', 'east');
      const modelMatrix = LocalFrameToFixedFrame(Cartesian3.fromDegrees(101.78855283519401, 30.040214597296615, 3631.759417509219));
      viewer.scene.primitives.add(
        Model.fromGltf({
          modelMatrix: modelMatrix,
          url: modelUrl,
        })
      );
      lookAtFixed(viewer, true);
    },
  ],
]);

/**
 * @description: 加载刻度尺
 * @return {void}
 */
function createTScaler() {
  let viewer = DTScopeEngine.viewer;
  let params1000 = {
    positions: Rulers1000m,
    baseName: 'DK',
    start: 280000,
  };
  let params100 = {
    positions: Rulers100m,
    baseName: 'DK',
    start: 279700,
  };
  let params10 = {
    positions: Rulers10m,
    baseName: 'DK',
    start: 279700,
  };
  return new TScaler(viewer, Positions, params1000, params100, params10);
}
/**
 * @description: 控制地球
 * @param {Viewer} viewer
 * @param {boolean} status
 * @return {void}
 */
function setEarth(viewer: Viewer, status: boolean) {
  viewer.scene.skyAtmosphere.show = status;
  viewer.scene.sun.show = status;
  viewer.scene.globe.show = status;
  viewer.scene.moon.show = status;
  viewer.scene.skyBox.show = status;

  if (!status) {
    viewer.scene.light = new DirectionalLight({
      direction: new Cartesian3(0.354925, -0.890918, -0.283358),
    });
    //@ts-ignore 公司API调节环境光
    viewer.enviromentBrightness = 0.95;
  }
}

/**
 * @description: 绑定键盘，返回垃圾处理函数
 * @param {Viewer} viewer
 * @return {void}
 */
function keyBind(viewer: Viewer) {
  let model;
  document.onkeyup = (event) => {
    switch (event.code) {
      case 'KeyT':
        //@ts-ignore
        viewer.DTScene.layers.forEach((layers) => {
          layers.values.forEach((layer) => {
            if (layer._label === '工区全线隧道') {
              //@ts-ignore
              viewer.DTScene.setLayerVisiability(layer, !layer._visible);
            }
          });
        });
        break;
      case 'KeyF': {
        if (!model) {
          //@ts-ignore
          model = modelMapping.get('TFS')(viewer, TFSModel);
        } else {
          model.show = !model.show;
        }
        break;
      }
    }
  };

  return () => {
    document.onkeyup = undefined;
  };
}

function changeModel(viewer, model: string, colours: any) {
  modelMapping.get(model)(viewer, colours, 'vp');
}

export { lookAtFixed, createTScaler, setEarth, keyBind, changeModel };

/*
 * @Author: Lincong-pro
 * @Date: 2024-01-05 21:28:28
 * @LastEditors: Lincong-pro lincong_pro@163.com
 * @LastEditTime: 2024-05-07 14:45:28
 * @FilePath: \Geology-v3\src\views\SceneManagement\FullLine\animate.ts
 * @Description: 动画测试
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import WEventBus from '../Layout/Tools/WEventBus';
import { Viewer, KmlDataSource, Math, Cartesian3, UrlTemplateImageryProvider, WebMercatorTilingScheme } from 'Cesium';

import { DTScopeEngine } from '@/utils/Common/Viewer';
import { ddh, jsj, batangA, batangD } from './API/changan-request';
import { setCameraViewPoint } from '@/utils/Common/CameraControl';
import RoamControl from './Utils/RoamControl';
import { ipServer } from './Services/ServiceProperties';
import { loadMap } from '@/utils/Maps/MapSource';
import { generateDTGlobeConfig, removeFromDTGlobeConfig, loadFromDTGlobeConfig, generateInsarConfig } from './Utils/Layer';

import DDHConfig from './Config/daduhe.json';
import BatangJinshaConfig from './Config/batang-jinsha.json';

let eventBus = new WEventBus();
let rate = 0.3; // 基本时间倍率

/**
 * @description: 初始化地球
 * @param {*} viewer
 * @param config 任意配置
 * @return {void}
 */
function initDTGlobe(viewer: Viewer, config: any) {
  let layerUids;
  config = generateDTGlobeConfig(ipServer, config);
  let sceneConfig = config.dtglobeCzml;
  layerUids = config.layerUids;

  let loadingPromise = loadFromDTGlobeConfig(viewer, sceneConfig);
  loadingPromise.then(() => {
    // console.info('图层加载完毕');
  });

  return {
    trashFunc: () => {
      removeFromDTGlobeConfig(viewer, layerUids);
    },
    readyPromise: loadingPromise,
  };
}

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
  let headingPitchRange: number[] = [Math.toDegrees(cameraView[0]), Math.toDegrees(cameraView[1]), 500];

  return new Promise((resolve) => {
    eventBus.emit('changeLoadingText', '播放动画中');
    let timerId = setInterval(() => {
      if (typeof preLayer != 'undefined') {
        //@ts-ignore
        preLayer.show = false;
      }

      eventBus.emit('animateLabel', {
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
          resolve('时序动画播放完毕');
        }
        index = 0;
      }
    }, 1200 * rate);
  });

  // return promise
};

/**
 * @description: 时间序列动画循环
 * @param {*} items
 * @return {*}
 */
const timeSeries = (items) => {
  let viewer: Viewer = DTScopeEngine.viewer;

  const promises = [];
  eventBus.emit('changeLoadingAnimate', true); // 显示过渡动画
  for (let i = 0; i < items.length; ++i) {
    const promise = new Promise((resolve) => {
      let item = items[i];
      eventBus.emit('changeLoadingText', item.label);

      KmlDataSource.load(item.kml, {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true,
      }).then((dataSource) => {
        dataSource.name = item.label;
        dataSource.show = false;

        viewer.dataSources.add(dataSource);
        dataSource.entities.values.forEach((entity) => {
          if (typeof entity.rectangle != 'undefined') {
            //@ts-ignore
            entity.rectangle.material.transparent = true; //@ts-ignore
          }
        });

        if (i == items.length - 1) {
          setTimeout(() => {
            eventBus.emit('changeLoadingAnimate', false); // 关闭过渡动画
          }, 2000);
        }
        resolve(dataSource); // 用于外界清除加载的数据
      });
    });
    promises.push(promise);
  }
  return Promise.all(promises);
};

const ddhTimeSeries = () => {
  let viewer = DTScopeEngine.viewer;
  generateInsarConfig(ipServer, ddh);

  return timeSeries(ddh).then(async (dataSources) => {
    return aniamtionFunc(
      viewer,
      ddh,
      [5.629108040774708, -0.6226331640905238],
      Cartesian3.fromDegrees(102.2383534, 29.9182686, 2765.9967588),
      280,
      360,
      2
    ).then(() => {
      dataSources.forEach((dataSource) => {
        viewer.dataSources.remove(dataSource, true);
      });
    });
  });
};

const jsjTimeSeries = () => {
  let viewer = DTScopeEngine.viewer;
  generateInsarConfig(ipServer, jsj);

  return timeSeries(jsj).then(async (dataSources) => {
    let viewPoint = {
      Orientation: {
        heading: 2.2477379999373177,
        pitch: -0.7125583351115417,
        roll: 0.00303260319396248,
      },
      Position: {
        longitude: 98.8490821,
        latitude: 30.784151,
        height: 13294.9950237,
      },
    };
    // await setCameraViewPoint(viewer, viewPoint, 5)
    return aniamtionFunc(
      viewer,
      jsj,
      [2.2477379999373177, -0.7125583351115417],
      Cartesian3.fromDegrees(98.8490821, 30.784151, 13294.9950237),
      110,
      147,
      2
    ).then(() => {
      dataSources.forEach((dataSource) => {
        viewer.dataSources.remove(dataSource, true);
      });
    });
  });
};

const batangTimeSeries = (data) => {
  let viewer = DTScopeEngine.viewer;
  generateInsarConfig(ipServer, data);

  return timeSeries(data).then(async (dataSources) => {
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
    // await setCameraViewPoint(viewer, viewPoint, 5)
    return aniamtionFunc(
      viewer,
      data,
      [viewPoint.Orientation.heading, viewPoint.Orientation.pitch],
      Cartesian3.fromDegrees(viewPoint.Position.longitude, viewPoint.Position.latitude, viewPoint.Position.height),
      45,
      77,
      2
    ).then(() => {
      dataSources.forEach((dataSource) => {
        viewer.dataSources.remove(dataSource, true);
      });
    });
  });
};
/**
 * @description: 避免因悬浮影响美观
 * @param {*} status
 * @return {void}
 */
const switchKmlLayers = (status) => {
  let layers = ['滑坡隐患_类型'];
  layers.forEach((layerName) => {
    let kmlDataSource = DTScopeEngine.viewer.dataSources.getByName(layerName);
    kmlDataSource[0].show = status;
  });
};

let trashCallback;

export const animation: Stage[] = [
  // 整体视角
  {
    layers: ['地名路段高空版本', '全线线路', '滑坡隐患_点位'],
    animationPoint: [
      {
        //第2帧
        ViewPoint: {
          Orientation: {
            heading: 4.306736614842373,
            pitch: -0.3136201291254972,
            roll: 6.280362856853344,
          },
          Position: {
            longitude: 103.762953,
            latitude: 30.3328402,
            height: 21066.5976982,
          },
        },
        duration: 5 * rate,
      },
      {
        // 第1帧
        ViewPoint: {
          Orientation: {
            heading: 6.283185307179586,
            pitch: -1.5684774804020813,
            roll: 0,
          },
          Position: {
            longitude: 98.5189493,
            latitude: 30.0391613,
            height: 1057636.3695166,
          },
        },
        duration: 5 * rate,
      },
    ],
    callback: () => {
      let viewer = DTScopeEngine.viewer;
      let kmlDataSource = viewer.dataSources.getByName('滑坡隐患_点位');
      kmlDataSource[0].show = false;
      let kmlDataSource1 = viewer.dataSources.getByName('地名路段高空版本');
      kmlDataSource1[0].show = false;

      loadMap(viewer);
      viewer.scene.globe.depthTestAgainstTerrain = true;
    },
  },
  // 成都到大渡河
  {
    layers: ['地名路段', '滑坡隐患_类型'],
    animationPoint: [
      {
        //结束帧
        ViewPoint: {
          Orientation: {
            heading: 5.5990271287629625,
            pitch: -0.7494263672020791,
            roll: 6.280681552601148,
          },
          Position: {
            longitude: 102.2534128,
            latitude: 29.893338,
            height: 5102.5478745,
          },
        },
        duration: 3 * rate,
      },
      {
        // 第一帧
        ViewPoint: {
          Orientation: {
            heading: 4.463383854726014,
            pitch: -0.5282349076002997,
            roll: 6.279924680957269,
          },
          Position: {
            longitude: 103.1847363,
            latitude: 30.0581415,
            height: 6783.7075382,
          },
        },
        duration: 15 * rate,
      },
      {
        // 第二帧
        ViewPoint: {
          Orientation: {
            heading: 4.45799679474707,
            pitch: -0.6097595420236706,
            roll: 6.279628108006186,
          },
          Position: {
            longitude: 102.9116886,
            latitude: 30.0297361,
            height: 6793.9878175,
          },
        },
        duration: 10 * rate,
      },
      {
        // 第一个隐患点帧
        ViewPoint: {
          Orientation: {
            heading: 4.45799679474707,
            pitch: -0.6097595420236706,
            roll: 6.279628108006186,
          },
          Position: {
            longitude: 102.8535148,
            latitude: 30.0174311,
            height: 6793.9878175,
          },
        },
        duration: 10 * rate,
      },
      {
        // 第3帧
        ViewPoint: {
          Orientation: {
            heading: 4.45799679474707,
            pitch: -0.6097595420236706,
            roll: 6.279628108006186,
          },
          Position: {
            longitude: 102.6881556,
            latitude: 30.0141451,
            height: 6793.9878175,
          },
        },
        duration: 10 * rate,
      },
      {
        // 第4帧
        ViewPoint: {
          Orientation: {
            heading: 4.457994518012837,
            pitch: -0.6097587788449264,
            roll: 6.279631822536331,
          },
          Position: {
            longitude: 102.5561653,
            latitude: 30.003983,
            height: 7777.3752498,
          },
        },
        duration: 8 * rate,
      },
      {
        // 第2个隐患点
        ViewPoint: {
          Orientation: {
            heading: 4.457994518012837,
            pitch: -0.6097587788449264,
            roll: 6.279631822536331,
          },
          Position: {
            longitude: 102.4486819,
            latitude: 29.9680356,
            height: 7777.3752498,
          },
        },
        duration: 5 * rate,
      },
      {
        // 第3个隐患点
        ViewPoint: {
          Orientation: {
            heading: 4.457994518012837,
            pitch: -0.6097587788449264,
            roll: 6.279631822536331,
          },
          Position: {
            longitude: 102.3709282,
            latitude: 29.9441384,
            height: 7777.3752498,
          },
        },
        duration: 5 * rate,
      },
      {
        // 第4个隐患点
        ViewPoint: {
          Orientation: {
            heading: 4.899027865706684,
            pitch: -0.7494253961337267,
            roll: 6.280680470798991,
          },
          Position: {
            longitude: 102.2928056,
            latitude: 29.9089613,
            height: 6591.4795131,
          },
        },
        duration: 5 * rate,
      },
    ],
    callback: () => {
      switchKmlLayers(false);
      let viewer = DTScopeEngine.viewer;
      const { trashFunc, readyPromise } = initDTGlobe(viewer, DDHConfig);
      trashCallback = trashFunc;

      let promise1 = ddhTimeSeries(); // 异步播放ddh时间序列
      let hdlabel = DTScopeEngine.viewer.dataSources.getByName('绘制图层')[0];
      hdlabel.show = false;
      let viewport = {
        ViewPoint: {
          Orientation: {
            heading: 4.2680872377854095,
            pitch: -0.48880250917349866,
            roll: 6.280221438960034,
          },
          Position: {
            longitude: 102.2538208,
            latitude: 29.9403777,
            height: 3335.7381074,
          },
        },
        duration: 10 * rate,
      };

      // 等待漫游和时序数据执行完毕
      return Promise.all([promise1, readyPromise])
        .then(() => {
          eventBus.emit('changeDDHChart', false);
          eventBus.emit('changeDDHChartStatus', false);
          eventBus.emit('animateLabel', {
            status: false,
            text: '',
          });
          // 飞到左边视点 - 和大渡河时序数据一起播放
          return setCameraViewPoint(viewer, viewport.ViewPoint, viewport.duration);
        })
        .then(() => {
          switchKmlLayers(true);
          let hdlabel = viewer.dataSources.getByName('绘制图层')[0];
          hdlabel.show = true;
          trashCallback();

          let res = initDTGlobe(viewer, BatangJinshaConfig); // 初始化后面的数据
          trashCallback = res.trashFunc;
          return res.readyPromise;
        });
    },
  },
  // 大渡河到理塘-巴塘
  {
    layers: [],
    animationPoint: [
      {
        ViewPoint: {
          Orientation: {
            heading: 5.277334858761526,
            pitch: -0.6899402776857988,
            roll: 6.2799906130341085,
          },
          Position: {
            longitude: 99.6748356,
            latitude: 30.2044238,
            height: 10766.1509021,
          },
        },
        duration: 20 * rate,
      },
      {
        ViewPoint: {
          Orientation: {
            heading: 4.845245594612578,
            pitch: -0.79624637985928,
            roll: 6.279997497356099,
          },
          Position: {
            longitude: 101.9693578,
            latitude: 30.0419637,
            height: 10502.558271,
          },
        },
        duration: 10 * rate,
      },
      //第五个隐患点
      {
        ViewPoint: {
          Orientation: {
            heading: 4.845245594612578,
            pitch: -0.5624637985928,
            roll: 6.279997497356099,
          },
          Position: {
            longitude: 101.8051578,
            latitude: 30.0111637,
            height: 7502.558271,
          },
        },
        duration: 10 * rate,
      },
      {
        ViewPoint: {
          Orientation: {
            heading: 4.86767814495389,
            pitch: -0.6314104878844873,
            roll: 6.279625766826669,
          },
          Position: {
            longitude: 101.6023418,
            latitude: 30.0625106,
            height: 9365.8840337,
          },
        },
        duration: 20 * rate,
      },
      {
        ViewPoint: {
          Orientation: {
            heading: 4.705310333253869,
            pitch: -0.5654039642629418,
            roll: 6.279741050560798,
          },
          Position: {
            longitude: 101.3395599,
            latitude: 30.0818515,
            height: 8789.5563548,
          },
        },
        duration: 20 * rate,
      },
      {
        ViewPoint: {
          Orientation: {
            heading: 4.756509471552219,
            pitch: -0.5571305545283289,
            roll: 6.279759647483026,
          },
          Position: {
            longitude: 101.151955,
            latitude: 30.1125597,
            height: 12783.715774,
          },
        },
        duration: 15 * rate,
      },
      {
        ViewPoint: {
          Orientation: {
            heading: 4.759281187582067,
            pitch: -0.5563161160086016,
            roll: 6.279763723500778,
          },
          Position: {
            longitude: 100.9983634,
            latitude: 30.0853888,
            height: 13352.6902087,
          },
        },
        duration: 20 * rate,
      },
      {
        ViewPoint: {
          Orientation: {
            heading: 4.767026423869092,
            pitch: -0.5540402628156276,
            roll: 6.279775113455685,
          },
          Position: {
            longitude: 100.5810672,
            latitude: 30.0457547,
            height: 13325.9441866,
          },
        },
        duration: 20 * rate,
      },
      {
        ViewPoint: {
          Orientation: {
            heading: 4.770560551496743,
            pitch: -0.5530017979647566,
            roll: 6.279780310657271,
          },
          Position: {
            longitude: 100.3778056,
            latitude: 29.9800422,
            height: 12058.3426439,
          },
        },
        duration: 20 * rate,
      },
      {
        ViewPoint: {
          Orientation: {
            heading: 5.190610600277004,
            pitch: -0.6105217635677809,
            roll: 6.28000364174795,
          },
          Position: {
            longitude: 100.321912,
            latitude: 29.9651225,
            height: 12503.9640743,
          },
        },
        duration: 20 * rate,
      },
      {
        ViewPoint: {
          Orientation: {
            heading: 4.976566576323833,
            pitch: -0.616625979812039,
            roll: 6.2799901349252245,
          },
          Position: {
            longitude: 100.0569179,
            latitude: 30.1235657,
            height: 12018.8773687,
          },
        },
        duration: 20 * rate,
      },
    ],
    callback: () => {
      //
    },
  },
  // 巴塘车站动画
  {
    layers: [],
    animationPoint: [
      {
        ViewPoint: {
          Orientation: {
            heading: 5.349315442323647,
            pitch: -0.6005683060662559,
            roll: 6.28033865716905,
          },
          Position: {
            longitude: 99.4488544,
            latitude: 30.243782,
            height: 6192.6246503,
          },
        },
        duration: 10 * rate,
      },
      {
        ViewPoint: {
          Orientation: {
            heading: 5.175824796850487,
            pitch: -0.6544522610459587,
            roll: 6.28058947720891,
          },
          Position: {
            longitude: 99.5715622,
            latitude: 30.1974777,
            height: 12974.3060892,
          },
        },
        duration: 10 * rate,
      },
    ],
    callback: async () => {
      switchKmlLayers(false);
      let viewer = DTScopeEngine.viewer;
      eventBus.emit('changeChartStatus', true);

      const customPoints = [
        // 巴塘时序数据 - 中间
        {
          ViewPoint: {
            Orientation: {
              heading: 1.1439982753789106,
              pitch: -0.9059882410179614,
              roll: 0.004316519936724994,
            },
            Position: {
              longitude: 99.3873965,
              latitude: 30.294944,
              height: 6763.5173833,
            },
          },
          duration: 10 * rate,
        },
        {
          ViewPoint: {
            Orientation: {
              heading: 5.441929627406402,
              pitch: -0.5945808964411219,
              roll: 6.280555480083844,
            },
            Position: {
              longitude: 99.4310198,
              latitude: 30.2553094,
              height: 5328.7863002,
            },
          },
          duration: 10 * rate,
        },
        {
          ViewPoint: {
            Orientation: {
              heading: 5.5283722288316675,
              pitch: -0.4448705749355395,
              roll: 6.280967391779294,
            },
            Position: {
              longitude: 99.4160709,
              latitude: 30.2666009,
              height: 4449.8180873,
            },
          },
          duration: 10 * rate,
        },
        {
          ViewPoint: {
            Orientation: {
              heading: 5.644155167190406,
              pitch: -0.43888139720452957,
              roll: 6.281259591801184,
            },
            Position: {
              longitude: 99.4049826,
              latitude: 30.2755429,
              height: 4321.7063924,
            },
          },
          duration: 10 * rate,
        },
        {
          ViewPoint: {
            Orientation: {
              heading: 0.09653967832116361,
              pitch: -0.6424995427157709,
              roll: 0.0003523615465539365,
            },
            Position: {
              longitude: 99.3943,
              latitude: 30.2848906,
              height: 4478.3261525,
            },
          },
          duration: 10 * rate,
        },
      ];

      let roam: RoamControl = new RoamControl(DTScopeEngine.viewer);
      return roam
        .startMapRoam(customPoints, true)
        .then(async () => {
          eventBus.emit('changeChartStatus', false);
          let viewport = {
            ViewPoint: {
              Orientation: {
                heading: 1.9385701673369828,
                pitch: -0.22827476228475407,
                roll: 0.0027984488723902246,
              },
              Position: {
                longitude: 99.3843909,
                latitude: 30.3140326,
                height: 4558.2782454,
              },
            },
            duration: 10 * rate,
          };

          // 飞到右边视点 - 和巴塘时序数据一起播放
          setCameraViewPoint(DTScopeEngine.viewer, viewport.ViewPoint, viewport.duration);
          let hdlabel = viewer.dataSources.getByName('绘制图层')[0];
          hdlabel.show = false;
          return batangTimeSeries(batangD);
        })
        .then(() => {
          let viewport = {
            ViewPoint: {
              Orientation: {
                heading: 0.8047983989592291,
                pitch: -0.20896901733882078,
                roll: 0.0021524146574645187,
              },
              Position: {
                longitude: 99.3879824,
                latitude: 30.2863025,
                height: 4502.6573116,
              },
            },
            duration: 10 * rate,
          };
          // 飞到右边视点 - 和巴塘时序数据一起播放
          setCameraViewPoint(DTScopeEngine.viewer, viewport.ViewPoint, viewport.duration);
          return batangTimeSeries(batangA).then(() => {
            switchKmlLayers(true);
            eventBus.emit('animateLabel', {
              status: false,
              text: '',
            });
          });
        })
        .then(() => {
          let hdlabel = viewer.dataSources.getByName('绘制图层')[0];
          hdlabel.show = true;
        });
    },
  },
  // 理塘到金沙江
  {
    layers: [],
    animationPoint: [
      {
        ViewPoint: {
          Orientation: {
            heading: 3.6649565924330356,
            pitch: -0.5392888369712763,
            roll: 6.281470339417055,
          },
          Position: {
            longitude: 99.000154,
            latitude: 30.7874692,
            height: 9246.6585185,
          },
        },
        duration: 20 * rate,
      },
      {
        ViewPoint: {
          Orientation: {
            heading: 5.174567274580193,
            pitch: -0.7445279016593003,
            roll: 6.279358975568407,
          },
          Position: {
            longitude: 99.20123,
            latitude: 30.6551712,
            height: 16671.4299109,
          },
        },
        duration: 20 * rate,
      },
      {
        ViewPoint: {
          Orientation: {
            heading: 5.08998781552028,
            pitch: -0.6400794338794231,
            roll: 6.279770963432586,
          },
          Position: {
            longitude: 99.042247,
            latitude: 30.7045255,
            height: 9376.7656743,
          },
        },
        duration: 20 * rate,
      },
      {
        ViewPoint: {
          Orientation: {
            heading: 3.899295845139894,
            pitch: -1.1348853426880163,
            roll: 6.2784117832365,
          },
          Position: {
            longitude: 98.9897551,
            latitude: 30.7484761,
            height: 15089.6081687,
          },
        },
        duration: 20 * rate,
      },
    ],
    callback: async () => {
      //金沙江小场景
      let timeSeriesPromise = jsjTimeSeries();
      // const customPoints = [];
      // let roam: RoamControl = new RoamControl(DTScopeEngine.viewer);
      // let promise1 = roam.startMapRoam(customPoints, true);

      return Promise.all([timeSeriesPromise]).then(() => {
        eventBus.emit('animateLabel', {
          status: false,
          text: '',
        });
        trashCallback();
      });
    },
  },
];
let extrudeHeight = 100;
export const osgbLabel = [
  {
    key: '巴塘车站-扎马滑坡',
    value: [99.4112694, 30.30375, 3928.79 + extrudeHeight],
  },
  { key: '茶洛', value: [99.250613, 30.5258148, 3936.37 + extrudeHeight] },
  { key: '乱石堡', value: [99.9366016, 30.2063367, 4225.51 + extrudeHeight] },
  { key: '瓦岗', value: [99.1105538, 30.6525784, 3677.14 + extrudeHeight] },
  { key: '雅江', value: [101.2333783, 30.1576763, 3672.54 + extrudeHeight] },
];

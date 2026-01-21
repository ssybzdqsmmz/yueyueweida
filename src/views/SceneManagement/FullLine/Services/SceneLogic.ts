/*
 * @Author: 枫林残忆
 * @Date: 2024-03-01 21:59:23
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-19 11:13:05
 * @FilePath: \Geology-v3\src\views\SceneManagement\FullLine\Services\SceneLogic.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import {
  Viewer,
  HeightReference,
  Color,
  Cartesian3,
  Cartesian2,
  NearFarScalar,
  CustomDataSource,
  HorizontalOrigin,
  KmlDataSource,
  Transforms,
  Math,
  HeadingPitchRoll, //@ts-ignore
  DTScan,
  DistanceDisplayCondition,
  VerticalOrigin,
  PolylineOutlineMaterialProperty,
} from 'Cesium';
import { cartesian3ToCartographic, cartographicToCartesian3 } from '@/utils/Common/Transform';
import { batangLabel, batangMonitor, fullLine } from '../API/changan-request';
import { loadWorldOcean } from '../Utils/Layer';
import { setCameraViewPoint } from '../Utils/CameraControl';
import { osgbLabel } from '../animate';
import { log } from 'console';

export function onStart(viewer: Viewer, initialViewPort) {
  let promises = [];
  setCameraViewPoint(viewer, initialViewPort.ViewPoint, initialViewPort.duration);

  let trashDataSources = [];
  let trashEntities = [];

  // 初始化视角设置 + 关闭深度检测
  viewer.camera.setView({
    destination: Cartesian3.fromDegrees(97.0189493, 30.0391613, 5057636.3695166),
    orientation: {
      heading: 6.283185307179586,
      pitch: -1.5684774804020813,
      roll: 0,
    },
  });
  viewer.scene.globe.depthTestAgainstTerrain = false;

  for (let i = 2; i < fullLine.length; i++) {
    let promise = new Promise((resolve) => {
      requestIdleCallback(() => {
        let item = fullLine[i];

        KmlDataSource.load(item.kml, {
          camera: viewer.scene.camera,
          canvas: viewer.scene.canvas,
          clampToGround: true,
        }).then((dataSource) => {
          trashDataSources.push(dataSource);
          resolve('');
          console.log('加载成功', item.label);

          dataSource.name = item.label; // 设置图层名称
          dataSource.show = item.visible;
          for (let i = 0; i < dataSource.entities.values.length; i++) {
            let group = dataSource.entities.values[i];
            if (typeof group.polyline != 'undefined') {
              //@ts-ignore
              group.polyline.width = 10;
              group.polyline.material = new PolylineOutlineMaterialProperty({
                //@ts-ignore
                color: Color.ORANGE, //@ts-ignore
                outlineWidth: 2, //@ts-ignore
                outlineColor: Color.BLACK,
              });
            }
            if (typeof group.label != 'undefined') {
              //@ts-ignore
              group.label.eyeOffset = new Cartesian3(0, 100, -3000); //@ts-ignore
              group.label.scaleByDistance = new NearFarScalar(6000, 1, 30000, 0.6);
              group.label.font = 'bold';
              // group.label.distanceDisplayCondition =
              //   new DistanceDisplayCondition(0.0, 200000.0)
            }
            if (typeof group.billboard != 'undefined') {
              //@ts-ignore
              group.billboard.verticalOrigin = VerticalOrigin.BOTTOM; //@ts-ignore
              // group.billboard.horizontalOrigin = HorizontalOrigin.LEFT //@ts-ignorer
              group.billboard.pixelOffset = new Cartesian2(2, 0); //@ts-ignore
              group.billboard.scaleByDistance = new NearFarScalar(6000, 1, 30000, 0.4);
              // group.billboard.distanceDisplayCondition =
              //   new DistanceDisplayCondition(0.0, 200000.0)
            }
            if (typeof group.polygon != 'undefined') {
              //@ts-ignore
              group.polygon.outline = true; //@ts-ignore
              group.polygon.outlineWidth = 5; //@ts-ignore
              group.polygon.outlineColor = Color.RED; //@ts-ignore
              group.polygon.material = Color.WHITE.withAlpha(0.2); //@ts-ignore
              trashEntities.push(
                viewer.entities.add({
                  polyline: {
                    //@ts-ignore
                    positions: group.polygon.hierarchy._value.positions, //@ts-ignore
                    clampToGround: true, //@ts-ignore
                    show: true,
                  },
                })
              );
            }
          }

          viewer.dataSources.add(dataSource);
          return Promise.resolve('');
        });
      });
    });
    promises.push(promise);
  }
  for (let i = 0; i < 2; i++) {
    let promise = new Promise((resolve) => {
      //
      requestIdleCallback(() => {
        let item = fullLine[i];
        if (item.label == '地名路段高空版本') {
          // weventBus.emit('changeLoadingText', item.label);
          KmlDataSource.load(item.kml, {
            camera: viewer.scene.camera,
            canvas: viewer.scene.canvas,
            clampToGround: false,
          }).then((dataSource) => {
            console.log('加载成功', item.label);
            trashDataSources.push(dataSource);
            dataSource.name = item.label; // 设置图层名称
            dataSource.show = item.visible;
            for (let i = 0; i < dataSource.entities.values.length; i++) {
              let group = dataSource.entities.values[i];

              if (typeof group.label != 'undefined') {
                // 抬高标签的高度
                // let origin = new Cartesian3(group.position._value.x, group.position._value.y, group.position._value.z);
                // let cartographic = cartesian3ToCartographic(origin);
                // cartographic.height = cartographic.height + 12000;
                // let updatePosition = cartographicToCartesian3(cartographic);
                // group.position._value.x = updatePosition.x;
                // group.position._value.y = updatePosition.y;
                // group.position._value.z = updatePosition.z;

                // 优化抬高标签高度的代码
                let position = (group.position as any)._value;
                let { x, y, z } = position;
                let origin = new Cartesian3(x, y, z);
                let cartographic = cartesian3ToCartographic(origin);
                cartographic.height += 12000; // 直接增加高度
                let updatePosition: Cartesian3 = cartographicToCartesian3(cartographic);
                (group.position as any)._value = updatePosition;

                //@ts-ignore
                group.label.eyeOffset = new Cartesian3(0, 100, -5000); //@ts-ignore
                group.label.scaleByDistance = new NearFarScalar(6000, 0.1, 30000, 1);
                group.label.fillColor = Color.WHITE;
                group.label.outlineColor = Color.BLACK;
                group.label.font = 'bold'; //@ts-ignore
                group.label.zIndex = 5; //@ts-ignore
                group.label.showBackground = true; //@ts-ignore
                group.label.backgroundColor = new Color(0, 0, 0, 0.6);
              }
            }
            viewer.dataSources.add(dataSource);
            resolve(item.label);
          });
        } else {
          KmlDataSource.load(item.kml, {
            camera: viewer.scene.camera,
            canvas: viewer.scene.canvas,
            clampToGround: false,
          }).then((dataSource) => {
            trashDataSources.push(dataSource);
            console.log('加载成功', item.label);

            dataSource.name = item.label; // 设置图层名称
            dataSource.show = item.visible;
            for (let i = 0; i < dataSource.entities.values.length; i++) {
              let group = dataSource.entities.values[i];
              if (typeof group.billboard != 'undefined') {
                //@ts-ignore
                group.billboard.verticalOrigin = VerticalOrigin.BOTTOM; //@ts-ignore
                group.billboard.horizontalOrigin = HorizontalOrigin.CENTER; //@ts-ignorer

                group.billboard.eyeOffset = new Cartesian3(0, 100, 2000); //@ts-ignorer
                group.billboard.scaleByDistance = new NearFarScalar(0, 1, 30000, 1.5); //@ts-ignorer
                // group.billboard.distanceDisplayCondition =
                //   new DistanceDisplayCondition(10, 6000)
                group.billboard.zIndex = 1;
              }
            }
            viewer.dataSources.add(dataSource);
            resolve('');
          });
        }
      });
    });
    promises.push(promise);
  }

  return {
    trashCb: () => {
      // 避免提前执行
      Promise.all(promises).then(() => {
        trashDataSources.forEach((dataSource) => {
          dataSource.show = true;
          viewer.dataSources.remove(dataSource, true);
        });
        trashDataSources.length = 0;

        trashEntities.forEach((entity) => {
          viewer.entities.remove(entity);
        });
        trashEntities.length = 0;
      });
    },
    promises: promises,
  };
}

export function onComplete(viewer: Viewer, originViewPort) {
  // 执行完毕的回调
  setCameraViewPoint(viewer, originViewPort.ViewPoint, originViewPort.duration);
  const hiddenLayers = ['地名路段', '滑坡隐患_类型'];
  const showLayers = ['滑坡隐患_点位', '地名路段高空版本'];
  hiddenLayers.forEach((layerName) => {
    let kmlDataSource = viewer.dataSources.getByName(layerName);
    kmlDataSource[0].show = false;
  });
  showLayers.forEach((layerName) => {
    let kmlDataSource = viewer.dataSources.getByName(layerName);
    kmlDataSource[0].show = true;
  });
  loadWorldOcean(viewer);
  viewer.scene.globe.depthTestAgainstTerrain = false;
}

/**
 * @description: 加载监测器模型
 * @param {*} viewer
 * @return {void}
 */
export async function loadingLabelAndModel(viewer: Viewer) {
  let trashDataSources = [];
  let trashEntities = [];
  let trashDTScan = [];

  let entity;
  batangMonitor.forEach(async (monitor) => {
    entity = viewer.entities.add({
      position: Cartesian3.fromDegrees(monitor.position[0], monitor.position[1], monitor.position[2]),
      //@ts-ignore
      model: {
        uri: 'glb/GNSS接收机.glb',
        heightReference: HeightReference.CLAMP_TO_GROUND,
        scale: monitor.size,
        minimumPixelSize: 5,
      },
    });
    trashEntities.push(entity);
  });
  batangLabel.forEach((item) => {
    KmlDataSource.load(item.kml, {
      camera: viewer.scene.camera,
      canvas: viewer.scene.canvas,
      clampToGround: true,
    }).then((dataSource) => {
      trashDataSources.push(dataSource);

      dataSource.entities.values.forEach((entity) => {
        if (typeof entity.label != 'undefined') {
          entity.label.eyeOffset = new Cartesian3(0, 100, -300); //@ts-ignore
          entity.label.scaleByDistance = new NearFarScalar(1000, 2, 15000, 0);
          let model; //@ts-ignore
          if (entity.label.text._value.indexOf('GNSS') >= 0) {
            model = viewer.entities.add({
              //@ts-ignore
              position: entity.position._value,
              //@ts-ignore
              model: {
                uri: 'glb/GNSS接收机.glb',
                heightReference: HeightReference.CLAMP_TO_GROUND,
                scale: 1,
                minimumPixelSize: 5,
              },
            });
          } //@ts-ignore
          if (entity.label.text._value.indexOf('裂缝计') >= 0) {
            model = viewer.entities.add({
              //@ts-ignore
              position: entity.position._value,
              //@ts-ignore
              model: {
                uri: 'glb/裂缝针.glb',
                heightReference: HeightReference.CLAMP_TO_GROUND,
                scale: 1,
                minimumPixelSize: 5,
              },
            });
            let rotation = Math.toRadians(-45); //@ts-ignore
            let quaternion = Transforms.headingPitchRollQuaternion(entity.position._value, new HeadingPitchRoll(rotation, 0, 0));
            model.orientation = quaternion;
          } //@ts-ignore
          if (entity.label.text._value.indexOf('气象站') >= 0) {
            model = viewer.entities.add({
              //@ts-ignore
              position: entity.position._value,
              //@ts-ignore
              model: {
                uri: 'glb/气象站.glb',
                heightReference: HeightReference.CLAMP_TO_GROUND,
                scale: 1,
                minimumPixelSize: 5,
              },
            });
          }
          trashEntities.push(model);
        }
        if (typeof entity.billboard != 'undefined') {
          //@ts-ignore
          entity.billboard.show = false;
        }
      });

      viewer.dataSources.add(dataSource);
    });
  });

  osgbLabel.forEach((item) => {
    let dtScan = new DTScan({
      scene: viewer.scene,
      scanCenter: Cartesian3.fromDegrees(item.value[0], item.value[1], item.value[2]),
      scanType: 'SPREAD',
    });
    dtScan.AddScan();
    trashDTScan.push(dtScan);

    trashEntities.push(
      viewer.entities.add({
        position: Cartesian3.fromDegrees(item.value[0], item.value[1], item.value[2]),
        label: {
          //@ts-ignore
          text: item.key,
          font: '30px sans-serif', //@ts-ignore
          distanceDisplayCondition: new DistanceDisplayCondition(10, 6000),
          scaleByDistance: new NearFarScalar(0, 0, 1, 1),
          eyeOffset: new Cartesian3(0, 10, 0),
        },
      })
    );
  });

  const additionalLabels = [
    {
      title: '稳定历史变形破坏区',
      color: Color.LIGHTGREEN,
      text: `
地点: 四川省 雅安市 天全县
经度: 102.8448
纬度: 30.0116
坡顶高程: 911 米
坡脚高程: 682 米
面积: 896937 平方千米`,
      position: {
        longitude: 102.8448,
        latitude: 30.0116,
      },
    },
    {
      title: '稳定历史变形破坏区',
      color: Color.LIGHTGREEN,
      text: `
地点: 四川省 雅安市 天全县
经度: 102.4170
纬度: 29.9619
坡顶高程: 1622 米
坡脚高程: 1303 米
面积: 213181 平方千米`,
      position: {
        longitude: 102.417,
        latitude: 29.9619,
      },
    },
    {
      title: '斜坡变形区',
      color: Color.LIGHTCORAL,
      text: `
地点: 四川省 雅安市 天全县
经度: 102.3709
纬度: 29.9441
坡顶高程: 1982 米
坡脚高程: 1601 米
面积: 507248 平方米`,
      position: {
        longitude: 102.3709,
        latitude: 29.9441,
      },
    },
    {
      title: '复活历史变形破坏区',
      color: Color.DARKORANGE,
      text: `
地点: 四川省 甘孜藏族自治州 泸定县
经度: 102.2228
纬度: 29.9089
坡顶高程: 1692 米
坡脚高程: 1429 米
面积: 94480 平方米`,
      position: {
        longitude: 102.2228,
        latitude: 29.9089,
      },
    },
    {
      title: '冰川或冰湖',
      color: Color.DARKTURQUOISE,
      text: `
地点: 四川省 甘孜藏族自治州 康定县
经度: 101.8151
纬度: 30.0111
坡顶高程: 4743 米
坡脚高程: 4045 米
面积: 4903629 平方米`,
      position: {
        longitude: 101.8151,
        latitude: 30.0111,
      },
    },
    {
      title: '斜坡变形区',
      color: Color.LIGHTCORAL,
      text: `
地点: 四川省 甘孜藏族自治州 白玉县
经度: 98.9647
纬度: 30.6877
坡顶高程: 4586 米
坡脚高程: 4369 米
面积: 259037 平方千米`,
      position: {
        longitude: 98.9647,
        latitude: 30.6877,
      },
    },
    {
      title: '复活历史变形破坏区',
      color: Color.DARKORANGE,
      text: `
地点: 四川省 甘孜藏族自治州 巴塘县
经度: 99.4115
纬度: 30.3036
坡顶高程: 4574 米
坡脚高程: 3600 米
面积: 2114443 平方千米`,
      position: {
        longitude: 99.4082151,
        latitude: 30.3063647,
      },
    },
  ];
  let customDataSource = await viewer.dataSources.add(new CustomDataSource('绘制图层'));
  let hdlabel = viewer.dataSources.getByName('绘制图层')[0];
  additionalLabels.forEach((additionalLabel) => {
    hdlabel.entities.add({
      position: Cartesian3.fromDegrees(additionalLabel.position.longitude, additionalLabel.position.latitude),
      label: {
        //@ts-ignore
        text: additionalLabel.text,
        font: '24px sans-serif',
        fillColor: Color.WHITE,
        heightReference: HeightReference.CLAMP_TO_GROUND, //@ts-ignore
        // eyeOffset: new Cartesian3(0, 100, -200),
        pixelOffset: new Cartesian2(0, -120),
        scaleByDistance: new NearFarScalar(0, 2.5, 30000, 0),
        disableDepthTestDistance: Number.POSITIVE_INFINITY, //@ts-ignore
        pixelOffsetScaleByDistance: new NearFarScalar(1000, 3, 30000, 0), //@ts-ignore
        horizontalOrigin: HorizontalOrigin.LEFT, //对齐方式
      },
    });
    hdlabel.entities.add({
      position: Cartesian3.fromDegrees(additionalLabel.position.longitude, additionalLabel.position.latitude),
      label: {
        //@ts-ignore
        text: additionalLabel.title,
        font: '25px sans-serif',
        fillColor: additionalLabel.color,
        heightReference: HeightReference.CLAMP_TO_GROUND, //@ts-ignore
        // eyeOffset: new Cartesian3(0, 100, -200),
        pixelOffset: new Cartesian2(0, -195),
        scaleByDistance: new NearFarScalar(0, 2.5, 30000, 0),
        disableDepthTestDistance: Number.POSITIVE_INFINITY, //@ts-ignore
        pixelOffsetScaleByDistance: new NearFarScalar(1000, 3, 30000, 0), //@ts-ignore
        horizontalOrigin: HorizontalOrigin.LEFT, //对齐方式
      },
    });
  });
  trashDataSources.push(customDataSource);

  return () => {
    trashDataSources.forEach((dataSource) => {
      dataSource.show = true;
      viewer.dataSources.remove(dataSource, true);
    });

    trashEntities.forEach((entity) => {
      viewer.entities.remove(entity);
    });

    trashDTScan.forEach((dtScan) => {
      dtScan.RemoveScan();
    });
  };
}

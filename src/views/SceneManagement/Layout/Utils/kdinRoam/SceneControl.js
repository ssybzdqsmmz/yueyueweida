/*
 * @Author: WouRaoyu
 * @Date: 2021-04-12 12:38:48
 * @LastEditors: anganao 1928882425@qq.com
 * @LastEditTime: 2024-04-09 09:24:52
 * @Description: file content
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Utils\kdinRoam\SceneControl.js
 * @Copyright (c) : 2021 VrLab
 */

// import router from '../router';
import * as Cesium from 'Cesium';
// import ArroundPointRoam from './ArroundPointRoam.js';

function flytoControl(viewer, viewPoint, duration, callback) {
  let position = viewPoint.position;
  let orientation = viewPoint.orientation;
  viewer.scene.camera.flyTo({
    easingFunction: Cesium.EasingFunction.LINEAR_NONE,
    destination: position,
    orientation: orientation,
    duration: duration,
  });
}

export class SceneControl {
  constructor(options) {
    this._init = false;
    this._roaming = undefined;
    this._uuid = options.uuid;
    this._label = options.label;
    this._icon = options.icon;
    this._layers = options.layers;
    this._router = options.router;
    this._camera = options.camera;
    this._doroam = options.doroam;
  }

  init() {
    let pnt_camera = this._camera.position;
    let pnt_center = new Cesium.Cartesian3(...this._icon.coord);
    let localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(pnt_camera);
    let worldToLocal_Matrix = Cesium.Matrix4.inverse(localToWorld_Matrix, new Cesium.Matrix4());
    let localPosition_B = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, pnt_center, new Cesium.Cartesian3());
    let heading = Math.atan2(localPosition_B.x, localPosition_B.y);
    let xy = Math.sqrt(Math.pow(localPosition_B.x, 2) + Math.pow(localPosition_B.y, 2));
    let pitch = Math.atan2(localPosition_B.z, xy);
    this._camera.orientation.heading = heading;
    this._camera.orientation.pitch = pitch;
  }

  custom(labels, iterator) {
    if (this._doroam) {
      this.init();
    }
    let cvs_text = Cesium.writeTextToCanvas(this._label, {
      fillColor: Cesium.Color.WHITE,
      font: '32px sans-serif',
      padding: 32,
    });
    let position = new Cesium.Cartesian3(...this._icon.coord);
    position = Cesium.Cartographic.fromCartesian(position);
    position.height += this._icon.height;

    let img_back = document.createElement('img');
    img_back.src = './img/back@2x.png';
    let img_line = document.createElement('img');
    img_line.src = './img/line@2x.png';
    let img_head = document.createElement('img');
    if (this._label == '居民建筑') {
      img_head.src = './img/_building_live.svg';
    } else {
      img_head.src = './img/_building_work.svg';
    }
    img_back.onload = () => {
      let cvs = document.createElement('canvas');
      let ctx = cvs.getContext('2d');
      cvs.width = cvs_text.width;
      cvs.height = cvs_text.height + 160;
      ctx.drawImage(img_back, 0, 0, img_back.width, img_back.height, 0, 40, cvs_text.width, cvs_text.height);
      ctx.drawImage(cvs_text, 0, 40);

      img_line.onload = () => {
        ctx.drawImage(img_line, 0, 0, img_line.width, img_line.height, cvs_text.width / 2 - 60, cvs_text.height, 120, 150);
        img_head.onload = () => {
          ctx.drawImage(img_head, 0, 0, img_head.width, img_head.height, cvs_text.width / 2 - 40, 0, 80, 70);
          labels.add({
            position: Cesium.Cartographic.toCartesian(position),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500.0),
            scaleByDistance: new Cesium.NearFarScalar(50.0, 4.0, 500.0, 0.0),
            id: iterator,
            image: cvs,
            show: true,
            scale: 1,
          });
        };
      };
    };
  }

  create(marks) {
    if (this._doroam) {
      this.init();
    }
    marks.push({
      position: new Cesium.Cartesian3(...this._icon.coord),
      height: this._icon.height,
      text: this._label,
      imagData: {
        topIcon: this._icon.topimg,
        bodyIcon: this._icon.bodyimg,
        backIcon: this._icon.backimg,
        isRoate: this._icon.isRoate,
        color: this._icon.color,
      },
    });
    this._init = true;
  }

  destroy() {
    this._init = false;
  }

  hasinit() {
    return this._init;
  }

  activate(viewer, flytime = 1) {
    if (!this._roaming && this._doroam) {
      // this._roaming = new ArroundPointRoam({
      //   center: new Cesium.Cartesian3(...this._icon.coord),
      //   initview: this._camera,
      //   viewer: viewer,
      //   duration: 20,
      // });
    }
    flytoControl(viewer, this._camera, flytime, () => {
      if (this._doroam) {
        this._roaming.create();
        this._roaming.start();
      }
    });
    // router.push(this._router);
  }

  deactivate() {
    if (this._roaming) {
      this._roaming.stop();
    }
    // router.push("/none");
  }
}

export function GenerateScene(viewer, handler, scenes_array, activate = true) {
  if (activate) {
    handler.setInputAction(function (lclickment) {
      let camera = viewer.camera;
      let coord_click = viewer.scene.pickPosition(lclickment.position);
      let coord_camera = camera.position;
      if (coord_click) {
        let scene_register = {
          uuid: Math.random().toString(16).substr(2, 12),
          label: '测试保存场景',
          icon: {
            coord: [coord_click.x, coord_click.y, coord_click.z],
            topimg: undefined,
            bodyimg: undefined,
            backimg: undefined,
            isRoate: false,
            height: 15,
          },
          layers: ['测试图层_1', '测试图层_2', '测试图层_3'],
          router: '/router',
          camera: {
            orientation: {
              heading: camera.heading,
              pitch: camera.pitch,
              roll: camera.roll,
            },
            position: {
              x: coord_camera.x,
              y: coord_camera.y,
              z: coord_camera.z,
            },
          },
        };
        scenes_array.push(scene_register);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  } else {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
}

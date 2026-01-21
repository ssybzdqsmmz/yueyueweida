/*
 * @Author: WouRaoyu
 * @Date: 2021-04-12 13:45:40
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2024-02-25 16:23:55
 * @Description: file content
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnel\Utils\ScenesContainer.js
 * @Copyright (c) : 2021 VrLab
 */
import { SceneControl } from './SceneControl.js';
import * as Cesium from 'Cesium';
// import store from '../store';

export class ScenesContainer {
  constructor(options) {
    this._handler = options.handler;
    this._container = options.scenes;
    // this._json_url = options.url;
    this._jsonData = options.jsonData;
    this._label_type = options.type;
    this._mutation = options.mutation;
    this._withroam = options.withroam;
    if (this._label_type === undefined) {
      this._label_type = ScenesContainer.LabelType.DTMark;
    }
    if (this._withroam === undefined) {
      this._withroam = true;
    }
    this._current = undefined;
    this._labels = undefined;
  }

  bindResource(resource) {
    resource.forEach((item) => {
      const scene_control = new SceneControl(item);
      this._container.push(scene_control);
    });
  }

  initialize(resource) {
    if (resource !== undefined) {
      this.bindResource(resource);
      return;
    }

    this._jsonData.forEach((item) => {
      item.doroam = this._withroam;
      const scene_control = new SceneControl(item);
      this._container.push(scene_control);
    });
  }

  create(viewer, size = 5, length = 5) {
    if (this._label_type === ScenesContainer.LabelType.DTMark) {
      this.createDTMark(viewer, size, length);
    } else if (this._label_type === ScenesContainer.LabelType.Custom) {
      this.createCustom(viewer);
    }
  }

  createCustom(viewer) {
    this._labels = viewer.scene.primitives.add(new Cesium.BillboardCollection());
    let iterator = 0; // 传递序列号
    this._container.forEach((element) => {
      element.custom(this._labels, iterator);
      iterator++;
    });
    this._init = true;
  }

  createDTMark(viewer, size = 5, length = 5) {
    this._init = true;
    const marks = [];
    this._container.forEach((element) => {
      element.create(marks);
    });
    this._labels = viewer.scene.primitives.add(
      new Cesium.DTMarkIcons({
        marks: marks,
        markSize: size,
        bodyLen: length,
      })
    );
    this._labels.show = false;
  }

  activate(viewer, custom = ScenesContainer.DisplayType.Navigate) {
    this._labels.show = true;
    if (this._handler instanceof Cesium.ScreenSpaceEventHandler === false) {
      this._handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    }
    if (this._label_type === ScenesContainer.LabelType.DTMark) {
      this.activeDTMark(viewer);
    } else if (this._label_type === ScenesContainer.LabelType.Custom) {
      this.activeCustom(viewer, custom);
    }
  }

  activeDTMark(viewer) {
    let that = this;
    this._handler.setInputAction((click) => {
      let pickedFeature = viewer.scene.pick(click.position);
      if (!Cesium.defined(pickedFeature)) {
        return;
      }
      if (pickedFeature.index === undefined) {
        return;
      }
      let index = pickedFeature.index;
      if (!that._current) {
        that._current = that._container[index];
      } else {
        if (that._current._uuid !== that._container[index]._uuid) {
          that._current.deactivate();
          that._current = that._container[index];
        } else {
          that._current.deactivate();
          that._current = undefined;
        }
      }
      let label_name = undefined;
      if (this._current) {
        that._current.activate(viewer);
        label_name = that._current._label;
      }
      if (that._mutation) {
        // store.commit(that._mutation, label_name);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  activeCustom(viewer, type) {
    let condition = ScenesContainer.DisplayCondition[type];
    if (condition === undefined) {
      return;
    }
    this._labels._billboards.forEach((element) => {
      element.distanceDisplayCondition = condition.distanceDisplayCondition;
      element.scaleByDistance = condition.scaleByDistance;
      element.show = true;
    });
    let that = this;
    this._handler.setInputAction((click) => {
      let pickedFeature = viewer.scene.pick(click.position);
      if (!Cesium.defined(pickedFeature)) {
        return;
      }
      if (pickedFeature.id === undefined) {
        return;
      }
      let index = pickedFeature.id;
      if (!that._current) {
        that._current = that._container[index];
      } else {
        that._current.deactivate();
        if (that._current._uuid !== that._container[index]._uuid) {
          that._current = that._container[index];
        } else {
          that._current = undefined;
        }
      }
      if (this._current) {
        that._current.activate(viewer);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  deactivate() {
    this._handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this._labels.show = false;
    if (this._label_type === ScenesContainer.LabelType.Custom) {
      this._labels._billboards.forEach((element) => {
        element.show = false;
      });
    }
  }

  destroy(viewer) {
    viewer.scene.primitives.remove(this._labels);
  }
}

ScenesContainer.DisplayCondition = [
  {
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 5000.0),
    scaleByDistance: new Cesium.NearFarScalar(50.0, 4.0, 500.0, 0.3),
  },
  {
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 5000.0),
    scaleByDistance: new Cesium.NearFarScalar(100.0, 2, 500.0, 0.5),
  },
];

ScenesContainer.DisplayType = {
  Roaming: 0,
  Navigate: 1,
};

ScenesContainer.LabelType = {
  DTMark: 0,
  Custom: 1,
};

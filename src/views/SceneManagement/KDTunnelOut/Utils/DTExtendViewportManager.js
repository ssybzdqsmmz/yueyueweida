/*
 * @Descripttion: 扩展视点管理
 * @version: 1.0.0
 * @Author: tmz
 * @Date: 2021-03-02 10:07:17
 * @LastEditors:WouRaoyu
 * @LastEditTime: 2021-04-06 03:02:05
 */
import { DTViewportManager, defined, DTViewportInfo } from 'Cesium';

class DTExtendViewportManager {
  constructor(options) {
    this._viewer = options.viewer;
    this.viewPointManager = new DTViewportManager(this._viewer);
    this._image = undefined;
  }

  // 获取后台数据
  initViewPointManager(res) {
    let viewPointManager = this.viewPointManager;
    let Viewports = res.Viewports;
    viewPointManager._infoList = new Array();
    if (defined(Viewports)) {
      for (let i = 0, length = Viewports.length; i < length; i++) {
        let Info = new DTViewportInfo({
          lon: Viewports[i].position.longitude,
          lat: Viewports[i].position.latitude,
          height: Viewports[i].position.height,
          roll: Viewports[i].roll,
          pitch: Viewports[i].pitch,
          heading: Viewports[i].heading,
          id: Viewports[i].id,
          name: Viewports[i].name,
          describe: Viewports[i].describe,
          uri: Viewports[i].url,
        });
        viewPointManager._infoList.push(Info);
      }
    }
    return viewPointManager._infoList;
  }

  initMachineViewManager(res) {
    let viewPointManager = this.viewPointManager;
    let MachineView = res.MachineView;
    viewPointManager._infoList = new Array();
    if (defined(MachineView)) {
      for (let i = 0, length = MachineView.length; i < length; i++) {
        let Info = new DTViewportInfo({
          lon: parseFloat(MachineView[i].position.longitude),
          lat: parseFloat(MachineView[i].position.latitude),
          height: parseFloat(MachineView[i].position.height),
          roll: parseFloat(MachineView[i].roll),
          pitch: parseFloat(MachineView[i].pitch),
          heading: parseFloat(MachineView[i].heading),
          id: MachineView[i].id,
          name: MachineView[i].name,
          describe: MachineView[i].describe,
          uri: MachineView[i].url,
        });
        viewPointManager._infoList.push(Info);
      }
    }
    return viewPointManager._infoList;
  }

  // 添加视点
  addViewPoint(generateImage) {
    let viewer = this._viewer;

    let viewPointManager = this.viewPointManager;
    if (!viewPointManager) {
      return;
    }
    let info = viewPointManager.add();

    return info;
  }

  // 获取一个视点
  getViewportInfoById(id) {
    let viewPointManager = this.viewPointManager;
    if (!viewPointManager) {
      return;
    }
    return viewPointManager.getViewportInfoById(id);
  }

  // 删除视点
  deleteViewPoint(id) {
    let viewPointManager = this.viewPointManager;
    if (!viewPointManager) {
      return;
    }
    let _infoList = viewPointManager._infoList;
    let index = -1;
    for (let i = 0, len = _infoList.length; i < len; ++i) {
      if (id == _infoList[i].m_id) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      return false;
    }
    let Info = _infoList[index];
    if (defined(Info)) {
      _infoList.splice(index, 1);
      Info = undefined;
    }
    this.saveToServer();
  }

  // 删除所有视点
  clearAllViewPoint() {
    let viewPointManager = this.viewPointManager;
    if (!viewPointManager) {
      return;
    }

    // let infos = viewPointManager._infoList;
    // for (let i = 0; i < infos.length; i++) {
    //   let info = infos[i];
    //   this.deleteImageData(info.name);
    // }

    viewPointManager.clear();
    this.saveToServer();
  }

  // 删除后台文件
  deleteImageData(name) {
    let data = { filepath: 'Viewport', imagename: name };
    DeleteSolutionImage(data).then((result) => {
      console.log(result);
    });
  }

  // 导出成json 并保存到后台
  saveToServer() {
    let viewPointManager = this.viewPointManager;
    if (!viewPointManager) {
      return;
    }
    let json = viewPointManager.save();
    updataJsonConfig('', 'viewport', json, false);
  }
}

Object.defineProperties(DTExtendViewportManager.prototype, {
  viewPointInfos: {
    get: function () {
      return this._viewPointInfos;
    },
  },
});

export default DTExtendViewportManager;

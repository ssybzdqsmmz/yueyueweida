import { BXInfo, GDWInfo, WSInfo, WYInfo, YBInfo, TNTSInfo, FlattenInfo, SejilaFlattenInfo } from './GeologyInfo';
import { TerrainFlatten } from './TerrainFlatten';
import { Cartesian3 } from 'Cesium';
import SampleWall from './SampleWall';
// import store from "../../store"

// import { useRouter } from 'vue-router';
class GeologyExpose {
  constructor(options) {
    if (GeologyExpose.instance) {
      return GeologyExpose.instance;
    }
    this._viewer = options.viewer;
    this._store = options.store;
    // this._store = store

    this._layers = new Array();
    this._lastkey = undefined;
    this._flatten1 = undefined;
    this._flatten2 = undefined;
    this._wyctnr = undefined;
    this._bxctnr = undefined;
    this._wsctnr = undefined;
    this._ybctnr = undefined;
    this._gdwctnr = undefined;
    this._tntsctnr = undefined;
    GeologyExpose.instance = this;
    this._activeFlattens = new Set(); // 追踪激活状态的区域
  }

  /**
   * @description: 激活
   */
  activate() {
    this.keyBind(); // 绑定键盘操作
    this.controlFlatten(true);
    this.controlSJLFlatten(false);
    this.controlAll('Open');
  }

  /**
   * @description: 取消激活
   */
  deactivate() {
    this.keyRelease(); // 注销键盘操作
    this.controlFlatten(false);
    this.controlSJLFlatten(true);
    this.controlAll('Close');
  }

  /**
   * @description: 键盘响应键绑定
   */
  keyBind() {
    document.onkeyup = (event) => {
      if (this._lastkey === event.code) {
        return;
      }
      this._lastkey = event.code;
      console.log(this._store);
      switch (event.code) {
        case 'KeyA':
          this._store.commit('changeVDZSolution', '岩爆解决方案');
          this._store.commit('changeVDZIntroduce', '岩爆介绍');
          this._store.commit('changeItemIndex', '3-1');
          break;
        case 'KeyS':
          this._store.commit('changeVDZSolution', '高地温解决方案');
          this._store.commit('changeVDZIntroduce', '高地温介绍');
          this._store.commit('changeItemIndex', '3-2');
          break;
        case 'KeyD':
          this._store.commit('changeVDZIntroduce', '瓦斯介绍');
          this._store.commit('changeItemIndex', '3-3');
          break;
        case 'KeyF':
          this._store.commit('changeVDZSolution', '突泥突水解决方案');
          this._store.commit('changeItemIndex', '3-4');
          break;
        case 'KeyG':
          this._store.commit('changeVDZSolution', '软岩大变形解决方案');
          this._store.commit('changeVDZIntroduce', '软岩大变形介绍');
          this._store.commit('changeItemIndex', '3-5');
          break;
        // case "KeyQ":
        //     this.keyRelease();
        //     break;
        default:
          break;
      }
      // 如果前端绑定了index再执行的话会重复，我现在放在后端执行
      this.controlAll(event.code);
      // const router = useRouter();
      // router.push("/frontpage/feature/vdshow");
      return () => {
        document.onkeyup = undefined;
      };
    };
  }

  /**
   * @description: 键盘释放的状态
   */
  keyRelease() {
    document.onkeyup = undefined;
    this._lastkey = undefined;
  }

  /**
   * @description: 总体控制
   * @param {*} current
   */
  controlAll(current) {
    this.controlYB(current === 'KeyA');
    this.controlGDW(current === 'KeyS');
    this.controlWS(current === 'KeyD');
    this.controlTNTS(current === 'KeyF');
    this.controlBX(current === 'KeyG');
  }

  /**
   * @description: 效果控制
   * @param {*} type
   * @param {*} indices
   */
  controlSelect(type, indices) {
    let container = undefined;
    switch (type) {
      case 'WY':
        container = this._wyctnr;
        break;
      case 'BX':
        container = this._bxctnr;
        break;
      case 'GDW':
        container = this._gdwctnr;
        break;
      case 'YB':
        container = this._ybctnr;
        break;
      case 'WS':
        container = this._wsctnr;
        break;
      case 'TNTS':
        container = this._tntsctnr;
        break;
      default:
        break;
    }
    if (!container) {
      return;
    }
    container.forEach((element) => {
      if (element) {
        element.show = true;
      }
    });
    if (container.handler) {
      clearInterval(this._wyctnr.handler);
    }
    container.handler = setInterval(() => {
      for (let index = 0; index < container.length; index++) {
        if (indices.indexOf(index) !== -1) {
          container[index].show = !container[index].show;
        }
      }
    }, 500);
  }

  /**
   * @description: 地形压平
   * @param {*} active
   */
  controlFlatten(active) {
    if (this._flatten1 === undefined) {
      let positions = Cartesian3.fromDegreesArray(FlattenInfo);
      this._flatten1 = new TerrainFlatten({
        url: 'http://192.168.1.8:8280/data/userdata/1/DataStore/12Ju/全线高精度DEM?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJERU0iLCJleHAiOjQwNzA4ODAwMDAsImlhdCI6MTYyMDg4NzkyMn0.2riVtnduYjmwzrWHKZyo5TfG6L1D634JbjJd79Z9Lw0',
        viewer: this._viewer,
        points: positions,
        height: 3100,
        length: 30,
      });
    }
    if (active) {
      this._flatten1.activate();
    } else {
      this._flatten1.recover();
    }
  }

  /**
   * @description: 地形压平
   * @param {*} active
   */
  controlSJLFlatten(active) {
    if (this._flatten2 === undefined) {
      let positions = Cartesian3.fromDegreesArray(SejilaFlattenInfo);
      this._flatten2 = new TerrainFlatten({
        url: 'http://192.168.1.8:8280/data/userdata/1/DataStore/12Ju/全线高精度DEM?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJERU0iLCJleHAiOjQwNzA4ODAwMDAsImlhdCI6MTYyMDg4NzkyMn0.2riVtnduYjmwzrWHKZyo5TfG6L1D634JbjJd79Z9Lw0',
        viewer: this._viewer,
        points: positions,
        height: 3100,
        length: 30,
      });
    }
    if (active) {
      this._flatten2.activate();
    } else {
      this._flatten2.recover();
    }
  }

  /**
   * @description: 围岩等级
   * @param {*} active
   */
  controlWY(active) {
    if (this._wyctnr === undefined) {
      this._wyctnr = SampleWall.DrawWallWidth(this._viewer, WYInfo, 100);
    }

    this._wyctnr.forEach((element) => {
      if (element) {
        element.show = active;
      }
    });
    if (active) {
      this._wyctnr.handler = setInterval(() => {
        this._wyctnr.forEach((element) => {
          if (element) {
            element.show = !element.show;
          }
        });
      }, 500);
    } else {
      clearInterval(this._wyctnr.handler);
    }
  }

  /**
   * @description: 变形
   * @param {*} active
   */
  controlBX(active) {
    if (this._bxctnr === undefined) {
      this._bxctnr = SampleWall.DrawWallHeight(this._viewer, BXInfo);
    }
    this._bxctnr.forEach((element) => {
      element.show = active;
    });
    if (active) {
      this._bxctnr.handler = setInterval(() => {
        this._bxctnr.forEach((element) => {
          if (element) {
            element.show = !element.show;
          }
        });
      }, 500);
    } else {
      clearInterval(this._bxctnr.handler);
    }
  }

  /**
   * @description: 高地温
   * @param {*} active
   */
  controlGDW(active) {
    if (this._gdwctnr === undefined) {
      this._gdwctnr = SampleWall.DrawWallHeight(this._viewer, GDWInfo);
    }
    this._gdwctnr.forEach((element) => {
      element.show = active;
    });
    if (active) {
      this._gdwctnr.handler = setInterval(() => {
        this._gdwctnr.forEach((element) => {
          if (element) {
            element.show = !element.show;
          }
        });
      }, 500);
    } else {
      clearInterval(this._gdwctnr.handler);
    }
  }

  /**
   * @description: 岩爆
   * @param {*} active
   */
  controlYB(active) {
    if (this._ybctnr === undefined) {
      this._ybctnr = SampleWall.DrawWallHeight(this._viewer, YBInfo);
    }
    this._ybctnr.forEach((element) => {
      element.show = active;
    });
    if (active) {
      this._ybctnr.handler = setInterval(() => {
        this._ybctnr.forEach((element) => {
          if (element) {
            element.show = !element.show;
          }
        });
      }, 500);
    } else {
      clearInterval(this._ybctnr.handler);
    }
  }

  /**
   * @description: 瓦斯
   * @param {*} active
   */
  controlWS(active) {
    if (this._wsctnr === undefined) {
      this._wsctnr = SampleWall.DrawWallHeight(this._viewer, WSInfo);
    }
    this._wsctnr.forEach((element) => {
      element.show = active;
    });
    if (active) {
      this._wsctnr.handler = setInterval(() => {
        this._wsctnr.forEach((element) => {
          if (element) {
            element.show = !element.show;
          }
        });
      }, 500);
    } else {
      clearInterval(this._wsctnr.handler);
    }
  }

  /**
   * @description: 突泥突水
   * @param {*} active
   */
  controlTNTS(active) {
    if (this._tntsctnr === undefined) {
      this._tntsctnr = SampleWall.DrawWallHeight(this._viewer, TNTSInfo);
    }
    this._tntsctnr.forEach((element) => {
      element.show = active;
    });
    if (active) {
      this._tntsctnr.handler = setInterval(() => {
        this._tntsctnr.forEach((element) => {
          if (element) {
            element.show = !element.show;
          }
        });
      }, 500);
    } else {
      clearInterval(this._tntsctnr.handler);
    }
  }
}

export { GeologyExpose };

import { setCameraViewPoint, getCameraViewPoint } from './CameraControl';

class RoamControl {
  constructor(viewer) {
    if (RoamControl.instance) {
      return RoamControl.instance;
    }
    this._next = 0;
    this._state = false;
    this._viewer = viewer;
    this._timeout = undefined;
    this._laststop = undefined;
    this._lasttime = undefined;
    this._resource = undefined;
    this._timepassed = 0.0;
  }

  keyBind() {
    document.onkeyup = (event) => {
      switch (event.code) {
        case 'Space':
          if (this._state) {
            this.stopMapRoam();
          } else {
            this.startMapRoam();
          }
          break;
        default:
          break;
      }
    };
  }

  keyRelease() {
    document.onkeyup = undefined;
  }

  startMapRoam(json = undefined) {
    let that = this;
    if (json) {
      this._next = 0;
      this._resource = json;
      this._timepassed = 0.0;
    }
    let vpList = this._resource;
    let maxViewPointNum = this._resource.length;
    let duration = vpList[this._next].duration - this._timepassed;
    let startViewPoint = vpList[this._next].ViewPoint;
    if (++that._next === maxViewPointNum) {
      that._next = 0;
    }
    this._state = true;

    // 对当前视点情况进行判断
    let cvp = getCameraViewPoint(this._viewer);
    let londiff = cvp.Position.longitude - startViewPoint.Position.longitude;
    let latdiff = cvp.Position.latitude - startViewPoint.Position.latitude;
    let heidiff = cvp.Position.height - startViewPoint.Position.height;
    if (Math.abs(londiff) < 1e-6 && Math.abs(latdiff) < 1e-6 && Math.abs(heidiff) < 10) {
      startCallback();
    } else {
      this._lasttime = new Date().getTime(); // 每次飞之前都要更新当前时刻
      setCameraViewPoint(this._viewer, startViewPoint, duration).then(
        //@ts-ignore
        startCallback()
      );
    }
    function startCallback() {
      function callback() {
        let vpnext = vpList[that._next];
        if (vpnext.timeout) {
          that._timeout = setTimeout(() => {
            return start();
          }, vpnext.timeout);
        } else {
          return start();
        }
      }

      function start() {
        let vp = vpList[that._next];

        if (that._next == 0) {
          setCameraViewPoint(that._viewer, vp.ViewPoint, vp.duration).then(() => {
            // that._statusCallback('漫游加载完成');
            // that._nextStage();
          });

          return;
        }
        if (++that._next === maxViewPointNum) {
          that._next = 0;
        }
        that._lasttime = new Date().getTime();
        setCameraViewPoint(that._viewer, vp.ViewPoint, vp.duration).then(() => {
          callback();
          // that._statusCallback('加载第' + that._next + '帧动画');
        });
      }

      start();
    }
  }

  stopMapRoam() {
    if (this._next > 0) {
      this._next--;
    } else {
      this._next = this._resource.length - 1;
    }
    this._state = false;
    let scene = this._viewer.scene;
    if (scene && scene.tweens.length > 0) {
      scene.tweens.removeAll();
    }
    let passed = (new Date().getTime() - this._lasttime) / 1000;
    if (this._laststop === this._next - 1) {
      this._timepassed += passed;
    } else {
      this._timepassed = passed;
    }
    this._laststop = this._next - 1;
    if (!this._timeout) {
      return;
    }
    clearTimeout(this._timeout);
  }

  /**
   * @description: 设置UI状态
   * @param {Function} callback
   * @return {void}
   */
  setStatusCallback(callback) {
    this._statusCallback = callback;
  }
  /**
   * @description: 播放下一帧动画
   * @param {*} callback
   * @return {void}
   */
  setPlayNextStage(callback) {
    this._nextStage = callback;
  }

  static getInstance(viewer) {
    if (RoamControl.instance) {
      return RoamControl.instance;
    }
    RoamControl.instance = new RoamControl(viewer);
    return RoamControl.instance;
  }

  static destroyInstance() {
    if (RoamControl.instance) {
      RoamControl.instance = null;
    }
  }
  static instance;
  private _next;
  private _state;
  private _viewer;
  private _timeout;
  private _laststop;
  private _lasttime;
  private _resource;
  private _timepassed;
  private _statusCallback; // 状态回调函数
  private _nextStage; // 连续动画
}

export default RoamControl;

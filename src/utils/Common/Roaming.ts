import {
  Resource,
  defined,
  JulianDate,
  SampledPositionProperty,
  Cartographic,
  ClockRange,
  SampledProperty,
  Cartesian3,
  TimeIntervalCollection,
  TimeInterval,
} from 'Cesium';
import markerPNG from '@/assets/images/dtglobe/marker.png';
import { computeDistance, DistanceMode } from '@/utils/Common/Distance';
import { cartographicToCartesian3 } from './Transform';
import { DTScopeEngine } from './Viewer';
import { enableCamera } from '@/utils/Common/CameraControl';

/**
 * @description: 漫游工具类
 */
class Roaming {
  private _roamingTrackEntityId: any = undefined;
  private _startTime: any = undefined; // 动画开始时间
  private _viewer: any = DTScopeEngine.viewer;

  /**
   * @description: 加载漫游路径并启动漫游
   * @param {Object|string} trackData - 漫游路径的 JSON 数据或 JSON 文件的 URL
   * @return {Promise<void>}
   */
  public async load(trackData: any): Promise<void> {
    if (typeof trackData === 'string') {
      // 如果是 URL，通过 Resource.fetchJson 加载
      trackData = await Resource.fetchJson({ url: trackData });
    }

    if (defined(trackData) && trackData.data) {
      const cartesians: Cartesian3[] = []; // 坐标点数组
      const orientations: Cartesian3[] = []; // 朝向数组
      const startTime = JulianDate.fromDate(new Date(2025, 3, 26, 14, 0, 0)); // 动画开始时间
      const duration = 8; // 动画总时长（秒）

      // 遍历路径点，计算笛卡尔坐标和朝向
      trackData.data.forEach((item: any, index: number) => {
        const cartographic = Cartographic.fromDegrees(item.longitude, item.latitude, item.height);
        const cartesian = cartographicToCartesian3(cartographic);
        cartesians.push(cartesian);

        const orientation = new Cartesian3(item.heading || 0, item.pitch || -90, item.roll || 0);
        orientations.push(orientation);
      });

      // 计算路径总长度并分配时间
      let allLength = 0;
      const distances: number[] = [];
      for (let i = 1; i < cartesians.length; i++) {
        const distance = computeDistance(DistanceMode.Straight, cartesians[i - 1], cartesians[i]);
        allLength += distance;
        distances.push(allLength);
      }

      // 添加位置和时间样本
      const positionProperty = new SampledPositionProperty();
      const orientationProperty = new SampledProperty(Cartesian3);

      positionProperty.addSample(startTime, cartesians[0]);
      orientationProperty.addSample(startTime, orientations[0]);

      let accumulatedDistance = 0;
      for (let i = 1; i < cartesians.length; i++) {
        const proportion = distances[i - 1] / allLength;
        const seconds = proportion * duration;
        const time = JulianDate.addSeconds(startTime, seconds, new JulianDate());
        positionProperty.addSample(time, cartesians[i]);
        orientationProperty.addSample(time, orientations[i]);
        accumulatedDistance += distances[i - 1];
      }

      // 添加实体到场景
      const roamingTrackEntity = this._viewer.entities.add({
        availability: new TimeIntervalCollection([
          new TimeInterval({
            start: startTime,
            stop: JulianDate.addSeconds(startTime, duration, new JulianDate()),
          }),
        ]),
        position: positionProperty,
        orientation: orientationProperty,
        billboard: {
          show: true,
          image: markerPNG,
          scale: 0.5,
        },
      });

      this._roamingTrackEntityId = roamingTrackEntity.id;

      // 设置时钟
      this._viewer.clock.startTime = startTime.clone();
      this._viewer.clock.stopTime = JulianDate.addSeconds(startTime, duration, new JulianDate());
      this._viewer.clock.currentTime = startTime.clone();
      this._viewer.clock.clockRange = ClockRange.UNBOUNDED;
      this._viewer.clock.multiplier = 1;
      this._viewer.clock.shouldAnimate = false;
      this._viewer.timeline.zoomTo(startTime, this._viewer.clock.stopTime.clone());

      // 监听时钟更新
      this._viewer.clock.onTick.addEventListener(this.cameraViewListener, this);
    }
  }

  /**
   * @description: 开始漫游
   */
  public start(): void {
    this._viewer.clock.shouldAnimate = true;
  }

  /**
   * @description: 停止漫游
   */
  public stop(): void {
    this._viewer.clock.shouldAnimate = false;
    this._viewer.clock.currentTime = this._startTime.clone(); // 回到起点
    this._viewer.clock.onTick.removeEventListener(this.cameraViewListener);
    enableCamera(); // 恢复默认相机操作
  }

  /**
   * @description: 切换暂停状态
   */
  public switchPause(): void {
    this._viewer.clock.shouldAnimate = !this._viewer.clock.shouldAnimate;
  }

  /**
   * @description: 相机视角更新的监听器
   * @param {Object} tick - 时钟的 tick 事件
   */
  private cameraViewListener = (tick: any): void => {
    if (!this._viewer.clock.shouldAnimate) {
      return;
    }
    const trackEntity = this._viewer.entities.getById(this._roamingTrackEntityId);
    if (trackEntity) {
      const position = trackEntity.position.getValue(tick.currentTime);
      const orientation = trackEntity.orientation.getValue(tick.currentTime);
      this._viewer.camera.setView({
        destination: position,
        orientation: {
          heading: orientation.x,
          pitch: orientation.y,
          roll: orientation.z,
        },
      });
    }
  };
}

export default Roaming;

// import { GeoScene } from '@/components/DTGlobe/index.js';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import TerrainFlatten from './TerrainFlatten';

/**
 * 地形裁剪工具类
 */
class TerrainClip {
  static getInstance() {
    if (!TerrainClip._instance) {
      TerrainClip._instance = new TerrainClip();
    }
    return TerrainClip._instance;
  }

  constructor() {
    DTScopeEngine.getViewer(() => {
      let viewer = DTScopeEngine.viewer;
      // initial canvas handler
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    });
  }
  /**
   * 绑定鼠标事件
   */
  bind() {
    DTScopeEngine.getViewer(() => {
      let viewer = DTScopeEngine.viewer;
      // clear default double click event
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

      // bind mouse left event
      this.handler.setInputAction((event) => {
        let earthPosition = viewer.scene.pickPosition(event.position);
        let ellipsoid = viewer.scene.globe.ellipsoid;
        let position = ellipsoid.cartesianToCartographic(earthPosition);
        console.log(position);
        let lon = (position.longitude * 180) / Math.PI;
        let lat = (position.latitude * 180) / Math.PI;
        if (Cesium.defined(earthPosition)) {
          if (this.activeShapePoints.length === 0) {
            // create Point ------- TODO
            this.floatingPoint = this.createPoint(earthPosition);
            this.points.push(this.floatingPoint);
            this.activeShapePoints.push(earthPosition);
            this.FlattenInfo.push(lon, lat);
            let dynamicPositions = new Cesium.CallbackProperty(() => {
              return new Cesium.PolygonHierarchy(this.activeShapePoints);
            }, false);
            // dynamic Canvas ------- TODO
            this.activeShape = this.drawShape(dynamicPositions); //绘制动态图
          }
          this.activeShapePoints.push(earthPosition);
          this.FlattenInfo.push(lon, lat);
          this.points.push(this.createPoint(earthPosition));
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // bind mouse move event
      this.handler.setInputAction((event) => {
        if (Cesium.defined(this.floatingPoint)) {
          let newPosition = viewer.scene.pickPosition(event.endPosition);
          if (Cesium.defined(newPosition)) {
            this.floatingPoint.position.setValue(newPosition);
            this.activeShapePoints.pop();
            this.activeShapePoints.push(newPosition);

            let ellipsoid = viewer.scene.globe.ellipsoid;
            let position = ellipsoid.cartesianToCartographic(newPosition);
            let lon = (position.longitude * 180) / Math.PI;
            let lat = (position.latitude * 180) / Math.PI;
            this.FlattenInfo.pop();
            this.FlattenInfo.pop();
            this.FlattenInfo.push(lon, lat);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      // bind mouse right event
      this.handler.setInputAction(() => {
        // TODO： 终止形状的绘制
        this.terminateShape(viewer);
        // bind cancel event
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    });
  }

  /**
   * 取消事件的绑定
   */
  unBind() {
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOVE_CLICK);
  }

  /**
   * 清除绘制的地形
   */
  clear() {
    this.flattens.forEach((flatten) => {
      flatten.destory();
    });
    DTScopeEngine.getViewer(() => {
      let viewer = DTScopeEngine.viewer;
      this.points.forEach((point) => {
        viewer.entities.remove(point);
      });
    });
  }

  /////////////////////////////////////////// 基本函数 ///////////////////////////////////////////

  /**
   * 贴地进行点的绘制
   * @param {*} worldPosition
   * @returns {Cesium.Entity}
   */
  createPoint(worldPosition) {
    let viewer = DTScopeEngine.viewer;
    let point = viewer.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.WHITE,
        pixelSize: 5,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
    return point;
  }

  /**
   * 已有点集合图形绘制
   * @param {*} positionData
   * @returns {Cesium.Entity}
   */
  drawShape(positionData) {
    let viewer = DTScopeEngine.viewer;
    let shape = viewer.entities.add({
      polygon: {
        hierarchy: positionData,
        material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.7)),
      },
    });
    return shape;
  }

  /**
   * 终止框选范围的绘制
   * @param {*} viewer
   */
  terminateShape(viewer) {
    if (this.activeShapePoints.length) {
      // this.clipTerrain(new Cesium.PolygonHierarchy(this.activeShapePoints));
      let positions = Cesium.Cartesian3.fromDegreesArray(this.FlattenInfo);
      let flatten = new TerrainFlatten({
        url: 'http://192.168.1.100:8280/四川省_5',
        viewer: viewer,
        points: positions,
        height: 100,
        length: 30,
      });
      flatten.activate();
      this.flattens.push(flatten);
    }
    viewer.entities.remove(this.floatingPoint); //去除动态点图形（当前鼠标点）
    viewer.entities.remove(this.activeShape); //去除动态图形
    this.floatingPoint = undefined;
    this.activeShape = undefined;
    this.activeShapePoints = [];
    this.FlattenInfo = [];
  }
  /////////////////////////////////////////// 开挖数据 ///////////////////////////////////////////
  activeShapePoints = [];
  floatingPoint = undefined;
  activeShape = undefined;
  FlattenInfo = [];
  /////////////////////////////////////////// 待清除的entity ///////////////////////////////////////////
  flattens = [];
  points = [];
}

export default TerrainClip;

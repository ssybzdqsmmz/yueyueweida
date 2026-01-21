/*
 * @Descripttion: 一些常用的三维部分的小函数集合
 * @version: 1.0.0
 * @Author: tmz
 * @Date: 2020-11-23 10:45:01
 * @LastEditors: anganao
 * @LastEditTime: 2024-02-29 19:12:42
 */

export function getCameraViewPoint(viewer) {
  // 获取相机点经纬度
  let camera = viewer.scene.camera;
  let scene = viewer.scene;
  let ellipsoid = scene.globe.ellipsoid;
  let position = camera.position;
  position = ellipsoid.cartesianToCartographic(position);
  let lon = (position.longitude * 180) / Math.PI;
  let lat = (position.latitude * 180) / Math.PI;
  let height = position.height;
  let center = {
    longitude: lon,
    latitude: lat,
    height: height,
  };
  // 计算可视区域
  let rectangle = camera.computeViewRectangle(ellipsoid, new Cesium.Rectangle());
  // 获取相机HPR
  let cameraHPR = {
    heading: camera.heading,
    pitch: camera.pitch,
    roll: camera.roll,
  };
  let viewPoint = [];
  viewPoint.push({
    Position: center,
    Rectangle: rectangle,
    Orientation: cameraHPR,
  });
  let text = '';
  text =
    `"Orientation":{
            "heading":` +
    viewPoint[0].Orientation.heading +
    `,
            "pitch":` +
    viewPoint[0].Orientation.pitch +
    `,
            "roll":` +
    viewPoint[0].Orientation.roll +
    `
          },
          "Position":{
            "longitude": ` +
    viewPoint[0].Position.longitude +
    `,
            "latitude":` +
    viewPoint[0].Position.latitude +
    `,
            "height":` +
    viewPoint[0].Position.height +
    `
          },
          "Rectangle":{
            "west":` +
    viewPoint[0].Rectangle.west +
    `,
            "south":` +
    viewPoint[0].Rectangle.south +
    `,
            "east":` +
    viewPoint[0].Rectangle.east +
    `,
            "north": ` +
    viewPoint[0].Rectangle.north +
    `
          }`;
  console.log(text);
  return viewPoint[0];
}

/**
 * 设置屏幕中心点和相机可视区域
 *
 * @param {*} viewer
 * @param {*} viewPoint
 * @param {*} duration
 * @param {*} callback
 */
export function setCameraViewPoint(viewer, viewPoint, duration, callback) {
  let lon = viewPoint.Position.longitude;
  let lat = viewPoint.Position.latitude;
  let hei = viewPoint.Position.height;
  viewer.scene.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
    orientation: {
      heading: viewPoint.Orientation.heading,
      pitch: viewPoint.Orientation.pitch,
      roll: viewPoint.Orientation.roll,
    },
    easingFunction: Cesium.EasingFunction.LINEAR_NONE,
    duration: duration,
    complete: callback,
  });
  console.log(duration);
}

//获取相机位置以及角度信息
export function GetCameraPosition(viewer) {
  //var viewer = this._viewer;
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  handler.setInputAction(function (lclickment) {
    let scene = viewer.scene;
    let ellipsoid = scene.globe.ellipsoid;
    //var cartesian = LoadCesium.Viewer.camera.pickEllipsoid(lclickment.position, ellipsoid);
    let cartesian = viewer.scene.pickPosition(lclickment.position);
    console.log('笛卡尔坐标:' + cartesian);
    let camera = viewer.camera;
    if (cartesian) {
      let cartographic = ellipsoid.cartesianToCartographic(cartesian);
      let clicklon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
      let clicklat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
      let lon = Cesium.Math.toDegrees(viewer.camera.positionCartographic.longitude).toFixed(7);
      let lat = Cesium.Math.toDegrees(viewer.camera.positionCartographic.latitude).toFixed(7);
      //地理高度
      let clickheight = (cartographic.height + 1).toFixed(2);
      //相机高度
      let height = viewer.camera.positionCartographic.height.toFixed(7);
      //方向   围绕Z轴旋转
      //var heading = Cesium.Math.toDegrees(camera.heading).toFixed(7);
      let heading = camera.heading.toFixed(7);
      //倾斜角度   围绕Y轴旋转
      //var pitch = Cesium.Math.toDegrees(camera.pitch).toFixed(7);
      let pitch = camera.pitch.toFixed(7);
      //围绕X轴旋转
      //var roll = Cesium.Math.toDegrees(camera.roll).toFixed(7);
      let roll = camera.roll.toFixed(7);
      getCameraViewPoint(viewer);
      const cameraInfo = {
        position: {
          longitude: lon,
          latitude: lat,
          height: height,
        },
        roll: roll,
        pitch: pitch,
        heading: heading,
      };
      console.log(JSON.stringify(cameraInfo));
      console.log('鼠标点击经纬度:' + clicklon + ',' + clicklat + ',' + clickheight);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

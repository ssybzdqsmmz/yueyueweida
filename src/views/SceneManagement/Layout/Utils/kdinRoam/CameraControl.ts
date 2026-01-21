/*
 * @Author: Lincong-pro
 * @Date: 2023-04-16 09:08:39
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2024-02-25 16:43:24
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnel\Utils\CameraControl.ts
 * @Description: 此处主要实现相机的控制【缩放、旋转、位移】
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import { DTScopeEngine } from '@/utils/Common/Viewer';
import { ScreenSpaceCameraController, Cartesian3, EasingFunction, Rectangle } from 'Cesium';
import { cartesian3ToCartographic } from '@/utils/Common/Transform';

/**
 * @description: 禁用相机控制
 * @return {void}
 */
const disableCamera = function () {
	const viewer = DTScopeEngine.viewer;
	const cameraController: ScreenSpaceCameraController = viewer.scene.screenSpaceCameraController;
	// disable the default event handler
	cameraController.enableRotate = false;
	cameraController.enableTranslate = false;
	cameraController.enableZoom = false;
	cameraController.enableTilt = false;
	cameraController.enableLook = false;
};

/**
 * @description: 设置屏幕中心点和相机可视区域
 * @param {*} viewer
 * @param {*} viewPoint 视点
 * @param {*} duration 飞行时间
 * @return {Promise}
 */
function setCameraViewPoint(viewer, viewPoint, duration) {
	let lon = viewPoint.Position.longitude;
	let lat = viewPoint.Position.latitude;
	let hei = viewPoint.Position.height;
	return new Promise((resolve, reject) => {
		viewer.scene.camera.flyTo({
			destination: Cartesian3.fromDegrees(lon, lat, hei),
			orientation: {
				heading: viewPoint.Orientation.heading,
				pitch: viewPoint.Orientation.pitch,
				roll: viewPoint.Orientation.roll,
			},
			easingFunction: EasingFunction.LINEAR_NONE,
			duration: duration,
			complete: resolve,
			cancel: reject,
		});
	});
}

/**
 * @description: 获取屏幕中心点和相机可视区域 ViewPoint
 * @param {*} viewer
 * @return {*}
 */
function getCameraViewPoint(viewer) {
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
	let rectangle = camera.computeViewRectangle(ellipsoid, new Rectangle());
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
	return viewPoint[0];
}

/**
 * @description: 启用相机控制
 * @return {void}
 */
const enableCamera = function () {
	const viewer = DTScopeEngine.viewer;
	const cameraController: ScreenSpaceCameraController = viewer.scene.screenSpaceCameraController;
	// enable the default event handler
	cameraController.enableRotate = true;
	cameraController.enableTranslate = true;
	cameraController.enableZoom = true;
	cameraController.enableTilt = true;
	cameraController.enableLook = true;
};
/**
 * @description: 制作窗口抖动效果
 * @return {void}
 */
const windowShake = () => {
	let viewer = DTScopeEngine.viewer;
	let cameraHeight = cartesian3ToCartographic(viewer.camera.position).height;
	let moveRate = cameraHeight / 100;

	const shake = () => {
		// step1
		viewer.camera.moveLeft(moveRate);
		// step2
		setTimeout(() => {
			viewer.camera.moveUp(moveRate);
			// step3
			setTimeout(() => {
				viewer.camera.moveDown(moveRate);
				// step4
				setTimeout(() => {
					viewer.camera.moveRight(moveRate);
				}, 100);
			}, 100);
		}, 100);
	};
	let count = 0;
	let timerId = setInterval(() => {
		++count;
		if (count > 24) {
			clearTimeout(timerId);
		} else {
			shake();
		}
	}, 200);
};

export { disableCamera, enableCamera, windowShake, setCameraViewPoint, getCameraViewPoint };

/*
 * @Author: Lincong-pro
 * @Date: 2024-02-26 15:34:21
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-04-19 08:24:50
 * @FilePath: \Geology-V3\src\views\SceneManagement\Layout\Tools\InitScene.ts
 * @Description: 初始界面场景效果
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import { Viewer, Cartesian3, EasingFunction } from 'Cesium';
import { loadMap } from '@/utils/Maps/MapSource';

function initSubScene(root: any) {
	if ('children' in root) {
		for (let i = 0; i < root.children.length; i++) {
			const child = root.children[i];
			child.topic = root.topic + '_' + child.topic; // 更新当前
			initSubScene(child);
		}
	}
}
export function setCameraViewePoint(
	viewer: Viewer,
	viewPoint: { longitude: number; latitude: number; height: number; heading: number; pitch: number; roll: number },
	duration: number = 0
) {
	return new Promise((resolve, reject) => {
		viewer.scene.camera.flyTo({
			destination: Cartesian3.fromDegrees(viewPoint.longitude, viewPoint.latitude, viewPoint.height),
			orientation: {
				heading: viewPoint.heading,
				pitch: viewPoint.pitch,
				roll: viewPoint.roll,
			},
			easingFunction: EasingFunction.LINEAR_NONE,
			duration: duration, //@ts-ignore
			complete: resolve,
			cancel: reject,
		});
	});
}
/**
 * @description:初始化场景的topic
 * @param {any} jsonArr
 * @return {void}
 */
export function initSceneConfig(jsonArr: any[]) {
	for (let i = 0; i < jsonArr.length; i++) {
		const element = jsonArr[i];
		initSubScene(element);
	}
}


export function adjustLayerAndView(viewer: Viewer) {
	let dtFPS = document.getElementById('dt-fps')
	if (dtFPS) {
		dtFPS.style.top = 'calc(100vh - 40px)';
	}

	setCameraViewePoint(
		viewer,
		{
			longitude: 101.0717210,
			latitude: 30.0639579,
			height: 335037.1090832,
			heading: 6.214474866932576,
			pitch: -1.5678625108818816,
			roll: 0
		},
		2
	);
	return loadMap(viewer);
}

import * as Cesium from 'cesium';
import type { Viewer } from 'cesium';
import { merge } from 'video.js/dist/types/utils/obj';

// 地质群组数据类型
export interface GeologyGroup {
	群组名称: string;
	符号: string;
	代号: string;
	位置: string;
	岩性: string[];
	正层型坐标: string;
	厚度: string;
	上覆地层: string;
	下伏地层: string;
	地质时代: string;
}

// 创建Cesium Viewer
export function createCesiumViewer(containerId: string): Viewer {
	Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YzFkM2YzYi1iMTM4LTQyMzctYjBkNi1iM2UwNmQwY2YwYzgiLCJpZCI6MTg2MDg0LCJpYXQiOjE3MDY4NTY3ODh9.Wq4jXmN2q1mUwvz4c5L8q9r1k0wv4c5L8q9r1k0wv4c';

	return new Cesium.Viewer(containerId, {
		terrainProvider: Cesium.createWorldTerrain(),
		baseLayerPicker: false,
		geocoder: false,
		homeButton: true,
		sceneModePicker: true,
		navigationHelpButton: false,
		animation: false,
		timeline: false,
		fullscreenButton: true,
		infoBox: false,
		shadows: true,
		shouldAnimate: true
	});
}

// 扩展Cesium Entity类型以支持自定义数据存储
declare global {
	namespace Cesium {
		interface Entity {
			groupData?: GeologyGroup; // 允许Entity携带群组数据
		}
	}
}

export async function loadGeologyGroups(viewer: Viewer, groupsData: GeologyGroup[]): Promise<void> {
	return new Promise((resolve) => {
		groupsData.forEach(group => {
			const [longitude, latitude] = group.正层型坐标.split(',').map(Number);
			const position = Cesium.Cartesian3.fromDegrees(longitude, latitude);

			// 创建标签实体（简化包装）
			const labelEntity = viewer.entities.add({
				position,
				label: {
					text: group.群组名称,
					font: '14px sans-serif',
					fillColor: Cesium.Color.WHITE,
					style: Cesium.LabelStyle.FILL_AND_OUTLINE,
					outlineWidth: 2,
					outlineColor: Cesium.Color.BLACK,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					pixelOffset: new Cesium.Cartesian2(0, -30),
					showBackground: true,
					backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.7),
					distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500000)
				},
				// 添加群组数据到标签
				customData: group
			});

			// 创建点实体（修复问题）
			const pointEntity = viewer.entities.add({
				position,
				name: group.群组名称,
				point: {
					pixelSize: 12,
					color: Cesium.Color.fromCssColorString('#e74c3c'),
					outlineColor: Cesium.Color.WHITE,
					outlineWidth: 2,
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
				},
				// 添加群组数据到点
				customData: group
			});
		});

		viewer.camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(103.0, 30.0, 15000000),
			orientation: {
				heading: Cesium.Math.toRadians(0),
				pitch: Cesium.Math.toRadians(-90),
				roll: 0.0
			},
			complete: () => resolve()
		});
	});
}
// 设置群组点击事件
export function setupGroupClickHandler(
	viewer: Viewer,
	onGroupSelect: (group: GeologyGroup | null) => void
): void {
	viewer.screenSpaceEventHandler.setInputAction((click) => {
		const pickedObject = viewer.scene.pick(click.position);
		if (pickedObject && pickedObject.id && pickedObject.id.groupData) {
			const group = pickedObject.id.groupData as GeologyGroup;
			onGroupSelect(group);

			// 飞向选中的群组位置
			const [longitude, latitude] = group.正层型坐标.split(',').map(Number);
			viewer.camera.flyTo({
				destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 50000),
				duration: 1
			});
		} else {
			onGroupSelect(null);
		}
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 飞向指定群组
export function flyToGroup(viewer: Viewer, group: GeologyGroup): void {
	const [longitude, latitude] = group.正层型坐标.split(',').map(Number);
	viewer.camera.flyTo({
		destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 50000),
		duration: 1
	});
}

// 清除所有地质群组
export function clearGeologyGroups(viewer: Viewer): void {
	const entities = viewer.entities.values;
	for (let i = entities.length - 1; i >= 0; i--) {
		if (entities[i].groupData) {
			viewer.entities.remove(entities[i]);
		}
	}
}
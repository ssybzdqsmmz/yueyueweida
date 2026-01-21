/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: 枫林残忆
 * @Date: 2024-03-08 19:28:09
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-25 13:04:35
 * @FilePath: \Geology-V3\src\views\SceneManagement\Layout\Tools\FrameRoam.ts
 * @Description: 借助Cesium插值实现 https://www.liaomz.top/cesium/Apps/Sandcastle/index.html?src=Interpolation.html
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import {
	SampledPositionProperty,
	SampledProperty,
	JulianDate,
	Cartesian3,
	Viewer,
	TimeInterval,
	PolylineGlowMaterialProperty,
	Color,
	ClockRange,
	TimeIntervalCollection,
	Entity,
} from 'Cesium';
import { getCameraViewPoint } from '../Utils/CameraControl';
import WEventBus from './WEventBus';
let eventBus = new WEventBus();

interface Orientation {
	heading: number;
	pitch: number;
	roll: number;
}

interface Position {
	longitude: number;
	latitude: number;
	height: number;
}

interface View {
	name: string;
	ViewPoint: {
		Orientation: Orientation;
		Position: Position;
	};
	duration: number;
	img: string;
	uuid: string;
}

export default class FrameRoam {
	constructor(viewer: Viewer, viewports: View[], isLooped: boolean) {
		this.viewer = viewer;
		const positionProperty = new SampledPositionProperty();
		const headingProperty = new SampledProperty(Cartesian3);
		const startTime = JulianDate.fromDate(new Date(2024, 3, 8));
		let allSeconds = 0;

		const { Position, Orientation } = getCameraViewPoint(viewer);
		const initTime = JulianDate.addSeconds(startTime, 0, new JulianDate());
		const initPosition = Cartesian3.fromDegrees(Position.longitude, Position.latitude, Position.height);
		const initHeading = new Cartesian3(Orientation.heading, Orientation.pitch, Orientation.roll);

		positionProperty.addSample(initTime, initPosition); // 将当前位置作为初始化的一部分
		headingProperty.addSample(initTime, initHeading);


		let beforeHeading = viewports[0].ViewPoint.Orientation.heading; // 解决因 heading 过大导致的相机自动偏转问题
		let curHeading = beforeHeading;


		viewports.forEach((view: View) => {
			let midTime = allSeconds + view.duration / 2;
			curHeading = view.ViewPoint.Orientation.heading;
			// 大角度（不平滑）
			if (Math.abs(curHeading - beforeHeading) > Math.PI) {
				console.log(curHeading, beforeHeading)
				const time1 = JulianDate.addSeconds(startTime, midTime + 0.0000001, new JulianDate()); // 改变内插函数
				const time2 = JulianDate.addSeconds(startTime, midTime + 0.0000003, new JulianDate());
				// const position = Cartesian3.fromDegrees(view.ViewPoint.Position.longitude, view.ViewPoint.Position.latitude, view.ViewPoint.Position.height);
				const heading1 = new Cartesian3(Math.PI * 2, view.ViewPoint.Orientation.pitch, view.ViewPoint.Orientation.roll);
				const heading2 = new Cartesian3(0, view.ViewPoint.Orientation.pitch, view.ViewPoint.Orientation.roll);

				headingProperty.addSample(time1, heading1);
				headingProperty.addSample(time2, heading2);


			}
			beforeHeading = curHeading



			allSeconds += view.duration;

			const time = JulianDate.addSeconds(startTime, allSeconds, new JulianDate());
			const position = Cartesian3.fromDegrees(view.ViewPoint.Position.longitude, view.ViewPoint.Position.latitude, view.ViewPoint.Position.height);
			const heading = new Cartesian3(view.ViewPoint.Orientation.heading, view.ViewPoint.Orientation.pitch, view.ViewPoint.Orientation.roll);

			positionProperty.addSample(time, position);
			headingProperty.addSample(time, heading);
		});

		const stopTime = JulianDate.addSeconds(startTime, allSeconds, new JulianDate());
		this.allSeconds = allSeconds;
		this.startTime = startTime;

		viewer.clock.startTime = startTime.clone();
		viewer.clock.stopTime = stopTime.clone();
		viewer.clock.currentTime = startTime.clone();
		if (isLooped) {
			viewer.clock.clockRange = ClockRange.LOOP_STOP;
		} else {
			viewer.clock.clockRange = ClockRange.CLAMPED;
		}
		viewer.clock.multiplier = 1;

		viewer.timeline.zoomTo(startTime, stopTime);
		//@ts-ignore
		this.entity = viewer.entities.add({
			availability: new TimeIntervalCollection([new TimeInterval({ start: startTime, stop: stopTime })]),
			position: positionProperty,
			orientation: headingProperty,
		});
		this.setCameraViewBind = this.setCameraView.bind(this);
		this.setEndTrickBind = this.setEndTrick.bind(this);

		eventBus.on('ChangeProgressClock', (progress) => {
			viewer.clock.currentTime = JulianDate.addSeconds(startTime, progress * allSeconds, new JulianDate()); // 定位到指定的时间
		});
		viewer.clock.onTick.addEventListener(this.setCameraViewBind); //@ts-ignore
		viewer.clock.onStop.addEventListener(this.setEndTrickBind);
	}

	setCameraView(tick) {
		let position = this.entity.position.getValue(tick.currentTime); //@ts-ignore
		let orientation = this.entity.orientation.getValue(tick.currentTime);
		if (typeof orientation == 'undefined') {
			return;
		}

		let progress = JulianDate.secondsDifference(tick.currentTime, this.startTime) / this.allSeconds;

		this.viewer.camera.setView({
			destination: position,
			orientation: {
				heading: orientation.x,
				pitch: orientation.y,
				roll: orientation.z,
			},
		});
		// 处于暂停状态，不需要更新
		if (this.viewer.clock.shouldAnimate) {
			eventBus.emit('ChangeProgress', progress); // 更新当前进度
		}
	}

	setEndTrick() {
		if (this.viewer.clock.clockRange == ClockRange.CLAMPED) {
			this.viewer.clock.onTick.removeEventListener(this.setCameraViewBind);
			this.viewer.clock.onTick.removeEventListener(this.setEndTrickBind);
			this.destroy();
			eventBus.emit('ChangeProgress', 0); // 更新当前进度
			eventBus.emit('CLAMPED');
		}
	}

	start() {
		this.viewer.clock.shouldAnimate = true;
	}

	pause(isPause) {
		// 用户按下停止->清除监听器
		this.viewer.clock.shouldAnimate = !isPause;
	}

	destroy() {
		this.viewer.clock.onTick.removeEventListener(this.setCameraViewBind);
		this.viewer.clock.onTick.removeEventListener(this.setEndTrickBind);
		this.viewer.entities.remove(this.entity);
		this.viewer.clock.shouldAnimate = false;
		this.entity = undefined;
	}

	isDestroyed() {
		return typeof this.entity === 'undefined';
	}

	viewer: Viewer;
	entity: Entity;
	startTime: JulianDate;
	allSeconds: number;

	setCameraViewBind: any;
	setEndTrickBind: any;
}

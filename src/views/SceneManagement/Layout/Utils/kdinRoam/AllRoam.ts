/*
 * @Author: anganao 1928882425@qq.com
 * @Date: 2024-03-20 20:18:22
 * @LastEditors: anganao 1928882425@qq.com
 * @LastEditTime: 2024-03-28 09:03:15
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Utils\kdinRoam\AllRoam.ts
 * @Description: 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * 
 */
import * as Cesium from 'Cesium';
class AllRoam {
	viewer = undefined;
	data = undefined;
	cameraCallback = undefined;
	keyCallback = undefined;
	distIndex = []; // 根据两点之间的距离计算使用事件
	speed = 50;
	next = 0;
	constructor(viewer) {
		this.viewer = viewer;
	}
	startRoam(json = undefined) {
		if (json) {
			this.data = json;
		}
		// 飞到起始位置
		this.viewer.camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(this.data[0].ViewPoint.Position.longitude, this.data[0].ViewPoint.Position.latitude, this.data[0].ViewPoint.Position.height),
			orientation: {
				heading: this.data[0].ViewPoint.Orientation.heading,
				pitch: this.data[0].ViewPoint.Orientation.pitch,
				roll: this.data[0].ViewPoint.Orientation.roll,
			},
			complete: this.roamAnimate()
		})
	}


	roamAnimate() {
		this.keyBind()


		setTimeout(() => {
			let start = Cesium.JulianDate.fromDate(new Date(2024, 3, 30));
			//计算物体位置
			let sampler = new Cesium.SampledPositionProperty();
			sampler.setInterpolationOptions({
				interpolationDegree: 2,
				interpolationAlgorithm: Cesium.LinearApproximation
			});
			for (let i = 0; i < this.data.length; i++) {
				if (i === 0) {
					this.distIndex[0] = 0;
					let time = Cesium.JulianDate.addSeconds(start, 0, new Cesium.JulianDate());
					let position = Cesium.Cartesian3.fromDegrees(this.data[i].ViewPoint.Position.longitude, this.data[i].ViewPoint.Position.latitude, this.data[i].ViewPoint.Position.height);
					sampler.addSample(time, position);
					continue;
				}
				const left = Cesium.Cartesian3.fromDegrees(
					this.data[i - 1].ViewPoint.Position.longitude,
					this.data[i - 1].ViewPoint.Position.latitude,
					this.data[i - 1].ViewPoint.Position.height
				);
				const right = Cesium.Cartesian3.fromDegrees(this.data[i].ViewPoint.Position.longitude, this.data[i].ViewPoint.Position.latitude, this.data[i].ViewPoint.Position.height)
				let dist = Cesium.Cartesian3.distance(left, right);
				this.distIndex[i] = this.distIndex[i - 1] + dist;
				let time = Cesium.JulianDate.addSeconds(start, this.distIndex[i], new Cesium.JulianDate());
				let position = right;
				sampler.addSample(time, position);

			}
			let samplerH = this.getSampler('heading');
			let samplerP = this.getSampler('pitch');
			let samplerR = this.getSampler('roll');

			// 添加摄像机回调, 不断重绘
			this.cameraCallback = () => {
				let current = this.viewer.clock.currentTime;
				this.viewer.scene.camera.setView({
					destination: sampler.getValue(current),
					orientation: {
						heading: samplerH.getValue(current),
						pitch: samplerP.getValue(current),
						roll: samplerR.getValue(current)
					}
				})
			}
			this.viewer.scene.preUpdate.addEventListener(this.cameraCallback)

			//this.viewer.trackedEntity = polyLine;
			// 计算时间
			let stop = Cesium.JulianDate.addSeconds(start, this.distIndex[this.data.length - 1], new Cesium.JulianDate());
			this.viewer.clock.startTime = start.clone();
			this.viewer.clock.stopTime = stop.clone();
			this.viewer.clock.currentTime = start.clone();
			this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
			this.viewer.clock.multiplier = this.speed;
			this.viewer.clock.shouldAnimate = true;
			console.log(this.distIndex)
		}, 3000);
		//this.viewer.trackedEntity = polyLine;
	}

	// 隧道数据只有位置信息，为其添上方位
	dataWithoutHPR(posData) {
		let res = [];
		let center = this.viewer.camera.position;
		for (let i = 0; i < posData.length; i++) {
			let target = Cesium.Cartesian3.fromDegrees(posData[i][0], posData[i][1], posData[i][2]);
			let heading = this.getHeading(center, target);
			let pitch = this.getPitch(center, target);
			res.push({
				ViewPoint: {
					Position: {
						longitude: posData[i][0],
						latitude: posData[i][1],
						height: posData[i][2] - 7
					},
					Orientation: {
						heading: heading + 0.1,
						pitch: pitch + 0.2,
						roll: 0.0
					}
				}
			})
		}
		return res;
	}
	// 空格暂停事件
	keyBind() {
		this.keyCallback = (ev) => {
			if (ev.code == 'Space') {
				if (this.viewer.clock.shouldAnimate) {
					this.viewer.clock.shouldAnimate = false;
					this.viewer.scene.preUpdate.removeEventListener(this.cameraCallback)
				} else {
					this.viewer.clock.shouldAnimate = true;
					this.viewer.scene.preUpdate.addEventListener(this.cameraCallback)
				}
			}
		}
		document.addEventListener('keyup', this.keyCallback);
	}
	// 清除所有数据和设置
	clear() {
		if (this.keyCallback) {
			document.removeEventListener('keyup', this.keyCallback);
		}
		if (this.cameraCallback) {
			this.viewer.scene.preUpdate.removeEventListener(this.cameraCallback)
		}
		this.data = undefined;
		this.cameraCallback = undefined;
		this.keyCallback = undefined;
		this.speed = 50;
	}
	// 设置sampler, 对heading, pitch, roll取样
	getSampler(type) {
		// 创建sampler
		let sampler = new Cesium.SampledProperty(Number);
		sampler.setInterpolationOptions({
			interpolationDegree: 2,
			interpolationAlgorithm: Cesium.LinearApproximation
		});
		// 后面比前面大的时候暂不考虑
		const limiter = (degFro, degNow, i) => {
			const limit = Math.PI;
			if (Math.abs(degNow - degFro) > limit) {
				const degMid = limit * 2;
				const time = this.distIndex[i] - this.distIndex[i - 1];
				const timeO = degNow / ((degMid - degFro) + degNow) * time;
				sampler.addSample(Cesium.JulianDate.addSeconds(start, this.distIndex[i - 1] + timeO, new Cesium.JulianDate()), degMid);
				sampler.addSample(Cesium.JulianDate.addSeconds(start, this.distIndex[i - 1] + timeO + 0.0000001, new Cesium.JulianDate()), 0);
				sampler.addSample(Cesium.JulianDate.addSeconds(start, this.distIndex[i], new Cesium.JulianDate()), degNow);
			} else {
				sampler.addSample(Cesium.JulianDate.addSeconds(start, this.distIndex[i], new Cesium.JulianDate()), degNow);
			}
		}

		let start = Cesium.JulianDate.fromDate(new Date(2024, 3, 30));

		for (let i = 0; i < this.data.length; i++) {
			if (i === 0) {
				let time = Cesium.JulianDate.addSeconds(start, this.distIndex[i] / this.speed, new Cesium.JulianDate());
				sampler.addSample(time, this.data[i].ViewPoint.Orientation[type]);
				continue;
			}
			limiter(this.data[i - 1].ViewPoint.Orientation[type], this.data[i].ViewPoint.Orientation[type], i)
		}
		return sampler;
	}
	getHeading(pointA, pointB) {
		//建立以点A为原点，X轴为east,Y轴为north,Z轴朝上的坐标系
		const transform = Cesium.Transforms.eastNorthUpToFixedFrame(pointA);
		//向量AB
		const positionvector = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
		//因transform是将A为原点的eastNorthUp坐标系中的点转换到世界坐标系的矩阵
		//AB为世界坐标中的向量
		//因此将AB向量转换为A原点坐标系中的向量，需乘以transform的逆矩阵。
		const vector = Cesium.Matrix4.multiplyByPointAsVector(
			Cesium.Matrix4.inverse(transform, new Cesium.Matrix4()),
			positionvector,
			new Cesium.Cartesian3()
		);
		//归一化
		const direction = Cesium.Cartesian3.normalize(vector, new Cesium.Cartesian3());
		//heading
		const heading = Math.atan2(direction.y, direction.x) - Cesium.Math.PI_OVER_TWO;
		return Cesium.Math.TWO_PI - Cesium.Math.zeroToTwoPi(heading);
	}

	getPitch(pointA, pointB) {
		let transfrom = Cesium.Transforms.eastNorthUpToFixedFrame(pointA);
		const vector = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
		let direction = Cesium.Matrix4.multiplyByPointAsVector(Cesium.Matrix4.inverse(transfrom, transfrom), vector, vector);
		Cesium.Cartesian3.normalize(direction, direction);
		//因为direction已归一化，斜边长度等于1，所以余弦函数等于direction.z
		return Cesium.Math.PI_OVER_TWO - Cesium.Math.acosClamped(direction.z);
	}
	getCameraViewPoint(viewer) {
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
		return viewPoint[0];
	}
}
export default AllRoam;
/*
 * @Author: changfanhao
 * @Date: 2023-03-23 16:50:01
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-20 09:14:59
 * @FilePath: \Geology-V3\src\utils\CesiumFunc\CesiumFunc.ts
 * @Description:使用原生cesium写的函数可以放在此类中
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */

import {
	GeometryInstance,
	PolygonGeometry,
	PolygonHierarchy,
	Cartesian3,
	ColorGeometryInstanceAttribute,
	Color,
	PerInstanceColorAppearance,
	GroundPrimitive,
	Primitive,
	PolylineGeometry,
	ShowGeometryInstanceAttribute,
	PolylineColorAppearance,
	Resource,
	ClassificationType,
} from 'Cesium';
import colormap from 'colormap'; //@ts-ignore
import { TRAJECTORY_BUFFER_URL, ROAD_BUFFER_URL, BUILDING_BUFFER_URL, TRAJECTORY_POINT_URL } from '@/api/url';

import { DTScopeEngine } from '../Common/Viewer';

class CesiumFunc {
	/**
	 * @description: 透明单例
	 */
	constructor() {
		if (!CesiumFunc._instance) {
			CesiumFunc._instance = this;
			this._primitives = [];
			this._colors = colormap({
				colormap: 'YIOrRd',
				nshades: 10,
				format: 'hex',
				alpha: 1,
			});
		}
		return CesiumFunc._instance;
	}

	/**
	 * @description: 加载场景数据
	 * @return {Promise} 执行完成之后开始闪烁
	 * 只能调用一次
	 */
	load() {
		return Promise.all([
			this.loadBuilding(BUILDING_BUFFER_URL),
			this.loadBuffer(ROAD_BUFFER_URL, '#ff0000'),
			this.loadBuffer(TRAJECTORY_BUFFER_URL, '#ffff00'),
		]);
	}

	/**
	 * @description: 房屋闪烁
	 * @return {void}
	 */
	houseFlash() {
		let startIndex = 0;
		let timerId = setInterval(() => {
			++startIndex;
			if (startIndex > 10) {
				clearInterval(timerId);
				return;
			}
			if (startIndex % 2 == 0) {
				this._flashPrimitive.show = false;
				this._normalPrimitive.show = true;
			} else {
				this._flashPrimitive.show = true;
				this._normalPrimitive.show = false;
			}
		}, 1000);
	}

	/**
	 * @description: 三维体的显示
	 * @return {void}
	 */
	activate() {
		this._primitives.forEach((primitive) => {
			primitive.show = true;
		});
		this._normalPrimitive.show = true;
		this._flashPrimitive.show = false;
	}

	/**
	 * @description: 三维体的隐藏
	 * @return {void}
	 */
	deactivate() {
		this._primitives.forEach((primitive) => {
			primitive.show = false;
		});
		this._normalPrimitive.show = false;
		this._flashPrimitive.show = false;
	}

	/**
	 * @description: 释放内存
	 * @return {void}
	 */
	destroy() {
		let viewer = DTScopeEngine.viewer;
		this._primitives.forEach((primitive) => {
			viewer.scene.primitives.remove(primitive);
		});
		viewer.scene.primitives.remove(this._flashPrimitive);
		viewer.scene.primitives.remove(this._normalPrimitive);
		this._primitives = [];
	}

	/**
	 * @description: step1 加载房屋
	 * @param {string} url
	 * @return {void}
	 */
	async loadBuilding(url: string) {
		const buildingBuffer = JSON.parse(await Resource.fetch({ url: url }));
		const geometrys = this.obj2array(buildingBuffer, 0);
		const extruds = [];
		const colorMap = [];

		for (let i = 0; i < geometrys.length; i++) {
			//注意挤出的参数不是长度，而是挤出面和椭球面的距离
			extruds.push(geometrys[i][geometrys[i].length - 3] + geometrys[i][2]);
			colorMap.push(geometrys[i][geometrys[i].length - 2]); // get the degree of influence
			geometrys[i] = geometrys[i].slice(0, geometrys[i].length - 3); // update the geometry
		}
		this.drawJsonPolygonWithColorMap(geometrys, 1, colorMap, extruds, false);
		this.drawJsonPolygonWithColorMap(geometrys, 1, colorMap, extruds, true);
	}

	/**
	 * @description: step2 加载道路缓冲区
	 * @param {string} url
	 * @param {string} color 十六进制颜色字符串
	 * @return {void}
	 */
	async loadBuffer(url: string, color: string) {
		const buffer = JSON.parse(await Resource.fetch({ url: url }));
		const geometrys = this.obj2array(buffer);
		this.drawJsonPolygon(geometrys, 0.5, color);
	}
	//! ////////////////////////// 绘制辅助函数 //////////////////////////
	/**
	 * @description: 绘制师姐特定数据结构的多边形
	 * @param {Array[]} jsonData 坐标数组(二维数组，排列顺序为[[lon,lat,lon,lat]])
	 * @param {number} alpha 透明度
	 * @param {Array<number>} colorMap 颜色映射表
	 * @param {number} extrude 面挤出高度
	 * @param {boolean} normal 是否是正常显示的颜色
	 * @return {void}
	 */
	drawJsonPolygonWithColorMap(jsonData, alpha, colorMap, extrude, normal = true) {
		// compute color map
		let max = Math.max(...colorMap);

		let viewer = DTScopeEngine.viewer;
		const instances = [];
		for (let i = 0; i < jsonData.length; i++) {
			let color = undefined;
			let redDegree = Math.ceil((colorMap[i] / max) * 10); // 红色程度
			if (redDegree == 0) {
				color = Color.fromBytes(13, 104, 18, alpha);
			} else {
				if (normal) {
					color = Color.fromCssColorString(this._colors[redDegree - 1]).withAlpha(alpha);
				} else {
					color = Color.fromBytes(255, 255, 255, alpha);
				}
			}
			let instance = this.createPolygonGeometryInstance(jsonData[i], color, extrude[i]);
			instances.push(instance);
		}
		const primitiveOptions = {
			geometryInstances: instances,
			appearance: new PerInstanceColorAppearance({
				translucent: false, //半透明
				flat: true, //在着色器中使用平面阴影，不考虑光照
			}),
		};

		const primitive = new Primitive(primitiveOptions);
		viewer.scene.primitives.add(primitive);
		if (normal) {
			this._normalPrimitive = primitive;
		} else {
			this._flashPrimitive = primitive;
			this._flashPrimitive.show = false;
		}
	}

	/**
	 * @description: 使用单一颜色创建polygon
	 * @param {number[]} jsonData
	 * @param {number} alpha
	 * @param {string} color 十六进制字符串
	 * @return {void}
	 */
	drawJsonPolygon(jsonData, alpha, color) {
		let viewer = DTScopeEngine.viewer;
		const instances = [];
		let _color = Color.fromCssColorString(color).withAlpha(alpha);
		for (let i = 0; i < jsonData.length; i++) {
			let instance = this.createPolygonGeometryInstance(jsonData[i], _color);
			instances.push(instance);
		}
		const primitiveOptions = {
			geometryInstances: instances,
			appearance: new PerInstanceColorAppearance({
				translucent: false, //半透明
				flat: true, //在着色器中使用平面阴影，不考虑光照
			}),
			classificationType: ClassificationType.TERRAIN,
		};

		//If not extrude, use ground primitive, because groundprimitive does not support extrusion
		const primitive = new GroundPrimitive(primitiveOptions);
		viewer.scene.primitives.add(primitive);
		this._primitives.push(primitive);
	}

	/**
	 * @description: 绘制师姐特定数据结构的多边形
	 * @param {Array[]} jsonData 坐标数组(二维数组，排列顺序为[[lon,lat,lon,lat]])
	 * @param {string} color 十六进制字符串
	 * @param {number} alpha
	 * @return {void}
	 */
	drawJsonPolyline(jsonData, color: string, alpha) {
		let viewer = DTScopeEngine.viewer;
		const instances = [];
		for (let i = 0; i < jsonData.length; i++) {
			const instance = new GeometryInstance({
				geometry: new PolylineGeometry({
					positions: Cartesian3.fromDegreesArrayHeights(jsonData[i]),
					width: 1,
				}),
				attributes: {
					color: ColorGeometryInstanceAttribute.fromColor(Color.fromCssColorString(color).withAlpha(alpha)),
					show: new ShowGeometryInstanceAttribute(true),
				},
			});
			instances.push(instance);
		}
		const primitive = new Primitive({
			geometryInstances: instances,
			appearance: new PolylineColorAppearance(),
		});

		viewer.scene.primitives.add(primitive);
		this._primitives.push(primitive);
	}

	/**
	 * @description: 创建PolygonGeometry实例
	 * @param {number} data 坐标数据
	 * @param {Color} color 颜色
	 * @param {number} extrude 挤出高度
	 * @return {GeometryInstance}
	 */
	createPolygonGeometryInstance(data: number[], color: Color, extrude = null) {
		const instance = new GeometryInstance({
			geometry: new PolygonGeometry({
				polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArrayHeights(data)),
				extrudedHeight: extrude == null ? 0 : extrude,
				perPositionHeight: true,
			}),
			attributes: {
				color: ColorGeometryInstanceAttribute.fromColor(color),
			},
		});
		return instance;
	}

	/**
	 * @description: json对象转化为数组
	 * @param {any} data
	 * @param {number} size
	 * @return {*}
	 */
	obj2array(data: any, size: number = 2): Array<Array<number>> {
		const geometry = data.data;
		let arrayData = new Array();
		//第一层，几何体个数
		for (let element of geometry) {
			//第二层，将每个几何体的xy转为数组
			let elementArray = new Array();
			for (let i = 0, j = 0; i < element.length; i++, j += size) {
				// elementArray.push(element[i].x, element[i].y);
				let values = Object.values(element[i]);
				//取xy两个
				if (size == 2) {
					elementArray.push(values[0], values[1], 0);
					continue;
				}
				//房屋的特殊情况
				if (size == 0) {
					elementArray.push(values[0], values[1], element[element.length - 1].z + 5); //高度太矮了，加10m
					continue;
				}
				//取xyz三个
				elementArray.push(values[0], values[1], values[2]);
			}
			arrayData.push(elementArray);
		}
		return arrayData;
	}

	//! ////////////////////////// 属性 //////////////////////////
	private _primitives; // store the primitives
	private _flashPrimitive; // affected houses
	private _normalPrimitive; // normal houses
	private _colors;
	private static _instance = undefined;
}

export default CesiumFunc;

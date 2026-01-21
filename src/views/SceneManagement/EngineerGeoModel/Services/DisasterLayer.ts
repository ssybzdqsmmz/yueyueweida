/*
 * @Author: Lincong-pro
 * @Date: 2024-02-27 11:11:57
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-20 09:13:47
 * @FilePath: \Geology-V3\src\views\SceneManagement\EngineerGeoModel\Services\DisasterLayer.ts
 * @Description:控制地灾场景
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import { Viewer, GeoJsonDataSource, Color, DataSource } from 'Cesium'; //@ts-ignore
import { disasterMap, disasterColorMap } from './ServiceProperties';
import EventBus from '../Utils/EventBus';

/**
 * @description: 加载geojson数据
 * @param {Viewer} viewer
 * @param {string} url
 * @param {Color} color
 * @return {DataSource}
 */
function loadGeojson(viewer: Viewer, url: string, color: Color) {
	return viewer.dataSources.add(
		GeoJsonDataSource.load(url, {
			fill: color,
			clampToGround: true,
		})
	);
}
/**
 * @description: 创建图层并返回一个垃圾处理函数
 * @param {Viewer} viewer
 * @param {string} topic
 * @return {*}
 */
export function createDisasterLayers(viewer: Viewer, topic: string) {
	let dataSources = [];
	let eventBus = new EventBus();
	eventBus.addExcludeFilter(topic); // 不走过滤器

	disasterMap.forEach((url, key) => {
		loadGeojson(viewer, url, disasterColorMap.get(key)).then((dataSource) => {
			eventBus.on(topic, ({ status, name }) => {
				if (name == key) {
					dataSource.show = status;
				}
			});
			dataSources.push(dataSource);
		});
	});

	return () => {
		for (let i = 0; i < dataSources.length; i++) {
			let dataSource = dataSources[i];
			let result = viewer.dataSources.remove(dataSource, true);
			if (!result) {
				console.log('Removing dataSource:', dataSource, result);
			}
		}
	};
}

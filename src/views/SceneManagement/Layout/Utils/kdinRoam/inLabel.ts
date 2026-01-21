/*
 * @Author: anganao 1928882425@qq.com
 * @Date: 2024-03-28 09:05:24
 * @LastEditors: anganao 1928882425@qq.com
 * @LastEditTime: 2024-04-09 09:14:49
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Utils\kdinRoam\InLabel.ts
 * @Description: 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * 
 */
/**
 * @description: 加载Building的标签
 * @param viewer
 * @return {buildingctner} 让用户关闭标签
 */
import { Viewer, ScreenSpaceEventHandler, Cartesian3, GeometryInstance, PolygonGeometry, PolygonHierarchy } from 'Cesium';
import scenesBuilding from './scenes-building.json';
import { ScenesContainer } from './ScenesContainer';
class loadBLabel {
	buildingctner = undefined;
	viewer = undefined;
	entity = undefined;
	constructor(viewer: Viewer) {
		this.viewer = viewer;
		this.buildingctner = new ScenesContainer({
			handler: new ScreenSpaceEventHandler(viewer.canvas),
			type: ScenesContainer.LabelType.Custom,
			jsonData: scenesBuilding,
			scenes: [],
		});
		this.entity = this.addLabel();
	}
	async addLabel() {
		this.buildingctner.initialize();
		await this.buildingctner.create(this.viewer);
		this.buildingctner.activate(this.viewer, 0);
		return Promise.resolve(this.buildingctner);
	}
	clearLabel(sceneName) {

		loadBLabel.scenes = loadBLabel.scenes.filter((item) => {
			return item !== sceneName;
		})
		if (loadBLabel.scenes.length <= 0) {
			this.entity.then(res => {
				res.destroy(this.viewer);
			})
			loadBLabel.single = undefined;
		}

	}
	static single = undefined;
	static scenes = [];
	static loadBLabelSingle(viewer, sceneName) {
		if (loadBLabel.single === undefined) {
			loadBLabel.single = new loadBLabel(viewer);
		}
		if (!loadBLabel.scenes.includes(sceneName)) {
			loadBLabel.scenes.push(sceneName);
		}
		return loadBLabel.single;
	}
}

export default loadBLabel;

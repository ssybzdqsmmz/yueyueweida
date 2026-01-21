/*
 * @Author: 枫林残忆 2997534654@qq.com
 * @Date: 2024-03-04 07:30:04
 * @LastEditors: anganao 1928882425@qq.com
 * @LastEditTime: 2024-03-28 10:17:24
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnelOut\Utils\BuildingLabel.ts
 * @Description: 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * 
 */
import * as Cesium from 'Cesium';
export default class BuildingLabel {
	viewer = undefined;
	labelControl = undefined;
	constructor(viewer) {
		this.viewer = viewer;
	}
	loadLabel(host, url) {
		Cesium.Resource.fetch({
			url: host + url,
		}).then((res) => {
			const marks = [];
			res = JSON.parse(res);
			res.forEach((element) => {
				const coord = element.coord;
				marks.push({
					position: Cesium.Cartesian3.fromDegrees(coord[0], coord[1], coord[2]),
					text: element.name,
					height: 15,
					imagData: {
						topIcon: 'img/top.png',
						bodyIcon: 'img/blueline.png',
						backIcon: 'img/pointBack.png',
						isRoate: false,
						color: [25 / 255, 255 / 255, 236 / 255, 1],
					},
				});
			});
			// label控制
			this.labelControl = this.viewer.scene.primitives.add( //@ts-ignore
				new Cesium.DTMarkIcons({
					marks: marks,
					markSize: 5,
					bodyLen: 5,
				})
			);
		});
	}
	clearLabel(sceneName) {
		BuildingLabel.scenes = BuildingLabel.scenes.filter((item) => {
			return item !== sceneName;
		})
		if (BuildingLabel.scenes.length <= 0) {
			if (this.labelControl !== undefined) {
				this.labelControl.destroy();
			}
			BuildingLabel.single = undefined;
		}

	}
	static single = undefined;
	static scenes = [];
	static loadBLabelSingle(viewer, host, url, sceneName) {
		if (BuildingLabel.single === undefined) {
			BuildingLabel.single = new BuildingLabel(viewer);
			BuildingLabel.single.loadLabel(host, url)
		}
		if (!BuildingLabel.scenes.includes(sceneName)) {
			BuildingLabel.scenes.push(sceneName);
		}
		return BuildingLabel.single;
	}
}

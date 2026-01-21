/*
 * @Author: anganao
 * @Date: 2024-03-05 19:13:39
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-20 09:10:34
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnel\Utils\BuildingLabel.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
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
					height: 10,
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
			this.labelControl = this.viewer.scene.primitives.add(     //@ts-ignore
				new Cesium.DTMarkIcons({
					marks: marks,
					markSize: 20,
					bodyLen: 10,
				})
			);
		});
	}
}

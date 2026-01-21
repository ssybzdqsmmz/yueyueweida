/*
 * @Author: anganao 1928882425@qq.com
 * @Date: 2024-04-14 10:21:41
 * @LastEditors: Lincong-pro lincong_pro@163.com
 * @LastEditTime: 2024-05-06 12:59:11
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Utils\TunnelBridgeIcon.ts
 * @Description:
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 *
 */
import * as Cesium from 'Cesium';
import { ipServer } from '../Service/ServiceProperties'
import dataPath from '../Config/kmlLayer.json'
import bIcon from '../Assets/img/bridge.png';
import tIcon from '../Assets/img/tunnel.png';
import axios from 'axios';


export default class TBIcon {
	viewer = undefined;
	constructor(viewer) {
		this.viewer = viewer;
	}
	async loadIcon(url) {
		let kml = await Cesium.KmlDataSource.load(
			`${ipServer}/${dataPath[1].url}`,
			{
				camera: this.viewer.scene.camera,
				canvas: this.viewer.scene.canvas
			}
		)
		// console.log(kml.entities.entities)
		// let kmlDataSource = this.viewer.dataSources.getByName(dataPath[1].name);
		// console.log(kmlDataSource)
		let billboard = this.viewer.scene.primitives.add(
			new Cesium.BillboardCollection()
		);
		billboard.add({
			position: Cesium.Cartesian3.fromDegrees(101, 32, 10),
			image: bIcon,
			scaleByDistance: new Cesium.NearFarScalar(0.0, 0.6, 10000000.0, 0.0)
		})
		billboard.add({
			position: Cesium.Cartesian3.fromDegrees(101, 34, 10),
			image: tIcon,
			scale: 1.0
		})
	}
}
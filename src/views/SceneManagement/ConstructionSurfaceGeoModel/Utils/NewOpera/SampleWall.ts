/*
 * @Author: WouRaoyu
 * @Date: 2021-04-24 13:41:27
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-20 09:14:47
 * @Description: file content
 */
import * as Cesium from 'Cesium';
import * as turf from '@turf/turf';

export default {
	SamplePntsA(positions, distances) {
		let results = new Array();
		let p_start = positions[0];
		let iterator = 1; // 存储当前点位序列 用于更新下一个点
		distances.forEach((element) => {
			let wall_obj = {
				color: element.color,
				pnts: new Array(),
			};
			wall_obj.pnts.push(p_start.clone());
			let p_next = positions[iterator];
			let disp2p = Cesium.Cartesian3.distance(p_start, p_next);
			let disele = element.distance;
			let p_update = undefined;
			if (disp2p > disele) {
				const percent = disele / disp2p;
				p_update = Cesium.Cartesian3.lerp(p_start, p_next, percent, new Cesium.Cartesian3());
				wall_obj.pnts.push(p_update.clone());
			} else {
				wall_obj.pnts.push(p_next.clone());
				while (disele > disp2p) {
					p_start = p_next;
					p_next = positions[++iterator];
					let distance = Cesium.Cartesian3.distance(p_start, p_next);
					disp2p += distance;
					if (disp2p > disele) {
						const percent = 1 - (disp2p - disele) / distance;
						p_update = Cesium.Cartesian3.lerp(p_start, p_next, percent, new Cesium.Cartesian3());
						wall_obj.pnts.push(p_update.clone());
					} else {
						wall_obj.pnts.push(p_next.clone());
					}
				}
			}
			results.push(wall_obj);
			p_start = p_update;
		});
		return results;
	},

	SamplePntsB(positions, distances, step = 10) {
		let preprocess = this.SamplePntsA(positions, distances);
		let resamples = new Array();
		let terrainProvider = new Cesium.CesiumTerrainProvider({
			url: 'http://localhost:9999/CZSCZQ-2/全线高精度DEM/scene.json',
		});
		preprocess.forEach((element) => {
			if (element.color !== undefined) {
				let color = element.color;
				let resample = new Array();
				for (let i = 0; i < element.pnts.length - 1; i++) {     //@ts-ignore
					let p1 = new Cesium.Cartographic.fromCartesian(element.pnts[i]),     //@ts-ignore
						p2 = new Cesium.Cartographic.fromCartesian(element.pnts[i + 1]); // 获取经纬度坐标系
					let geodesic = new Cesium.EllipsoidGeodesic(p1, p2); // 线段球面距离
					let d = geodesic.surfaceDistance;
					let k = Math.floor(d / step); // 重采样点的个数-1(除去起点)
					for (let j = 0; j <= k; ++j) {
						let p = geodesic.interpolateUsingSurfaceDistance(step * j);
						resample.push(p);
					}
				}     //@ts-ignore
				resample.push(new Cesium.Cartographic.fromCartesian(element.pnts[element.pnts.length - 1]));
				let promise = Cesium.sampleTerrainMostDetailed(terrainProvider, resample); // 弧度
				Cesium.when(promise, function (updatedPositions) {
					let cartesians = new Array();
					updatedPositions.forEach((element) => {
						cartesians.push(Cesium.Cartographic.toCartesian(element));
					});
					resamples.push({
						color: color,
						pnts: cartesians,
					});
				});
			}
		});
		return resamples;
	},

	OffsetLine(positions, offset) {
		let lonlats = new Array();
		for (let i = 0; i < positions.length; i += 3) {
			lonlats.push([positions[i], positions[i + 1]]);
		}
		let linestring = turf.lineString(lonlats);
		let lineoffset = turf.lineOffset(linestring, offset);
		let pnts = lineoffset.geometry.coordinates;
		let results = new Array();
		let coords = new Array();
		for (let i = 0; i < pnts.length; i++) {
			let cartog = Cesium.Cartographic.fromDegrees(pnts[i][0], pnts[i][1]);
			coords.push(pnts[i][0], pnts[i][1]);
			cartog.height = positions[i * 3 + 2];
			results.push(Cesium.Cartographic.toCartesian(cartog));
		}
		return results;
	},

	ExtendPolyLine(positions, extend) {
		let lonlats = new Array();
		for (let i = 0; i < positions.length; i += 3) {
			lonlats.push([positions[i], positions[i + 1]]);
		}
		let linestring = turf.lineString(lonlats);
		// linestring = turf.lineOffset(linestring, extend - 0.15);
		let buffered = turf.buffer(linestring, extend);
		let coords = buffered.geometry.coordinates[0];
		let results = new Array();
		coords.forEach((pnt) => {
			results.push(Cesium.Cartesian3.fromDegrees(pnt[0], pnt[1]));
		});
		return results;
	},

	ComplexPolygon(linesAry, extend) {
		let extendsAry = new Array();
		linesAry.forEach((positions) => {
			let lonlats = new Array();
			for (let i = 0; i < positions.length; i += 3) {
				lonlats.push([positions[i], positions[i + 1]]);
			}
			let linestring = turf.lineString(lonlats);
			linestring = turf.lineOffset(linestring, extend - 0.1);
			let buffered = turf.buffer(linestring, extend);
			extendsAry.push(buffered);
		});
		let union = extendsAry[0];
		for (let i = 1; i < extendsAry.length; i++) {
			union = turf.union(union, extendsAry[i]);
		}
		let coords = union.geometry.coordinates[0];
		let results = new Array();
		coords.forEach((pnt) => {
			results.push(Cesium.Cartesian3.fromDegrees(pnt[0], pnt[1]));
		});
		return results;
	},

	GeneratePnts(positions, offset) {
		let heights = new Array();
		for (let i = 0; i < positions.length; i++) {
			let pnt = Cesium.Cartographic.fromCartesian(positions[i]);
			positions[i] = Cesium.Cartesian3.fromRadians(pnt.longitude, pnt.latitude, pnt.height + offset);
			heights.push(pnt.height - offset);
		}
		return heights;
	},

	DrawWallWidth(viewer, wall_ary, width = 30) {
		let container = new Array();
		wall_ary.forEach((element) => {
			let heights = this.GeneratePnts(element.pnts, width / 2);
			let wall = viewer.entities.add({
				wall: {
					material: element.color,
					positions: element.pnts,
					minimumHeights: heights,
				},
			});
			container.push(wall);
		});
		return container;
	},

	DrawWallHeight(viewer, wall_ary, min_height = 3100) {
		let container = new Array();
		wall_ary.forEach((element) => {
			let heights = new Array(element.pnts.length).fill(min_height);
			let wall = viewer.entities.add({
				wall: {
					material: element.color,
					positions: element.pnts,
					minimumHeights: heights,
				},
			});
			viewer.zoomTo(wall);
			container.push(wall);
		});
		return container;
	},
};

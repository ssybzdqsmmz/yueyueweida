import * as Cesium from 'Cesium';

/**
 * @description: 多边形裁剪
 * @param {*} viewer
 * @param {*} points
 * @return {*}
 */
function ClippingPolygon(viewer: Cesium.Viewer, points: Cesium.Cartesian3[]): Cesium.Primitive { //@ts-ignore
	let primitive = new Cesium.DTTerrainClippingPrimitive({
		geometryInstances: new Cesium.GeometryInstance({
			geometry: new Cesium.PolygonGeometry({
				polygonHierarchy: new Cesium.PolygonHierarchy(points),
			}),
		}),
		scene: viewer.scene, // 必须添加此属性
	});
	return viewer.scene.primitives.add(primitive);
}

/**
 * @description: 多边形绘制
 * @param {*} viewer
 * @param {*} entityId
 * @param {*} pnts
 * @param {*} height
 * @param {*} material
 * @return {*}
 */
function Draw3dPolygonOpen(
	viewer: Cesium.Viewer,
	entityId: string,
	pnts: Cesium.Cartesian3[],
	height: number,
	material: Cesium.Material
): Cesium.Entity {
	if (pnts.length < 3) {
		return;
	}
	let polygon = viewer.entities.add({
		id: entityId,
		polygon: { //@ts-ignore
			hierarchy: pnts, //@ts-ignore
			extrudedHeight: height, //@ts-ignore
			perPositionHeight: true, //@ts-ignore
			material: material, //@ts-ignore
			closeTop: false, //@ts-ignore
			closeBottom: true,
		},
	});
	return polygon;
}

/**
 * @description: 重新绘制
 * @param {*} positions
 * @param {*} sampling
 * @return {*}
 */
function Resample(positions: Cesium.Cartesian3[], sampling: number): Cesium.Cartographic[] {
	let resamplePoints: Cesium.Cartographic[] = []; // 重采样导出点
	for (let i = 0; i < positions.length - 1; ++i) {
		let p1 = Cesium.Cartographic.fromCartesian(positions[i]),
			p2 = Cesium.Cartographic.fromCartesian(positions[i + 1]); // 获取经纬度坐标系
		let geodesic = new Cesium.EllipsoidGeodesic(p1, p2); // 线段球面距离
		let d = geodesic.surfaceDistance;
		let k = Math.floor(d / sampling); // 重采样点的个数-1(除去起点)
		for (let j = 0; j <= k; ++j) {
			let p = geodesic.interpolateUsingSurfaceDistance(sampling * j);
			resamplePoints.push(p);
		}
	}
	return resamplePoints;
}

class TerrainFlatten {
	_viewer: Cesium.Viewer;
	_points: Cesium.Cartesian3[];
	_length: number;
	_height: number;
	_clipping: Cesium.Primitive | undefined;
	_extrusion: Cesium.Entity | undefined;

	constructor(options: { viewer: Cesium.Viewer; points: Cesium.Cartesian3[]; length: number; height: number }) {
		this._viewer = options.viewer;
		this._points = options.points;
		this._length = options.length;
		this._height = options.height;
		this._clipping = undefined;
		this._extrusion = undefined;
	}

	activate(): void {
		let that = this;
		this._clipping = ClippingPolygon(this._viewer, this._points);
		let terrainProvider = this._viewer.terrainProvider;
		let resamples = Resample(this._points, this._length);
		let promise = Cesium.sampleTerrain(terrainProvider, 12, resamples); // 弧度
		Cesium.when(promise, function (updatedPositions: Cesium.Cartesian3[]) {
			let pnts_cartesian: Cesium.Cartesian3[] = [];
			updatedPositions.forEach((element) => { //@ts-ignore
				pnts_cartesian.push(Cesium.Cartographic.toCartesian(element));
			});
			let dynamicHeight = new Cesium.CallbackProperty(function () {
				return that._height;
			}, false); //@ts-ignore
			that._extrusion = Draw3dPolygonOpen(that._viewer, 'FlattenPolygon', pnts_cartesian, dynamicHeight, Cesium.Color.DIMGREY);
		});
	}

	recover(): void {
		if (this._clipping) {
			this._viewer.scene.primitives.remove(this._clipping);
		}
		if (this._extrusion) {
			this._viewer.entities.remove(this._extrusion);
		}
		this._clipping = undefined;
		this._extrusion = undefined;
	}
}

export { TerrainFlatten };

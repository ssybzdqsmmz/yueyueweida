import Cesium from "Cesium";
/**
 * @description: 加载全球地形
 * @param {Viewer} viewer
 * @return {void}
 */
function loadCWT(viewer: Cesium.Viewer) {
	const options = {
		//@ts-ignore
		url: Cesium.IonResource.fromAssetId(1, {
			accessToken:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MWRiYzg4MS1mYTM0LTQ5NGEtYTQ5ZS0wNDI2NGNhYmQ3N2MiLCJpZCI6MTgwODY2LCJpYXQiOjE3MDEwNTI1Nzd9.Aiq99GwxUV7jQ3ATIlywlyb-BBmBkofhZT0QXpcRo80',
			server: 'https://api.cesium.com',
		}),
		requestVertexNormals: true,
		requestWaterMask: true,
	};
	//@ts-ignore
	viewer.terrainProvider = new Cesium.CesiumTerrainProvider(options);
}

export {
	loadCWT
}
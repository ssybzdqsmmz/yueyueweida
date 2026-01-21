import Cesium from 'Cesium';
import AppConfig from '@/config/AppConfig';

/**
 * @description: 加载全球地形
 * @param {Viewer} viewer
 * @return {void}
 */
function loadCWT(viewer: Cesium.Viewer) {
  let appConfig = new AppConfig().appConfig;
  let options = {
    //@ts-ignore
    url: Cesium.IonResource.fromAssetId(1, {
      accessToken: appConfig.ionToken,
      server: 'https://api.cesium.com',
    }),
    requestVertexNormals: true,
    requestWaterMask: true,
  };
  //@ts-ignore
  viewer.terrainProvider = new Cesium.CesiumTerrainProvider(options);
  return () => {
    // viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({}); // 移除地形
  };
}

export { loadCWT };

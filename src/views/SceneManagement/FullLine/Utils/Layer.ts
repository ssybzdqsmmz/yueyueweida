/*
 * @Author: Lincong-pro
 * @Date: 2024-02-24 20:25:15
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-03-14 10:44:03
 * @FilePath: \Geology-v3\src\views\SceneManagement\FullLine\Utils\Layer.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import { v4 as uuidv4 } from 'uuid';
import {
  Viewer,
  KmlDataSource,
  UrlTemplateImageryProvider,
  WebMercatorTilingScheme,
  CesiumTerrainProvider,
  Cesium3DTileStyle,
  GeoJsonDataSource,
} from 'Cesium';
import * as Cesium from 'Cesium';
function joinPath(prefix: string, latter: string) {
  return prefix + '/' + latter;
}

interface Viewport {
  destination: {
    x: number;
    y: number;
    z: number;
  };
  orientation: {
    heading: number;
    pitch: number;
    roll: number;
  };
}

interface CustomLayerDefine {
  name: string;
  type: number;
  visible: boolean;
  datastore: string;
  url: string;
  translation?: number[];
  displayView?: Viewport;
}

interface CustomModelLayerDefine extends CustomLayerDefine {
  modelType: number;
  isUnderground: boolean;
  brightness: number;
  scale: number[];
}

interface CustomTerrainLayerDefine extends CustomLayerDefine {
  lat: number;
  lon: number;
}

interface CustomImageLayerDefine extends CustomLayerDefine {
  lat: number;
  lon: number;
  maximumLevel: number;
  minimumLevel: number;
  extent: number[];
  tilingScheme: number;
  format: string;
  index: number;
}

/**
 * @description: 生成配置
 * @param {string} ipServer
 * @param {CustomModelLayerDefine} config
 * @return {*}
 */
function generateConfig<T>(ipServer, config: CustomLayerDefine) {
  return {
    ...config, // TODO 返回的json必须包含
    uid: uuidv4(),
    label: config.name,
    folderPath: config.datastore,
    property: 'private',
    url: joinPath(ipServer, config.url),
  };
}
/**
 * @description: 更新生成DTGlobe的配置文件
 * @param {string} ipServer
 * @param {string} sceneConfig
 * @return {*}
 */
function generateDTGlobeConfig(ipServer: string, sceneConfig: string | any[]) {
  const dtglobeCzml = [];
  let layerUids = [];

  let jsonConfig;
  if (typeof sceneConfig === 'string') {
    jsonConfig = JSON.parse(sceneConfig);
  } else {
    jsonConfig = sceneConfig;
  }
  jsonConfig.forEach((item, index) => {
    let layerConfig;
    if (index == 0) {
      dtglobeCzml.push(item); // 元数据信息
      return;
    }
    if (item.type == 0) {
      layerConfig = generateConfig<CustomImageLayerDefine>(ipServer, item);
    }
    if (item.type == 1) {
      layerConfig = generateConfig<CustomTerrainLayerDefine>(ipServer, item);
    }
    if (item.type == 2) {
      layerConfig = generateConfig<CustomModelLayerDefine>(ipServer, item);
    }
    dtglobeCzml.push(layerConfig);
    layerUids.push(layerConfig.uid);
  });

  return { dtglobeCzml, layerUids };
}
/**
 * @description: 丛配置文件中加载图层到DTGlobe
 * @param {Viewer} viewer
 * @param {string} sceneConfig
 * @return {*}
 */
function loadFromDTGlobeConfig(viewer: Viewer, sceneConfig: string | any[]) {
  let jsonConfig = [];
  if (typeof sceneConfig === 'string') {
    jsonConfig = JSON.parse(sceneConfig);
  } else {
    jsonConfig = sceneConfig;
  }

  let promises = [];

  jsonConfig.forEach((layerConfig, index) => {
    if (index == 0) {
      return;
    }
    let promise;
    if (layerConfig.type == 1) {
      //@ts-ignore
      promise = viewer.DTScene.loadLayer(layerConfig).then(() => {
        //@ts-ignore
        let layer = viewer.DTScene.getLayerByUId(layerConfig.uid);
      });
    } else {
      //@ts-ignore
      promise = viewer.DTScene.loadLayer(layerConfig);
      console.log('加载完毕');

      setTimeout(() => {
        // 调整地质模型为半透明
        // @ts-ignore
        viewer.DTScene.layers.forEach((layers) => {
          layers.values.forEach((layer) => {
            if (layer.label == '全线地质模型' || layer.label == '20240509断裂模型') {
              layer._featureSet.style = new Cesium3DTileStyle({
                color: {
                  conditions: [
                    ['true', 'color("", 0.20)'], // 设置半透明
                  ],
                },
              });
            }
          });
        });
      }, 1000);
    }
    promises.push(promise);
  });
  // @ts-ignore
  return viewer.DTScene.layers.forEach((layers) => {
    layers.values.forEach((layer) => {
      // @ts-ignore
      viewer.DTScene.removeLayer(layer);
    });
  });
}
/**
 * @description: 从配置文件中移除所有图层
 * @param {Viewer} viewer
 * @param {any} layerUids
 * @return {void}
 */
function removeFromDTGlobeConfig(viewer: Viewer, layerUids: any[]) {
  layerUids.map((layerUid) => {
    //@ts-ignore
    if (!viewer.DTScene.destroyLayerByUId(layerUid)) {
      console.warn('场景图层', layerUid, '清除失败');
    }
  });
}

/**
 * @description: 加载纯白底图
 * @param viewer
 * @return {void}
 */
function loadWorldOcean(viewer: Viewer) {
  //@ts-ignore
  let imgLayer = viewer.DTScene.createImagerLayer({
    name: 'baseImageLayer',
    label: 'World Ocean Base',
    url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer',
    // @ts-ignore
    serviceType: Cesium.DTIMAGELAYERSERVICETYPE.ARCGISIMAGESERVICE,
    format: 'image/jpeg',
    maximumLevel: '18',
    tileMatrixSetID: 'GoogleMapsCompatible',
    style: 'default',
    layer: 'BasicLayer',
    tilingScheme: 1,
    visible: true,
  });
  return () => {
    imgLayer.destroy();
  };
}

// kml图层的解析方式
/**
 * @description: 生成kml图层配置文件
 * @param {string} ipServer
 * @param {any} sceneConfig
 * @return {void}
 */
function generateKmlConfig(ipServer: string, sceneConfig: any[]) {
  let config = [];
  sceneConfig.forEach((kmlLayerConfig) => {
    config.push({
      ...kmlLayerConfig,
      url: joinPath(ipServer, kmlLayerConfig.url),
    });
  });
  return config;
}

function loadFromKmlConfig(viewer: Viewer, sceneConfig: any[]) {
  let dataSources = [];

  for (let i = 0; i < sceneConfig.length; i++) {
    console.log('loadFromKmlConfig', sceneConfig[i]);

    let layerConfig = sceneConfig[i];
    requestIdleCallback(() => {
      KmlDataSource.load(layerConfig.url, {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true,
      }).then((dataSource) => {
        dataSource.name = layerConfig.name;
        dataSource.show = layerConfig.visible;
        viewer.dataSources.add(dataSource);
        dataSources.push(dataSource);
      });
    });
  }
  return () => {
    for (let i = 0; i < dataSources.length; i++) {
      viewer.dataSources.remove(dataSources[i], true);
    }
  };
}

// 以geojson格式加载数据
function loadFromGeojson(viewer, ipserver, url) {
  let dataSources = viewer.dataSources.add(
    Cesium.GeoJsonDataSource.load(ipserver + url, {
      clampToGround: true, //贴地
      stroke: Cesium.Color.YELLOW, //折线和多边形轮廓的默认颜色。
      fill: Cesium.Color.TRANSPARENT, //填充的默认颜色。
      strokeWidth: 16, //折线和多边形轮廓的默认宽度
    })
  );
  // //单独设置线条样式
  // dataSources.then((dataSource) => {
  // 	let entities = dataSource.entities.values;
  // 	for (let i = 0; i < entities.length; i++) {
  // 		console.log('以geojson格式加载数据', entities[i]);
  // 		let entity = entities[i];
  // 		let positions = entity.polygon.hierarchy._value.positions;
  // 		viewer.entities.add({
  // 			name: 'boderLine',
  // 			polyline: {
  // 				positions: positions,
  // 				width: 4,
  // 				material: Cesium.Color.YELLOW.withAlpha(1),
  // 				clampToGround: true,
  // 			},
  // 		});
  // 	}
  // });
}

// function loadDisasterFromKmlConfig(viewer, sceneConfig) {
// 	let dataSources = [];

// 	// 创建点实体样式
// 	const createPointEntity = (color) => ({
// 		point: {
// 			color: Cesium.Color.fromBytes(...color),
// 			pixelSize: 10,
// 			outlineColor: Cesium.Color.BLACK,
// 			outlineWidth: 2,
// 			// 设置模型高度参考
// 			// heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
// 		},
// 	});

// 	const pointStyles = {
// 		slope: createPointEntity([222, 122, 122]),
// 		river: createPointEntity([12, 207, 212]),
// 		re: createPointEntity([230, 154, 26]),
// 		stable: createPointEntity([90, 203, 113]),
// 		lake: createPointEntity([152, 231, 236]),
// 	};

// 	// 优化处理 KML 数据源的方式
// 	const loadKmlLayer = async (layerConfig) => {
// 		const dataSource = await Cesium.KmlDataSource.load(layerConfig.url, {
// 			camera: viewer.scene.camera,
// 			canvas: viewer.scene.canvas,
// 			clampToGround: true,
// 		});

// 		dataSource.name = layerConfig.name;
// 		dataSource.show = layerConfig.visible;

// 		// 批量处理实体的样式
// 		dataSource.entities.values.forEach((entity) => {
// 			entity.billboard = undefined;
// 			entity.label = undefined;

// 			// 根据灾害点类别分类
// 			if (dataSource.name === '冰川' || dataSource.name === '冰湖' || dataSource.name === '第一次增加冰川') {
// 				//@ts-ignore
// 				entity.point = pointStyles.lake.point;
// 			} else if (dataSource.name.includes('复活历史变形破坏区')) {
// 				//@ts-ignore

// 				entity.point = pointStyles.re.point;
// 			} else if (dataSource.name.includes('稳定历史变形破坏区')) {
// 				//@ts-ignore
// 				entity.point = pointStyles.stable.point;
// 			} else {
// 				//@ts-ignore
// 				entity.point = pointStyles.slope.point;
// 			}
// 		});

// 		viewer.dataSources.add(dataSource);
// 		dataSources.push(dataSource);
// 	};

// 	// 批量加载 KML 数据源
// 	const loadLayers = async () => {
// 		for (const layerConfig of sceneConfig) {
// 			await loadKmlLayer(layerConfig);
// 		}
// 	};

// 	loadLayers();

// 	// 返回一个清理函数
// 	return () => {
// 		dataSources.forEach((dataSource) => {
// 			viewer.dataSources.remove(dataSource, true);
// 		});
// 	};
// }

function loadDisasterFromKmlConfig(viewer: Cesium.Viewer, sceneConfig: any[]) {
  // 存储Primitive集合和颜色数组
  const primitiveCollections: Cesium.PointPrimitiveCollection[] = [];
  const colorArrays: Map<string, Float32Array> = new Map();

  // 颜色定义（改用Float32Array提升WebGL传输效率）
  const pointStyles = {
    slope: new Float32Array([222 / 255, 122 / 255, 122 / 255, 1.0]),
    river: new Float32Array([12 / 255, 207 / 255, 212 / 255, 1.0]),
    re: new Float32Array([230 / 255, 154 / 255, 26 / 255, 1.0]),
    stable: new Float32Array([90 / 255, 203 / 255, 113 / 255, 1.0]),
    lake: new Float32Array([152 / 255, 231 / 255, 236 / 255, 1.0]),
  };
  const parseKmlToPrimitiveData = async (filePath: string): Promise<Cesium.Cartesian3[]> => {
    // 1. 获取KML文件内容（兼容绝对路径）
    const kmlText = await (await fetch(filePath)).text();

    // 2. 更健壮的XML解析（不依赖application/xml声明）
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlText, 'text/xml');

    // 3. 检查解析错误（处理无效KML）
    const parserErrors = kmlDoc.getElementsByTagName('parsererror');
    if (parserErrors.length > 0) {
      console.error('KML解析错误:', parserErrors[0].textContent);
      return [];
    }

    // 4. 改进的坐标提取逻辑
    const positions: Cesium.Cartesian3[] = [];
    const placemarks = kmlDoc.querySelectorAll('Placemark'); // 改用querySelectorAll更灵活

    placemarks.forEach((placemark) => {
      // 4.1 查找coordinates节点（兼容大小写和嵌套结构）
      const coordsNode = placemark.querySelector('coordinates') || placemark.querySelector('Coordinates'); // 兼容大小写

      // 4.2 提取坐标文本（处理可能存在的空格和换行）
      const coordText = coordsNode?.textContent?.replace(/\s+/g, ' ').trim();
      if (!coordText) {
        return;
      }

      // 4.3 处理坐标数据（兼容三维坐标）
      const firstCoord = coordText.split(' ')[0]; // 取第一个坐标（如果是LineString）
      const [lon, lat, alt] = firstCoord.split(',').map(Number);

      positions.push(
        Cesium.Cartesian3.fromDegrees(
          lon,
          lat,
          isNaN(alt) ? undefined : alt // 可选海拔
        )
      );
    });

    return positions;
  };

  // 创建Primitive集合（按样式分类）
  const createPrimitiveCollection = (positions: Cesium.Cartesian3[], style: Float32Array) => {
    const collection = new Cesium.PointPrimitiveCollection({
      blendOption: Cesium.BlendOption.OPAQUE_AND_TRANSLUCENT, // 优化混合渲染
    });

    positions.forEach((position) => {
      collection.add({
        position: position,
        color: Cesium.Color.fromBytes(style[0] * 255, style[1] * 255, style[2] * 255, 255),
        pixelSize: 10,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
      });
    });

    return collection;
  };

  // 批量加载图层
  const loadLayers = async () => {
    // 先收集所有点位（避免频繁操作场景）
    const positionGroups: Map<string, Cesium.Cartesian3[]> = new Map();

    for (const layerConfig of sceneConfig) {
      const positions = await parseKmlToPrimitiveData(layerConfig.url);

      // 分类存储点位
      if (layerConfig.name.includes('冰川') || layerConfig.name.includes('冰湖')) {
        positionGroups.set('lake', [...(positionGroups.get('lake') || []), ...positions]);
      } else if (layerConfig.name.includes('复活历史变形破坏区')) {
        positionGroups.set('re', [...(positionGroups.get('re') || []), ...positions]);
      } else if (layerConfig.name.includes('稳定历史变形破坏区')) {
        positionGroups.set('stable', [...(positionGroups.get('stable') || []), ...positions]);
      } else {
        positionGroups.set('slope', [...(positionGroups.get('slope') || []), ...positions]);
      }
    }

    // 批量创建Primitive（减少draw call）
    positionGroups.forEach((positions, styleKey) => {
      if (positions.length === 0) {
        return;
      }

      const style = pointStyles[styleKey as keyof typeof pointStyles];
      const collection = createPrimitiveCollection(positions, style);

      viewer.scene.primitives.add(collection);
      primitiveCollections.push(collection);
    });
  };

  loadLayers();

  // 返回清理函数
  return () => {
    primitiveCollections.forEach((collection) => {
      viewer.scene.primitives.remove(collection);
    });
    colorArrays.clear();
  };
}

function generateDisasterConfig(ipServer, disasterConfig) {
  if (!disasterConfig[0].url.startsWith('http://')) {
    disasterConfig.forEach((item) => {
      item.url = ipServer + '/' + item.url;
    });
  }
}
function generateInsarConfig(ipServer, config) {
  if (!config[0].kml.startsWith('http://')) {
    config.forEach((item) => {
      item.kml = ipServer + '/' + item.kml;
    });
  }
}

export {
  generateDTGlobeConfig,
  loadFromDTGlobeConfig,
  loadFromKmlConfig,
  removeFromDTGlobeConfig,
  loadWorldOcean,
  generateKmlConfig,
  generateDisasterConfig,
  generateInsarConfig,
  loadDisasterFromKmlConfig,
  loadFromGeojson,
};

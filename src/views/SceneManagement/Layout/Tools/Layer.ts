/*
 * @Author: Lincong-pro
 * @Date: 2024-02-27 15:11:05
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-20 16:00:12
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Tools\Layer.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import {
	Viewer,
	KmlDataSource,
	Cartesian3,
	Cartesian2,
	UrlTemplateImageryProvider,
	WebMercatorTilingScheme,
	ArcGisMapServerImageryProvider,
	VerticalOrigin,
	NearFarScalar,
	DistanceDisplayCondition,
	ImageMaterialProperty,
	Color,
	CheckerboardMaterialProperty,
	ColorMaterialProperty,
	ConstantProperty,
	HeightReference,
	PointPrimitiveCollection,
	BlendOption,
} from 'Cesium';
import lod from '../Config/LODLabel.json';
import bIcon from '../Assets/img/点.png';
import tIcon from '../Assets/img/三角形.png';
import dIcon from '../Assets/img/地区1.png';
import czIcon from '../Assets/img/火车站.png';
import forestTexture from '../Assets/img/forest_texture.png'; // 森林公园填充材质
import grassTexture from '../Assets/img/grass_texture.png'; // 湿地公园填充材质

function joinPath(prefix: string, latter: string) {
	return prefix + '/' + latter;
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
		let layerConfig = sceneConfig[i];
		requestIdleCallback(() => {
			KmlDataSource.load(layerConfig.url, {
				camera: viewer.scene.camera,
				canvas: viewer.scene.canvas,
				clampToGround: true,
			}).then((dataSource) => {
				dataSource.name = layerConfig.name;
				dataSource.show = layerConfig.visible;
				if (dataSource.name === '地名路段' || dataSource.name === '沿线车站点') {
					addBillBoard(dataSource);
				}

				viewer.dataSources.add(dataSource);
				dataSources.push(dataSource);
			});
		});
	}
	function addBillBoard(dataSource) {
		let entities = dataSource.entities.values;
		const len = entities.length;
		const lodFour = lod.LOD4;
		const lodFive = lod.LOD5;
		// 定义每个lod的可见范围
		const lod4 = new DistanceDisplayCondition(0.0, 160000);
		const lod6 = new DistanceDisplayCondition(0.0, 30000);
		let i = 0;
		let pic = tIcon;
		let ddc = lod6;
		while (i < len) {
			const type = entities[i].name.slice(-1);
			if (type === '道') {
				pic = tIcon;
			} else if (type === '桥') {
				pic = bIcon;
			} else if (type === '站') {
				pic = czIcon;
			} else {
				pic = dIcon;
			}
			// 判断层级
			if (lodFour.includes(entities[i].name)) {
				ddc = lod4;
			} else {
				ddc = lod6;
			}
			// 为每个entity添加billboard
			entities[i++].billboard = {
				image: pic,
				show: true,
				verticalOrigin: VerticalOrigin.CENTER,
				eyeOffset: new Cartesian3(0, 0, 100),
				pixelOffset: new Cartesian2(0, 0), // 调整此值以控制标签相对于图标的位置
				scaleByDistance: new NearFarScalar(1000.0, 0.4, 1000000.0, 0.17),
				// distanceDisplayCondition: ddc,
				heightReference: HeightReference.CLAMP_TO_GROUND,
			};
		}
	}
	return () => {
		for (let i = 0; i < dataSources.length; i++) {
			viewer.dataSources.remove(dataSources[i], true);
		}
	};
}

function loadkmlPoint(viewer: Viewer, sceneConfig: any[]) {
	// 使用primitive高效加载kml点数据
	console.log('加载kml点数据', sceneConfig);

	// 存储Primitive集合和颜色数组
	const primitiveCollections: PointPrimitiveCollection[] = [];
	const colorArrays: Map<string, Float32Array> = new Map();

	// 颜色定义（改用Float32Array提升WebGL传输效率）
	const pointStyles = {
		slope: new Float32Array([222 / 255, 122 / 255, 122 / 255, 1.0]),
		river: new Float32Array([12 / 255, 207 / 255, 212 / 255, 1.0]),
		re: new Float32Array([230 / 255, 154 / 255, 26 / 255, 1.0]),
		stable: new Float32Array([90 / 255, 203 / 255, 113 / 255, 1.0]),
		lake: new Float32Array([152 / 255, 231 / 255, 236 / 255, 1.0]),
	};
	const parseKmlToPrimitiveData = async (filePath: string): Promise<Cartesian3[]> => {
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
		const positions: Cartesian3[] = [];
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
				Cartesian3.fromDegrees(
					lon,
					lat,
					isNaN(alt) ? undefined : alt // 可选海拔
				)
			);
		});

		return positions;
	};

	// 创建Primitive集合（按样式分类）
	const createPrimitiveCollection = (positions: Cartesian3[], style: Float32Array) => {
		const collection = new PointPrimitiveCollection({
			blendOption: BlendOption.OPAQUE_AND_TRANSLUCENT, // 优化混合渲染
		});

		positions.forEach((position) => {
			collection.add({
				position: position,
				color: Color.fromBytes(style[0] * 255, style[1] * 255, style[2] * 255, 255),
				pixelSize: 10,
				outlineColor: Color.BLACK,
				outlineWidth: 2,
			});
		});

		return collection;
	};

	// 批量加载图层
	const loadLayers = async () => {
		// 先收集所有点位（避免频繁操作场景）
		const positionGroups: Map<string, Cartesian3[]> = new Map();

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


export { generateKmlConfig, loadFromKmlConfig, loadkmlPoint };

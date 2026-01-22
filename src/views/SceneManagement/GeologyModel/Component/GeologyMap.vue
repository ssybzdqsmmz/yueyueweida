<template>
	<div>
		<!-- 图例 -->
		<div class="legend-container" v-if="showLegend">
			<div class="legend-header">
				<h3>四川地质群组</h3>
				<span class="total-count">{{ totalCount }} 个点</span>
			</div>

			<div class="era-groups">
				<div v-for="(group, index) in eraGroups" :key="index" class="era-group-item" @mouseenter="hoverEra = group.era"
					@mouseleave="hoverEra = null" :class="{ hovered: hoverEra === group.era }">
					<div class="color-indicator" :style="{ backgroundColor: getEraColorCss(group.sampleEra) }"></div>
					<span class="era-name">{{ group.era }}</span>
					<span class="era-count">{{ group.count }}</span>
				</div>
			</div>

			<div class="legend-controls">
				<div class="toggle-section" @click="toggleDetails">
					<svg :style="{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }" class="toggle-arrow"
						viewBox="0 0 12 12">
						<path d="M0,0 L6,6 L12,0" fill="none" stroke="#aaa" stroke-width="2" />
					</svg>
					<span>显示详细颜色映射</span>
				</div>

				<div class="detail-content" v-if="showDetails">
					<div v-for="(color, era, index) in eraColorMap" :key="index" class="color-detail">
						<div class="color-box" :style="{ backgroundColor: colorToCssString(color) }"></div>
						<span>{{ era }}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 信息表格 -->
		<div class="info" v-show="true">
			<div class="extensionInfo">
  <el-table 
    :data="entityInfo" style="
    border: 1px solid rgb(0 180 255 / 40%);
    border-radius: 8px;
    background: rgb(0 40 80 / 70%);
    backdrop-filter: blur(5px);
  "
  >
    <el-table-column fixed prop="attribute" label="属性" width="160px"></el-table-column>
    <el-table-column fixed prop="information" label="信息" width="240px"></el-table-column>
  </el-table>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, reactive } from 'vue';
import * as Cesium from 'Cesium';
import geologicalData from '../Config/sichuan_groups.json';
import { DTScopeEngine } from '@/utils/Common/Viewer';

// 响应式数据
const isShow = ref(true);
const showLegend = ref(true);
const showDetails = ref(false);
const hoverEra = ref(null);
// 改为计算属性
const entityInfo = computed(() => {
  if (!exam.value) {return [];}
  return [
    { attribute: '群组名称', information: exam.value.群组名称 },
    { attribute: '位置', information: exam.value.位置 },
    { attribute: '代号', information: exam.value.代号 },
    { attribute: '符号', information: exam.value.符号 },
    { attribute: '厚度', information: exam.value.厚度 },
    { attribute: '地质时代', information: exam.value.地质时代 },
    { attribute: '上覆地层', information: exam.value.上覆地层 },
    { attribute: '下伏地层', information: exam.value.下伏地层 },
    { 
      attribute: '岩性', 
      information: exam.value.岩性
    }
  ];
});
const exam = ref({
                "群组名称": "菠茨沟组",
                "符号": "PTb",
                "代号": "06-51-0161",
                "位置": "小金县晓碛东大河菠茨沟",
                "岩性": [
                    "灰绿色变质凝灰质砂岩",
                    "粉砂岩",
                    "灰色绢云板岩",
                    "灰、深灰色粉砂质板岩",
                    "变质粉砂岩",
                    "钙质细砂岩",
                    "薄层灰岩",
                    "细砾岩",
                    "含砾砂岩",
                    "杂色粉砂质板岩",
                    "铁锰矿层"
                ],
                "厚度": "137.0m",
                "上覆地层": "扎尕山组 浅灰一黑灰色砂质碳质千枚岩与灰绿色粉砂泥质板岩互层，夹结晶灰岩",
                "下伏地层": "大石包组 灰绿一暗绿色致密块状玄武岩，具气孔、杏仁及枕状构造",
                "地质时代": "早三叠世至晚二叠世"
            })




// 辅助函数
const colorToCssString = (color) => {
	return color?.toCssColorString?.() || '#808080';
};

// 地质时代分组映射
const eraMapping = {
	'元古': '元古代', '震旦': '震旦纪', '寒武': '寒武纪',
	'奥陶': '奥陶纪', '志留': '志留纪', '泥盆': '泥盆纪',
	'石炭': '石炭纪', '二叠': '二叠纪', '三叠': '三叠纪',
	'侏罗': '侏罗纪', '白垩': '白垩纪', '新近': '新近纪',
	'青白口': '青白口纪', '前震旦': '前震旦纪'
};

// 获取地质时代分组
const getEraGroup = (era) => {
	if (!era) { return '其他'; }
	for (const [key, value] of Object.entries(eraMapping)) {
		if (era.includes(key)) { return value; }
	}
	return '其他';
};

// 预定义颜色映射
const eraColorMap = ref({
	// 元古代
	'早元古代早期': Cesium.Color.fromCssColorString('#006400'),
	'早元古代': Cesium.Color.fromCssColorString('#228B22'),
	'中元古代': Cesium.Color.fromCssColorString('#9ACD32'),
	'元古代': Cesium.Color.fromCssColorString('#00FF00'),
	// 震旦纪
	'震旦纪': Cesium.Color.fromCssColorString('#1E90FF'),
	'前震旦纪': Cesium.Color.fromCssColorString('#4682B4'),
	// 寒武纪
	'寒武纪': Cesium.Color.fromCssColorString('#20B2AA'),
	// 奥陶纪
	'奥陶纪': Cesium.Color.fromCssColorString('#DA70D6'),
	// 志留纪
	'志留纪': Cesium.Color.fromCssColorString('#9370DB'),
	// 泥盆纪
	'泥盆纪': Cesium.Color.fromCssColorString('#FF8C00'),
	// 石炭纪
	'石炭纪': Cesium.Color.fromCssColorString('#FFD700'),
	// 二叠纪
	'二叠纪': Cesium.Color.fromCssColorString('#FF0000'),
	// 三叠纪
	'三叠纪': Cesium.Color.fromCssColorString('#A0522D'),
	// 侏罗纪
	'侏罗纪': Cesium.Color.fromCssColorString('#2E8B57'),
	// 白垩纪
	'白垩纪': Cesium.Color.fromCssColorString('#FF1493'),
	// 新近纪
	'新近纪': Cesium.Color.fromCssColorString('#DAA520'),
});

// 计算属性
const totalCount = computed(() => geologicalData.features.length);

// 获取颜色CSS值
const getEraColorCss = (era) => {
	if (!era) { return '#808080'; }

	// 精确匹配
	for (const [eraName, color] of Object.entries(eraColorMap.value)) {
		if (era.includes(eraName) || eraName.includes(era)) {
			return colorToCssString(color);
		}
	}

	// 按大类匹配
	for (const [key, eraName] of Object.entries(eraMapping)) {
		if (era.includes(key)) {
			const color = eraColorMap.value[eraName];
			if (color) { return colorToCssString(color); }
		}
	}

	return '#808080';
};

// 计算时代分组
const eraGroups = computed(() => {
	const groups = {};
	geologicalData.features.forEach(feature => {
		const era = getEraGroup(feature.properties.地质时代);
		if (!groups[era]) { groups[era] = { era, count: 0, sampleEra: feature.properties.地质时代 }; }
		groups[era].count++;
	});
	return Object.values(groups).sort((a, b) => b.count - a.count);
});

// 切换函数
const toggleDetails = () => showDetails.value = !showDetails.value;

// 获取地质点颜色
const getColorByEra = (era) => {
	if (!era) { return Cesium.Color.GRAY; }
	for (const [eraName, color] of Object.entries(eraColorMap.value)) {
		if (eraName === era || era.includes(eraName) || eraName.includes(era)) { return color; }
	}
	return Cesium.Color.GRAY;
};

// 添加地质点到场景
const addGeologicalPoints = (viewer) => {
	const dataSource = new Cesium.CustomDataSource('四川地质群组');

	geologicalData.features.forEach((feature, index) => {
		if (feature.geometry.type === 'Point') {
			const [lon, lat] = feature.geometry.coordinates;
			const prop = feature.properties;
			const color = getColorByEra(prop.地质时代);

			const entity = dataSource.entities.add({
				id: `geology-point-${index}`,
				name: prop.群组名称,
				position: Cesium.Cartesian3.fromDegrees(lon, lat, 500),

				point: {
					pixelSize: prop.厚度?.includes('>') ? 12 : 10,
					color,
					outlineColor: Cesium.Color.WHITE,
					outlineWidth: 2,
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
					disableDepthTestDistance: Number.POSITIVE_INFINITY
				},

				label: {
					text: prop.群组名称,
					font: '20px "Microsoft YaHei", sans-serif',
					fillColor: Cesium.Color.WHITE,
					outlineColor: Cesium.Color.BLACK,
					outlineWidth: 2,
					pixelOffset: new Cesium.Cartesian2(0, -25),
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
					showBackground: true,
					backgroundColor: new Cesium.Color(0.1, 0.1, 0.1, 0.7),
					backgroundPadding: new Cesium.Cartesian2(5, 3),
					distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500000),
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
					disableDepthTestDistance: Number.POSITIVE_INFINITY
				}
			});
		}
	});

	viewer.dataSources.add(dataSource);
	// 这里不需要加 window.，直接用 console.log 就可以了
	console.log(`添加了 ${geologicalData.features.length} 个地质点`);
};

// 设置点击事件
const setupEntityClick = (viewer) => {
	viewer.screenSpaceEventHandler.setInputAction((click) => {
		const entity = viewer.scene.pick(click.position)?.id;
		if (entity instanceof Cesium.Entity) {
			const match = entity.id.match(/geology-point-(\d+)/);
			if (match) {
				const index = parseInt(match[1]);
				console.log('原始地质数据:', geologicalData.features[index].properties);
				exam.value = geologicalData.features[index].properties;
				console.log('地质点点击事件已设置',entityInfo);
			}
		}
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

onMounted(() => {
	const viewer = DTScopeEngine.viewer;
	if (!viewer) {
		// 使用 console.error 而不是 window.console.error
		console.error('全局Viewer未初始化');
		return;
	}

	addGeologicalPoints(viewer);
	setupEntityClick(viewer);

	viewer.camera.flyTo({
		destination: Cesium.Cartesian3.fromDegrees(102.5, 30.5, 800000),
		orientation: {
			heading: Cesium.Math.toRadians(0),
			pitch: Cesium.Math.toRadians(-90),
			roll: 0
		},
		duration: 2
	});
});

onUnmounted(() => {
	const viewer = DTScopeEngine.viewer;
	if (viewer) {
		const dataSource = viewer.dataSources.getByName('四川地质群组')[0];
		if (dataSource) { viewer.dataSources.remove(dataSource); }
	}
	// 使用 console.log 而不是 window.console.log
	console.log('清理地质点可视化组件');
});
</script>

<style scoped>
/* 保持样式不变 */
.legend-container {
	position: absolute;
	top: 170px;
	left: 90px;
	z-index: 999;
	width: 230px;
	max-width: 280px;
	max-height: 80vh;
	padding: 15px;
	border: 1px solid rgb(255 255 255 / 20%);
	border-radius: 8px;
	overflow-y: auto;
	color: white;
	font-family: 'Microsoft YaHei', sans-serif;
	font-size: 12px;
	background: rgb(0 0 0 / 85%);
	backdrop-filter: blur(5px);
}

.legend-header {
	display: flex;
	margin-bottom: 12px;
	padding-bottom: 8px;
	border-bottom: 1px solid #555;
	justify-content: space-between;
	align-items: center;
}

.legend-header h3 {
	margin: 0;
	color: #ffd700;
	font-size: 14px;
}

.total-count {
	color: #1890ff;
	font-weight: bold;
	font-size: 13px;
}

.era-groups {
	margin-bottom: 15px;
}

.era-group-item {
	display: flex;
	margin: 6px 0;
	padding: 6px;
	border-radius: 4px;
	align-items: center;
	background: rgb(255 255 255 / 5%);
	cursor: pointer;
	transition: background 0.2s;
}

.era-group-item.hovered {
	background: rgb(255 255 255 / 10%);
}

.color-indicator {
	width: 14px;
	height: 14px;
	margin-right: 10px;
	border: 1px solid white;
	border-radius: 50%;
}

.era-name {
	flex: 1;
	color: #e0e0e0;
}

.era-count {
	min-width: 40px;
	color: #ffd700;
	font-weight: bold;
	text-align: right;
}

.legend-controls {
	margin: 15px 0;
	padding-top: 10px;
	border-top: 1px solid #555;
}

.toggle-section {
	display: flex;
	padding: 5px;
	align-items: center;
	cursor: pointer;
}

.toggle-arrow {
	width: 12px;
	height: 12px;
	margin-right: 8px;
	transition: transform 0.3s;
}

.toggle-section span {
	color: #aaa;
	font-size: 11px;
}

.detail-content {
	max-height: 200px;
	margin-top: 8px;
	padding: 8px;
	border-radius: 4px;
	overflow-y: auto;
	background: rgb(0 0 0 / 30%);
}

.color-detail {
	display: flex;
	margin: 3px 0;
	align-items: center;
}

.color-box {
	width: 10px;
	height: 10px;
	margin-right: 8px;
	border: 1px solid rgb(255 255 255 / 30%);
	border-radius: 2px;
}

.color-detail span {
	font-size: 10px;
	color: #ccc;
}

.extensionInfo {
	position: absolute;
	top: 100px;
	left: 300px;
	z-index: 999;
	width: 400px;
}

:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-border: 0px solid var(--el-table-border-color); /** 这里改成0了 */
  --el-table-text-color: rgb(127 255 202); /** 文字颜色 */
  --el-table-header-text-color: rgb(135 198 235); /** 表头文字颜色 */
  --el-table-row-hover-bg-color: rgb(116 85 228 / 67.1%); /** 行悬浮颜色 */
  --el-table-current-row-bg-color: rgb(0 161 48); /** 当前行颜色 */
  --el-table-header-bg-color: rgb(255 0 0 / 0%); /** 表头背景颜色, 透明度为0 */
  --el-table-fixed-box-shadow: var(--el-box-shadow-light);
  --el-table-bg-color: rgb(255 0 0 / 0%); /** 表格背景颜色, 透明度为0 */
  --el-table-tr-bg-color: rgb(255 0 0 / 0%); /** 表格行的背景颜色, 透明度为0 */;
  --el-table-expanded-cell-bg-color: var(--el-fill-color-blank);
  --el-table-fixed-left-column: inset 10px 0 10px -10px rgb(0 0 0 / 15%);
  --el-table-fixed-right-column: inset -10px 0 10px -10px rgb(0 0 0 / 15%);
  --el-table-index: var(--el-index-normal);

  position: relative;
  width: 100%;
  max-width: 100%;
  height: fit-content;;
  box-sizing: border-box;
  overflow: hidden;
  color: var(--el-table-text-color);
  font-size: 14px;
  background-color: rgb(255 0 0 / 0%); /** 表格的背景颜色, 透明度为0 */
}

</style>
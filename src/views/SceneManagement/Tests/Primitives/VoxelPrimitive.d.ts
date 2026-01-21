export type PropertyCollection = {
	samples: number; // 定义步长
	maxSamples: number; //最大采样Samples
	isovalue: number;
	isowalls: boolean;
	isoalpha: number;
	isosmooth: number;
	colour: Array<number>;
	xmin: number; // 以指定的坐标点为中心，用于确定体素化的边界
	ymin: number;
	zmin: number;

	xmax: number;
	ymax: number;
	zmax: number;

	density: number;
	mindensity: number;
	maxdensity: number;

	saturation: number;
	brightness: number;
	contrast: number;
	power: number;
	minclip: number;
	maxclip: number;

	usecolourmap: boolean;
	tricubicFilter: boolean;
	interactive: boolean;
	axes: boolean;
	border: boolean;

	filterAlpha: boolean;

	slices: number[]; // 行列的切片数量
	rotate: number[]; // 单位四元素
	scale: number[]; // 各个方向的宽度
	center: number[];
	modelMatrix: number[]; // 直接给的模型矩阵

	resolution: number[]; // 400,[sliceWidth] 100,[sliceHeight] 100
	colours: []; // 颜色带
}
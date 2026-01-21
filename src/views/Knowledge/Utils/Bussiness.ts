/*
 * @Author: 枫林残忆
 * @Date: 2024-03-14 19:06:22
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-29 12:43:26
 * @FilePath: \Geology-V3\src\views\Knowledge\Utils\Bussiness.ts
 * @Description: 一些业务相关的代码
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */

const colorMaps = new Map<string, string>([
	['主体', 'rgb(255, 224, 129)'],
	['一级', 'rgb(201, 144, 192)'],
	['二级', 'rgb(247, 151, 103)'],
	['三级', 'rgb(87, 199, 227)'],
	['四级', 'rgb(241, 102, 103)'],
]);

export const legendData = {
	nodes: [
		{
			id: '主体',
			label: '主体',
			order: 0,
			style: {
				fill: 'red',
			},
		},
		{
			id: '一级',
			label: '一级',
			order: 0,
			style: {
				fill: 'red',
			},
		},
		{
			id: '二级',
			label: '二级',
			order: 0,
			style: {
				fill: 'red',
			},
		},
	],
};


export function generateDisasterNodeStyle(nodes: any[]) {
	// add properties
	nodes.forEach((node: any) => {
		node.style = {
			fill: colorMaps.get(node.level), //这个需要服务器返回的节点有这个属性
		};
	});
}

export function generateDisasterEdgeStyle(edges: any[]) {
	let labelRelation = ""; // 筛选边的真正标注类型

	if (edges.length != 0 && edges[0].TYPE) {
		labelRelation = "TYPE";
	} else {
		labelRelation = "type";
	}
	edges.forEach((edge: any) => {
		edge.label = edge[labelRelation]
	});
}
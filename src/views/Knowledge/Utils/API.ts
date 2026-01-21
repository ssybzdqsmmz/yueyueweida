/*
 * @Author: 枫林残忆
 * @Date: 2024-03-14 16:38:56
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-08 20:28:27
 * @FilePath: \Geology-V3\src\views\Knowledge\Utils\API.ts
 * @Description: 用于请求后台的图形接口
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import axios from 'axios';
import AppConfig from '@/config/AppConfig';

/**
 * @description: 根据标签查询节点和关系
 * @param {string} label
 * @return {*}
 */
export async function queryNodeAndRelationByLabel(label: string) {
	let appConfig = new AppConfig();
	let res;
	try {
		res = await axios({
			method: 'POST',
			withCredentials: false,
			url: appConfig.getConfig().neo4jServer + '/knowledge/query_node_relation_from_label?label=' + label,
		});
	} catch (error) {
		console.warn(error);
	}

	return res.data;
}

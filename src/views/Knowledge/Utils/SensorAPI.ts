/*
 * @Author: 枫林残忆 2997534654@qq.com
 * @Date: 2024-03-30 15:20:20
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-30 18:55:17
 * @FilePath: \Geology-V3\src\views\Knowledge\Utils\SensorAPI.ts
 * @Description: 铁科所有的传感器数据节点
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * 
 */
import TkyLogin from "./TkyLogin";
import { TkyGetProxy, TkyDomain } from "./ServiceProperties";
import axios from "axios";

/**
 * @description: 基本查询函数
 * @param {*} params 请求参数
 * @return {*}
 */
async function baseQuery(params) {
	const headers = {
		CRBIMUID: 314636,
	};
	let tkyLogin = new TkyLogin();
	await tkyLogin.setCookie();

	params.realUrl = TkyDomain + params.realUrl;

	return axios.get(TkyGetProxy, {
		headers: headers,
		params: params,
		withCredentials: true,
	});
}


/**
 * @description: 传入sections
 * @param {number | undefined} sections（不传递直接就是返回所有标段） 
 * @return {*}
 */
export async function queryAllGraphNode(sections: number | undefined = undefined) {
	let params;
	if (sections) {
		params = {
			tkappid: 10001,
			realUrl: '/czzqdst/apiLook/zhzs/zhyjxy/areaSite/sites',
			sections: sections
		};
	} else {
		params = {
			tkappid: 10001,
			realUrl: '/czzqdst/apiLook/zhzs/zhyjxy/areaSite/sites',
		};
	}

	// console.warn(document.cookie);
	return baseQuery(params);
}
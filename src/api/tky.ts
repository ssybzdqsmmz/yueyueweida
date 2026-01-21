/*
 * @Author: anganao 1928882425@qq.com
 * @Date: 2024-04-16 16:48:18
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-16 19:46:34
 * @FilePath: \Geology-V3\src\api\tky.ts
 * @Description: 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * 
 */
import TkyLogin from "./TkyLogin";
import AppConfig from "@/config/AppConfig";
import CryptoJS from "crypto-js";

import axios from "axios";




const { middlewareServer } = new AppConfig().appConfig;

const TkyDomain = "https://apps.r93535.com"; //1.请求铁科院登陆接口(vite代理)
const TkyGetProxy = middlewareServer + "/proxy/get"; // get代理


/**
 * @description: 解密
 * @param {string} data 以base64编码的字符串
 * @return {void}
 */
export function aesDecrypt(data: string) {
	const key = "86hfhf45tru90$77";
	const encryptedBytes = CryptoJS.enc.Base64.parse(data);
	const decrypted = CryptoJS.AES.decrypt(
		{
			ciphertext: encryptedBytes
		},
		CryptoJS.enc.Utf8.parse(key), // 将密钥转换为字节数组
		{
			mode: CryptoJS.mode.ECB, // 使用 ECB 模式
			padding: CryptoJS.pad.Pkcs7 // 使用 PKCS7 填充
		}
	);
	const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
	return decryptedText;
}

async function baseQuery(params) {
	const headers = {
		CRBIMUID: 314636
	};
	const tkyLogin = new TkyLogin();
	await tkyLogin.setCookie();

	params.realUrl = TkyDomain + params.realUrl;

	return axios.get(TkyGetProxy, {
		headers: headers,
		params: params,
		withCredentials: true
	});
}

export async function getSensorLocationBySection(section: string) {
	const res = await baseQuery({
		realUrl: "/czzqdst/apiLook/interface/baseC/findAll",
		tkappid: 10001,
		projectSections: section
	});
	const filterData = [];
	res.data.data.forEach(sensor => {
		filterData.push({
			lon: aesDecrypt(sensor.lon),
			lat: aesDecrypt(sensor.lat),
			name: sensor.name,
			id: sensor.id
		});
	});

	return filterData;
}

/*
 * @Author: Lincong-pro
 * @Date: 2023-09-27 21:04:00
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-30 15:22:31
 * @FilePath: \Geology-V3\src\views\Knowledge\Utils\TkyLogin.ts
 * @Description:
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import axios from 'axios';
import { singleTon } from './DesignMode';
import { EncryptAPI, TkyLoginDomain, TkyPostProxy } from './ServiceProperties';
axios.defaults.withCredentials = true;

class LoginInfo {
	constructor() {
		//
	}

	/**
	 * @description: 获取有效的token
	 * @return {void}
	 */
	async setCookie() {
		return this.login().then((res) => {
			// console.warn(res);
		});
	}
	/**
	 * @description: 刷新验证码
	 * @return {*}
	 */
	private async login() {
		const apiUrl = TkyPostProxy;
		let passwordEncrypted = 'uFtxY2UoudZ57IdfVokl8Q==';

		const jsonData = {
			appname: 'yjjy',
			account: 'czwlj',
			password: passwordEncrypted, // AES加密  St.496413719
			timestamp: Date.now(), //调用登录API时的时间戳
		};
		let encryptedToken = await this.RSAEncrypt(jsonData); // 加密token

		const dataWithToken = {
			...jsonData,
			token: encryptedToken.data.token,
			realUrl: TkyLoginDomain, // 真正的请求地址
		};

		const axiosConfig = {
			method: 'post',
			url: apiUrl,
			withCredentials: true,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			data: dataWithToken,
		};

		return axios(axiosConfig);
	}
	/**
	 * @description: 从Java中进行RSA加密
	 * @param {*} jsonData
	 * @return {*}
	 */
	private RSAEncrypt(jsonData) {
		const axiosConfig = {
			method: 'post',
			url: EncryptAPI,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			data: jsonData,
		};
		return axios(axiosConfig);
	}
}

export default singleTon(LoginInfo);

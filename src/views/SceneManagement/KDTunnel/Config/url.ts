/*
 * @Author: anganao
 * @Date: 2024-03-03 14:05:19
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-19 16:06:34
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnel\Config\url.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import AppConfig from '@/config/AppConfig';

const appConfig = new AppConfig();
const host = appConfig.getConfig().ipServer;
// 不良地质体
const badGeologyUrl = host + '/CZSCZQ-2/LINE/kmz/不良地质.kmz';
const shallowCollapseUrl = host + '/CZSCZQ-2/LINE/kmz/折多塘浅层溜坍.kmz';
const houseUrl = host + '/CZSCZQ-2/LINE/kmz/折多塘浅层溜坍房屋.kmz';
const talusUrl = host + '/CZSCZQ-2/LINE/kmz/折多塘岩堆.kmz';
const sensor = 'http://mon2.guyuanct.com/#/Main';
const labels = host + '/CZSCZQ-2/LINE/json/badGeologyLabel.json';
export {
	host,
	badGeologyUrl,
	shallowCollapseUrl,
	houseUrl,
	talusUrl,
	sensor,
	labels
}
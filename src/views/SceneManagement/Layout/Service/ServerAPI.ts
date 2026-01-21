/*
 * @Author: 枫林残忆
 * @Date: 2024-03-08 16:26:35
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-09 15:55:41
 * @FilePath: \Geology-V3\src\views\SceneManagement\Layout\Service\ServerAPI.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import axios from 'axios';
import { roamServer, imgServer } from './ServiceProperties';

/**
 * 获取漫游路径中的内容
 * @param fileName 文件名
 * @return 文件内容
 */
async function getRoamPath(fileName: string) {
	const jsonData = await axios({
		method: 'GET',
		url: roamServer + fileName,
	});
	return jsonData;
}
/**
 * 更新帧路径
 * @param fileName 文件名
 * @param jsonObj 视角对象
 * @return 操作结果
 */
async function updateRoamPath(fileName: string, jsonObj: any[]) {
	return await axios({
		method: 'PUT',
		url: roamServer + 'updatePath?fileName=' + fileName,
		data: JSON.stringify(jsonObj),
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

/**
 * 添加帧路径
 * @param fileName 文件名
 * @param jsonObj 视角对象
 * @return 操作结果
 */
async function addRoamPath(fileName: string, jsonObj: any[]) {
	return await axios({
		method: 'POST',
		url: roamServer + 'addPath?fileName=' + fileName,
		data: JSON.stringify(jsonObj),
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
/**
 * 删除漫游路径
 * @param fileName 漫游路径
 * @returns 删除状态
 */
async function deleteRoamPath(fileName: string) {
	return await axios({
		method: 'DELETE',
		url: roamServer + 'deletePath?fileName=' + fileName,
	});
}

async function getAllPaths() {
	return await axios({
		method: 'GET',
		url: roamServer + 'getAllPaths',
	});
}

/**
 * 上传blob文件
 * @param blob 二进制blob
 * @return 上传状态
 */
async function uploadImage(blob) {
	const file = new File([blob], 'test.png', { type: 'image/png' });
	const formData = new FormData();
	formData.append('file', file);

	let splitImgServer = imgServer.substring(0, imgServer.length - 1)

	return await axios.post(splitImgServer, formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
}

export { getRoamPath, updateRoamPath, getAllPaths, addRoamPath, deleteRoamPath, uploadImage };

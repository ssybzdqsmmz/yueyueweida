/*
 * @Author: Lincong-pro
 * @Date: 2023-04-13 16:15:37
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-13 16:19:59
 * @FilePath: \geoproject2.0\src\utils\PostEffect\EnvProcess.ts
 * @Description:
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import SnowShader from '@/assets/shaders/snow.fs.glsl?raw';
import RainShader from '@/assets/shaders/rain.fs.glsl?raw';
import { PostProcessStage } from 'Cesium';

/**
 * @description: 使用Cesium内置的函数创建雪效果
 * @return {PostProcessStage}
 */
export function createSnowStage() {
  return new PostProcessStage({
    name: 'czm_snow',
    fragmentShader: SnowShader,
  });
}

/**
 * @description: 使用Cesium内置的函数创建雪效果
 * @return {PostProcessStage}
 */
export function createRainStage() {
  return new PostProcessStage({
    name: 'czm_rain',
    fragmentShader: RainShader,
  });
}

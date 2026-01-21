<!--
 * @Author: Lincong-pro
 * @Date: 2023-09-02 08:25:38
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2024-02-27 15:20:33
 * @FilePath: \Geology-V3\README.md
 * @Description: 
 * Copyright (c) 2023 by VGE, All Rights Reserved. 
-->
# Vue 3 + TypeScript + Vite

#### 降阶模型快速预测模块
> 以拉月隧道为例，点击对应的场景就会有对应的实时预测的效果

- [x] 前端请求执行、调节参数、轮询状态、更新结果
- [x] 后端结合redis和celery实现更新

## 项目配置问题
#### 初次下载Eslint的错误
1.  eslint错误，很可能是之前项目的prettier插件的配置文件问题，endOfLine: 'auto'这个配置可以将LF(linux)和CRLF(windows)格式的正确文件识别
2.  切记，一定要好好配置你的头文件插件Ctrl + Windows + T，Ctrl + Window + I插入文件头文件注释
/*
 * @Author: Lincong-pro
 * @Date: 2024-02-25 20:49:11
 * @LastEditors: 枫林残忆
 * @LastEditTime: 2024-03-11 11:17:03
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnel\Services\ServiceProperties.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import AppConfig from '@/config/AppConfig';

const appConfig = new AppConfig();
const ipServer = appConfig.getConfig().ipServer;
const TFSModel = ipServer + '/CZSCZQ-2/GEOLOGY/volumeSlice/TFS/model.glb';
const TSPModel = ipServer + '/CZSCZQ-2/GEOLOGY/volumeSlice/TSP/Vp.raw.jpg';
const TSPModelConfig = ipServer + '/CZSCZQ-2/GEOLOGY/volumeSlice/TSP/test2.json';

export { ipServer, TFSModel, TSPModel, TSPModelConfig };

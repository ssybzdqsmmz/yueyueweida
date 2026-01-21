/*
 * @Author: ssy
 * @Date: 2024-10-17 16:11:05
 * @LastEditors: ssy
 * @LastEditTime: 2024-10-17 16:36:38
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Tools\adjustlable.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */

import { Viewer, NearFarScalar, Color } from 'Cesium';
import { DTScopeEngine } from '@/utils/Common/Viewer'; // 确保导入 DTScopeEngine 或者传入 viewer 参数
import LODLabel from '../Config/LODLabel.json';

const adjustPointLabel = {
  callback: (lod: string) => {
    let roadDataSource, stationDataSource, viewer;

    viewer = DTScopeEngine.viewer;
    roadDataSource = viewer.dataSources.getByName('地名路段')[0];
    stationDataSource = viewer.dataSources.getByName('沿线车站点')[0];

    if (!roadDataSource || !stationDataSource) {
      return; // 图层未初始化完毕
    }

    roadDataSource.entities.values.forEach((group) => {
      if (group.label) {
        const text = group.label.text._value;
        const labels = LODLabel[lod];

        if (labels.includes(text)) {
          group.label.show = true;
          group.label.scaleByDistance = new NearFarScalar(6000, 0.6, 30000, 1);
          if (text.includes('道')) {
            group.label.fillColor = Color.fromBytes(0, 102, 164);
            group.label.font = 'bold 13px sans-serif';
            group.label.outlineColor = Color.WHITE; // 设置边框颜色
            group.label.outlineWidth = 1; // 设置边框宽度
          } else if (text.includes('桥')) {
            group.label.fillColor = Color.fromBytes(230, 46, 0);
            group.label.font = 'bold 13px sans-serif';
            group.label.outlineColor = Color.WHITE; // 设置边框颜色
            group.label.outlineWidth = 1; // 设置边框宽度
          } else {
            group.label.fillColor = Color.fromBytes(37, 139, 35);
            group.label.font = 'bold 15px sans-serif';
            group.label.outlineColor = Color.WHITE; // 设置边框颜色
            group.label.outlineWidth = 2; // 设置边框宽度
          }
        } else {
          group.label.show = false;
        }
      }
    });

    stationDataSource.entities.values.forEach((group) => {
      if (group.label) {
        const text = group.label.text._value;
        const labels = LODLabel[lod];

        if (labels.includes(text)) {
          group.label.show = true;
          group.label.scaleByDistance = new NearFarScalar(6000, 0.6, 30000, 1);
          if (text.includes('站')) {
            group.label.fillColor = Color.fromBytes(255, 90, 0);
            group.label.font = 'bold 15px sans-serif';
            group.label.outlineColor = Color.WHITE; // 设置边框颜色
            group.label.outlineWidth = 1; // 设置边框宽度
          } else {
            group.label.fillColor = Color.fromBytes(37, 139, 35);
          }
        } else {
          group.label.show = false;
        }
      }
      if (!roadDataSource.show) {
        roadDataSource.show = true;
      }
      if (!stationDataSource.show) {
        stationDataSource.show = true;
      }
    });
  },

  clearTrash: () => {
    let viewer = DTScopeEngine.viewer;
    viewer.dataSources.remove(viewer.dataSources.getByName('地名路段')[0], true);
    viewer.dataSources.remove(viewer.dataSources.getByName('沿线车站点')[0], true);
  },
};

const adjustAreaLabel = (layerName: string, isVisible: boolean) => {
  let viewer;
  const dataSource = viewer.dataSources.getByName(layerName)[0];

  if (dataSource) {
    dataSource.show = isVisible; // 更新图层的可见性
    dataSource.entities.values.forEach((entity) => {
      if (entity.label) {
        entity.label.show = isVisible; // 更新每个实体的标签可见性
      }
    });
  } else {
    console.error(`DataSource with name "${layerName}" not found.`);
  }
};

export { adjustPointLabel, adjustAreaLabel };

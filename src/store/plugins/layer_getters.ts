/*
 * @Author: Lincong-pro
 * @Date: 2023-09-03 19:25:20
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-09-04 12:14:41
 * @FilePath: \GeoProject\src\store\plugins\layer_getters.ts
 * @Description: store对应的getters
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */

export default {
  treeNodes: (state) => state.treeNodes,
  hiddenLayers: (state) => state.hiddenLayers,
  visibleLayers: (state) => state.visibleLayers,
  folderName: (state) => state.folderName,
};

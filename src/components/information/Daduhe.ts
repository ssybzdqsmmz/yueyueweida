/*
 * @Author: Lincong-pro
 * @Date: 2023-04-15 16:33:19
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-04-22 12:46:34
 * @FilePath: \geoproject2.0\src\components\information\Daduhe.ts
 * @Description: 单纯的用于大渡河子视角切换
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
const DaduheView = {
  拉萨岸: {
    viewPnt: {
      Orientation: {
        heading: 5.399212506230457,
        pitch: -0.432579824128494,
        roll: 6.280713904375965,
      },
      Position: {
        longitude: 102.240465,
        latitude: 29.9252515,
        height: 2338.9089277,
      },
    },
    layers: ['基础影像', 'DOM_大渡河_低精度', 'DEM', 'DOM_大渡河_高精度', '基础施工辅助设施', '下部结构', '上部结构', '附属设施'],
  },
  成都岸: {
    viewPnt: {
      Orientation: {
        heading: 1.4871355048062433,
        pitch: -0.49840920504537145,
        roll: 0.003289578026932638,
      },
      Position: {
        longitude: 102.2141985,
        latitude: 29.9243107,
        height: 2678.6912405,
      },
    },
    layers: ['基础影像', 'DOM_大渡河_低精度', 'DEM', 'DOM_大渡河_高精度', '基础施工辅助设施', '下部结构', '上部结构', '附属设施'],
  },
  俯瞰视角: {
    viewPnt: {
      Orientation: {
        heading: 0.14378638571797175,
        pitch: -1.1084894207420484,
        roll: 0.0009359282361600663,
      },
      Position: {
        longitude: 102.2302377,
        latitude: 29.861699,
        height: 17841.6717809,
      },
    },
    layers: ['基础影像', 'DOM_大渡河_低精度', 'DEM', 'DOM_大渡河_高精度', '基础施工辅助设施', '下部结构', '上部结构', '附属设施'],
  },
  侧面视角: {
    viewPnt: {
      Orientation: {
        heading: 6.0507879202402926,
        pitch: -0.9946386548457218,
        roll: 6.281954429536924,
      },
      Position: {
        longitude: 102.2320713,
        latitude: 29.9211445,
        height: 3510.3712094,
      },
    },
    layers: ['基础影像', 'DOM_大渡河_低精度', 'DEM', 'DOM_大渡河_高精度', '基础施工辅助设施', '下部结构', '上部结构', '附属设施'],
  },
  水流流向: [
    {
      longitude: 102.2295977,
      latitude: 29.9357931,
      height: 1275,
    },
    {
      longitude: 102.2298379,
      latitude: 29.9338749,
      height: 1275,
    },
    {
      longitude: 102.2295735,
      latitude: 29.9317419,
      height: 1275,
    },
    {
      longitude: 102.2287396,
      latitude: 29.9297932,
      height: 1275,
    },
    {
      longitude: 102.2279543,
      latitude: 29.9281163,
      height: 1275,
    },
    {
      longitude: 102.2274112,
      latitude: 29.9269316,
      height: 1275,
    },
    {
      longitude: 102.2270396,
      latitude: 29.9260111,
      height: 1275,
    },
  ],
  测试: {
    viewPnt: {
      Orientation: {
        heading: 6.0507879202402926,
        pitch: -0.9946386548457218,
        roll: 6.281954429536924,
      },
      Position: {
        longitude: 101.6976999,
        latitude: 30.0900555,
        height: 3910.3712094,
      },
    },
    layers: ['基础影像', 'DOM_大渡河_低精度', '出口工区DSM_最新'],
  },
};

export default DaduheView;

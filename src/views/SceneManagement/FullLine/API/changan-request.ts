/*
 * @Author: Lincong-pro
 * @Date: 2024-01-05 16:22:03
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-19 10:29:38
 * @FilePath: \Geology-v3\src\views\SceneManagement\FullLine\API\changan-request.ts
 * @Description: 长安大学的SAR数据
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import ddhKmz from './ddh.json';
import batangAKmz from './ascent.json';
import batangDKmz from './descent.json';
import { ipServer } from '../Services/ServiceProperties';

const FullLine_BASE_URL = ipServer + '/FullLine/Line/kml/';

const STATION_LABEL = FullLine_BASE_URL + '地名路段.kml';
const STATION_LABEL_HIGH = FullLine_BASE_URL + '地名路段高空版本.kml';
// const LANDSLIDE_RISK_POINT = FullLine_BASE_URL + '滑坡隐患_点位.kml';
const LANDSLIDE_RISK_RANGE = FullLine_BASE_URL + '滑坡隐患_范围.kmz';
// const LANDSLIDE_RISK_TYPE = FullLine_BASE_URL + '滑坡隐患_类型.kmz';
const LINE = FullLine_BASE_URL + '路线.kml';

// const LJ_BASE_URL = appConfig.VITE_DATA_URL + '/LJ/怒江大桥-古巴滑坡-InSAR结果';
// const LJ_FRAME_1 = LJ_BASE_URL + '/JINSHA1.kmz';
// const LJ_FRAME_2 = LJ_BASE_URL + '/JINSHA2.kmz';
// const LJ_FRAME_3 = LJ_BASE_URL + '/JINSHA3.kmz';
// const LJ_FRAME_4 = LJ_BASE_URL + '/JINSHA4.kmz';
// const CZ_OLD_6 = LJ_BASE_URL + '/c6_old.kmz';
// const CZ_6 = LJ_BASE_URL + '/c6.kmz';

const JSJ_BASE_URL = ipServer + '/JinshaRiver/LINE/kml/金沙江大桥-古巴滑坡-InSAR结果';
const A_2014_2022 = JSJ_BASE_URL + '/A_2014_2022.tif.kml';
const ALOS_1_2007_2010 = JSJ_BASE_URL + '/ALOS_1_2007_2010.tif.kml';
const ALOS_2_2016_2020 = JSJ_BASE_URL + '/ALOS_2_2016_2020.tif.kml';
const D_2014_2023 = JSJ_BASE_URL + '/D_2014_2023.tif.kml';

/**
 * @description: 全线kml数据
 * @return {*}
 */
export const fullLine = [
  // { kml: LANDSLIDE_RISK_POINT, label: '滑坡隐患_点位', visible: true },
  { kml: STATION_LABEL_HIGH, label: '地名路段高空版本', visible: true },
  // { kml: LINE, label: '全线线路', visible: true },
  { kml: STATION_LABEL, label: '地名路段', visible: false },
  // { kml: LANDSLIDE_RISK_RANGE, label: '滑坡隐患_范围', visible: false },
  // { kml: LANDSLIDE_RISK_TYPE, label: '滑坡隐患_类型', visible: false },
];

/**
 * @description: 怒江
 */
// export const lj = [
//   { kml: LJ_FRAME_1, label: 'JINSHA1' },
//   { kml: LJ_FRAME_2, label: 'JINSHA2' },
//   { kml: LJ_FRAME_3, label: 'JINSHA3' },
//   { kml: LJ_FRAME_4, label: 'JINSHA4' },
//   // { kml: CZ_OLD_6, label: "cz_old_6" },
//   // { kml: CZ_6, label: "cz_6" }
// ];

export const jsj = [
  { kml: A_2014_2022, label: 'A_2014_2022' },
  { kml: ALOS_1_2007_2010, label: 'ALOS_1_2007_2010' },
  { kml: ALOS_2_2016_2020, label: 'ALOS_2_2016_2020' },
  { kml: D_2014_2023, label: 'D_2014_2023' },
];

interface Layer {
  kml: string;
  label: string;
}
/**
 * @description: 从图层数组中查找指定图层
 * @param {string} labels
 * @param {Layer} obj
 * @return {*}
 */
export function getItemsByLabel(labels: string[], obj: Layer[]) {
  let items = [];
  for (let i = 0; i < obj.length; ++i) {
    let label = obj[i].label;
    if (labels.includes(label)) {
      items.push(obj[i]);
    }
  }
  return items;
}

/**
 * @description: 长安大学给的几个监测点
 * @return {*}
 */
export const batangMonitor = [
  {
    label: 'p1',
    position: [99.407929, 30.30289, 3794.0],
    size: 0.1,
  },
  {
    label: 'p2',
    position: [99.417083, 30.305577, 4300.0],
    size: 0.1,
  },
  {
    label: 'p3',
    position: [99.418168, 30.298518, 4190.0],
    size: 0.1,
  },
  {
    label: 'CBPC1',
    position: [102.235, 29.9279, 4190.0],
    size: 0.5,
  },
  {
    label: 'CBPC2',
    position: [102.234, 29.9311, 4190.0],
    size: 0.5,
  },
  {
    label: 'CBPC3',
    position: [102.2346, 29.9297, 4190.0],
    size: 0.5,
  },
  {
    label: 'CBPC4',
    position: [102.234, 29.9282, 4190.0],
    size: 0.5,
  },
];

export const ddh = ddhKmz;
export const batangA = batangAKmz;
export const batangD = batangDKmz;
export const batangLabel = [
  {
    kml: ipServer + '/Batang/LINE/kml/巴塘车站-滑坡群-属性信息.kmz',
    label: '滑坡群-属性信息',
  },
  {
    kml: ipServer + '/Batang/LINE/kml/巴塘车站-扎马滑坡-属性信息.kmz',
    label: '扎马滑坡-属性信息',
  },
];

/*
 * @Author: Lincong-pro
 * @Date: 2023-03-10 11:59:50
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-23 12:35:55
 * @FilePath: \geoproject2.0\src\api\types.ts
 * @Description: 数据类型接口
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */

// export interface User {
//   username: string;
//   password: string;
// }
export enum NetworkType {
  Success = -1, // 请求成功
  Failed = 0, // 请求失败
  Loading = 1, // 正在获取数据中
}

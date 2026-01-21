/*
 * @Author: Lincong-pro
 * @Date: 2024-02-25 12:43:17
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2024-02-26 13:59:03
 * @FilePath: \Geology-V3\src\views\SceneManagement\Layout\Tools\DesignModel.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
export function singleTon<T>(classType: { new (...args: any[]): T }) {
  let instance;
  return new Proxy(classType, {
    construct: function (target, args) {
      if (!instance) {
        instance = new target(...args);
        Object.defineProperty(classType.prototype, 'constructor', {
          value: undefined,
          writable: false,
          enumerable: false,
          configurable: true,
        });
      }

      return instance;
    },
  });
}

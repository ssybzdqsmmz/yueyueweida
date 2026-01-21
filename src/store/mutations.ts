/*
 * @Author: changfanhao
 * @Date: 2023-02-28 10:15:12
 * @LastEditors: changfanhao
 * @LastEditTime: 2023-03-28 15:41:48
 * @FilePath: \GeoProject\src\store\mutations.ts
 * @Description:
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
let mutations = {
  leftPanelMainBtn_change(state, index: number): void {
    state.leftPanelMainBtn = index;
  },
  leftPanelChildBtn_change(state, index: number): void {
    state.leftPanelChildBtn = index;
  },
};
export default mutations;

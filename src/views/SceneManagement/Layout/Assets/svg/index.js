/*
 * @Author: cl
 * @Date: 2021-03-02 14:27:41
 * @LastEditTime: 2024-02-26 14:49:36
 * @LastEditors: Lincong-pro
 * @FilePath: \Geology-V3\src\views\SceneManagement\Layout\Assets\icons\index.js
 */
import SvgIcon from '@/components/SvgIcon/index.vue'; // svg组件

// // 注册到全局
// Vue.component('svg-icon', SvgIcon);

// const requireAll = (requireContext) => requireContext.keys().map(requireContext);
// const req = require.context('./svg', false, /\.svg$/);
// requireAll(req);
export default (app) => {
  app.component('svg-icon', SvgIcon);
};

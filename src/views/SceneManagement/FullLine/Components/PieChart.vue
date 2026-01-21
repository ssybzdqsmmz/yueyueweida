<!--
 * @Author: h2qisme 874175299@qq.com
 * @Date: 2024-04-13 14:38:28
 * @LastEditors: h2qisme 12671442+h2qisme@user.noreply.gitee.com
 * @LastEditTime: 2024-06-28 15:50:31
 * @FilePath: \Geology-v3\src\views\SceneManagement\FullLine\Components\PieChart.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="outer">
    <div class="title"></div>
    <div class="PiePie" id="Pie1"></div>
    <div class="PiePie" id="Pie2"></div>
    <div class="PiePie" id="Pie3"></div>
    <div class="PiePie" id="Pie4"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onUnmounted } from 'vue';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import * as Cesium from 'Cesium';
import AllLine from '../Config/AllLine.json';
import * as turf from '@turf/turf';
import zuanbaofa from '../Config/zuanbaofa.json';
import tbm from '../Config/tbm.json';
import quanxian from '../Config/quanxian.json';

function clickCallback(params) {
  let viewer = DTScopeEngine.viewer;
  // 如果当前饼图已经被点击过，则移除之前添加的点
  // let isClicked = true;
  // viewer.entities.removeAll();

  viewer.entities.values.slice().forEach((entity) => {
    if (entity.name === 'currentComponentEntity') {
      viewer.entities.remove(entity);
    }
  });

  // if (isClicked) {
  //   viewer.entities.removeAll();
  //   isClicked = false; // 重置为未点击状态
  //   return;
  // }
  // console.log(isClicked);

  if (params.seriesName === '钻爆法风险分布') {
    // 执行钻爆法风险分布对应的点击事件处理函数
    drillBlastingRiskHandler();
  } else if (params.seriesName === 'TBM隧道风险分布') {
    // 执行TBM隧道风险等级对应的点击事件处理函数
    tbmTunnelRiskHandler();
  } else if (params.seriesName === '不良地质统计') {
    // 执行不良地质统计对应的点击事件处理函数
    poorGeologyStatsHandler();
  }
}
// 钻爆法风险分布对应的点击事件处理函数
function drillBlastingRiskHandler() {
  console.log('钻爆法风险分布被点击了');
  let viewer = DTScopeEngine.viewer;
  // if (viewer.entities.getById('poorGeologyPoints')) {
  //   viewer.entities.removeById('poorGeologyPoints');
  //   return;
  // }
  const points = zuanbaofa;

  points.forEach((point) => {
    viewer.entities.add({
      // id: 'poorGeologyPoints',
      name: 'currentComponentEntity',
      position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude),
      // point: {
      //   color: Cesium.Color.YELLOW,
      //   pixelSize: 20,
      // },
      billboard: {
        image: 'src/views/SceneManagement/FullLine/images/f1.svg', // 替换成你的 logo 图片路径
        width: 35, // 设置 logo 的宽度
        height: 35, // 设置 logo 的高度
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 设置水平方向位置为中心
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 设置垂直方向位置为中心
        // pixelOffset: new Cesium.Cartesian2(0, 10),
      },
    });
  });
}

// TBM隧道风险等级对应的点击事件处理函数
function tbmTunnelRiskHandler() {
  console.log('TBM隧道风险等级被点击了');
  let viewer = DTScopeEngine.viewer;
  // if (viewer.entities.getById('tbmTunnelPoints')) {
  //   viewer.entities.removeById('tbmTunnelPoints');
  //   return;
  // }
  const points = tbm;

  points.forEach((point) => {
    viewer.entities.add({
      // id: 'tbmTunnelPoints',
      name: 'currentComponentEntity',
      position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude),
      // point: {
      //   color: Cesium.Color.RED,
      //   pixelSize: 20,
      // },
      billboard: {
        image: 'src/views/SceneManagement/FullLine/images/f2.svg', // 替换成你的 logo 图片路径
        width: 35, // 设置 logo 的宽度
        height: 35, // 设置 logo 的高度
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 设置水平方向位置为中心
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 设置垂直方向位置为中心
        // pixelOffset: new Cesium.Cartesian2(0, 10),
      },
    });
  });
}

// 不良地质统计对应的点击事件处理函数
function poorGeologyStatsHandler() {
  console.log('不良地质统计被点击了');
  // 如果已经添加了点，则移除之前添加的点
  let viewer = DTScopeEngine.viewer;
  // if (viewer.entities.getById('poorGeologyPoints')) {
  //   viewer.entities.removeById('poorGeologyPoints');
  //   return;
  // }
  const points = quanxian;

  points.forEach((point) => {
    viewer.entities.add({
      // id: 'poorGeologyPoints',
      name: 'currentComponentEntity',
      position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude),
      // point: {
      //   color: Cesium.Color.BLUE,
      //   pixelSize: 20,
      // },
      billboard: {
        image: 'src/views/SceneManagement/FullLine/images/f3.svg', // 替换成你的 logo 图片路径
        width: 35, // 设置 logo 的宽度
        height: 35, // 设置 logo 的高度
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 设置水平方向位置为中心
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 设置垂直方向位置为中心
        // pixelOffset: new Cesium.Cartesian2(0, 10),
      },
    });
  });
}

// function getOption(pie, title, data) {
//   pie.setOption({
//     title: {
//       text: title,
//       left: 'center',
//       textStyle: {
//         fontSize: 23,
//         color: 'white',
//         fontWeight: 'normal',
//         fontFamily: 'TRENDS',
//       },
//     },
//     tooltip: {
//       trigger: 'item',
//     },
//     series: [
//       {
//         name: title,
//         center: ['50%', '60%'],
//         type: 'pie',
//         radius: '75',
//         data,
//         emphasis: {
//           itemStyle: {
//             shadowBlur: 10,
//             shadowOffsetX: 0,
//             shadowColor: 'rgba(0, 0, 0, 0.5)',
//           },
//         },
//       },
//     ],
//   });
// }

function getOption(pie, title, data) {
  const color = ['#00ffff', '#ff3000', '#006ced', '#ffe000', '#ffa800', '#ff5b00', '#ff3000'];
  const seriesData = [];
  for (let i = 0; i < data.length; i++) {
    seriesData.push(
      {
        value: data[i].value,
        name: data[i].name,
        itemStyle: {
          normal: {
            borderWidth: 12,
            shadowBlur: 10,
            borderColor: color[i],
            shadowColor: color[i],
          },
        },
      }
      // {
      //   value: 2,
      //   name: '',
      //   itemStyle: {
      //     normal: {
      //       label: {
      //         show: false,
      //       },
      //       labelLine: {
      //         show: false,
      //       },
      //       color: 'rgba(0, 0, 0, 0)',
      //       borderColor: 'rgba(0, 0, 0, 0)',
      //       borderWidth: 0,
      //     },
      //   },
      // }
    );
  }
  pie.setOption({
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 23,
        color: 'white',
        fontWeight: 'normal',
        fontFamily: 'TRENDS',
      },
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: title,
        type: 'pie',
        clockWise: false,
        radius: [40, 45],
        center: ['50%', '55%'],
        hoverAnimation: false,
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return params.data.name + ': ' + params.data.value;
          },
        },
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'outside',
              color: '#ddd',
              textStyle: {
                color: '#fff',
                fontSize: 17,
                fontWeight: 'normal',
                fontFamily: 'TRENDS',
              },
              formatter: function (params) {
                const percent = ((params.value / data.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(0);
                if (params.name !== '') {
                  // eslint-disable-next-line no-useless-concat
                  return params.name + '\n' + '\n' + percent + '%';
                }
                return '';
              },
            },
            labelLine: {
              length: 21,
              length2: 31,
              show: true,
              // color: '#00ffff',
              lineStyle: {
                width: 3, // 调整标签线的宽度
                color: 'white',
              },
            },
          },
        },
        data: seriesData,
      },
    ],
  });
}

const trashCollections = [];

onMounted(() => {
  const surrounding = [
    { value: 568, name: 'Ⅴ级围岩' },
    { value: 432, name: 'Ⅳ级围岩' },
    { value: 311, name: 'Ⅲ级围岩' },
    { value: 209, name: 'Ⅱ级围岩' },
  ];
  const badGeology = [
    { value: 1029, name: '涌水' },
    { value: 773, name: '破碎带' },
    { value: 218, name: '岩溶' },
    { value: 894, name: '瓦斯' },
    { value: 343, name: '岩爆' },
    { value: 1955, name: '塌方' },
  ];

  const zuanbaofa = [
    { value: 966, name: '涌水' },
    { value: 761, name: '破碎带' },
    { value: 218, name: '岩溶' },
    { value: 894, name: '瓦斯' },
    { value: 343, name: '岩爆' },
    { value: 1955, name: '塌方' },
  ];

  const tbm = [
    { value: 63, name: '涌水' },
    { value: 12, name: '破碎带' },
    { value: 70, name: '岩爆' },
    { value: 103, name: '塌方' },
  ];

  let Pie1 = echarts.init(document.getElementById('Pie1'));
  getOption(Pie1, '钻爆法风险分布', zuanbaofa);
  let Pie2 = echarts.init(document.getElementById('Pie2'));
  getOption(Pie2, 'TBM隧道风险分布', tbm);
  let Pie3 = echarts.init(document.getElementById('Pie3'));
  getOption(Pie3, '不良地质统计', badGeology);
  Pie1.on('click', clickCallback);
  Pie2.on('click', clickCallback);
  Pie3.on('click', clickCallback);

  const spatialize = (target_length, coordinates) => {
    let cumulative_length = 0;
    if (target_length < cumulative_length) {
      return null;
    }

    let result_coordinate = null;

    for (let i = 0; i < coordinates.length - 1; i++) {
      let start_point = coordinates[i];
      let end_point = coordinates[i + 1];
      let segment_length = turf.distance(start_point, end_point, { units: 'meters' });

      cumulative_length += segment_length;

      if (cumulative_length >= target_length) {
        let remaining_length = target_length - (cumulative_length - segment_length);
        let ratio = remaining_length / segment_length;

        let interpolated_longitude = start_point[0] + ratio * (end_point[0] - start_point[0]);
        let interpolated_latitude = start_point[1] + ratio * (end_point[1] - start_point[1]);
        result_coordinate = [interpolated_longitude, interpolated_latitude];

        break;
      }
    }

    return result_coordinate;
  };

  const getValue = (points) => {
    // 初始化存储结果的数组
    const result = [];

    // 遍历输入的 JSON 对象数组
    points.forEach((point) => {
      const feature = AllLine.features[0];
      const geometry = feature.geometry;
      const coordinates = geometry.coordinates;

      // 使用当前点的 x 和 y 值调用 spatialize 函数，并获取结果坐标
      const result_coordinate = spatialize(parseFloat(point.x) * 1000 + parseFloat(point.y), coordinates);

      // 检查结果坐标是否为空
      if (!result_coordinate) {
        alert('超出里程！');
        return;
      }

      // 构建包含经纬度的 JSON 对象，并添加到结果数组中
      result.push({ x: point.x, y: point.y, longitude: result_coordinate[0], latitude: result_coordinate[1] });
    });

    // 将结果数组转换为 JSON 格式的字符串并输出
    console.log(JSON.stringify(result));
  };

  // 示例 JSON 对象数组
  //全线的里程
  const points1 = [
    { x: 414, y: 579 },
    { x: 972, y: 151 },
    { x: 909, y: 676 },
    { x: 300, y: 314 },
    { x: 298, y: 22 },
    { x: 246, y: 814 },
    { x: 207, y: 483 },
    { x: 1008, y: 488 },
    { x: 273, y: 144 },
    { x: 738, y: 867 },
    { x: 280, y: 519 },
    { x: 773, y: 395 },
    { x: 440, y: 646 },
    { x: 819, y: 615 },
  ];
  //tbm的里程
  const points2 = [
    { x: 1014, y: 735 },
    { x: 1014, y: 299 },
    { x: 1012, y: 719 },
    { x: 1013, y: 290 },
    { x: 735, y: 237 },
    { x: 1041, y: 487 },
    { x: 1014, y: 862 },
    { x: 737, y: 415 },
    { x: 707, y: 793 },
  ];

  let Pie4 = echarts.init(document.getElementById('Pie4'));
  getOption(Pie4, '围岩等级', surrounding);
  Pie4.on('click', function (params) {
    let viewer = DTScopeEngine.viewer;
    // 如果当前饼图已经被点击过，则移除之前添加的点
    // let isClicked = true;
    viewer.entities.values.slice().forEach((entity) => {
      if (entity.name === 'currentComponentEntity') {
        viewer.entities.remove(entity);
      }
    });
  });

  trashCollections.push(() => {
    Pie1.dispose();
    Pie2.dispose();
    Pie3.dispose();
    Pie4.dispose();
  });
});
onUnmounted(() => {
  trashCollections.forEach((trash) => {
    trash();
  });
});
</script>

<style lang="scss">
.PieChart {
  display: grid;
  position: absolute;
  bottom: 190px;
  right: 10px;
  z-index: 1;
  font-size: 20px;
  background-color: rgb(0 0 0 / 60%);
}

.outer {
  display: flex;
  position: absolute;
  right: 50px;
  bottom: 40px;
  z-index: 1;
  padding: 10px;
  border-radius: 60px;
  background-color: rgb(25 86 94 / 70%);

  /* .title {
    width: inherit;
    width: 1500px;
    height: 1px;
    font-size: 18px;
    text-align: center;
  } */

  .PiePie {
    width: 380px;
    height: 250px;
    margin: 0 10px;
    border-right: 1px solid white;

    &:last-child {
      border: none;
    }

    /* background-color: pink; */
  }
}
</style>

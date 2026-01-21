<!--
 * @Author: 枫林残忆
 * @Date: 2024-03-14 16:32:07
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-07-16 20:42:58
 * @FilePath: \Geology-v3\src\views\Knowledge\KnowledgeVisual.vue
 * @Description: 用于知识图谱的显示
 * Copyright (c) 2024 by VGE, All Rights Reserved. 
-->
<script lang="ts" setup>
import { onUnmounted } from 'vue';
import { queryNodeAndRelationByLabel } from './Utils/API';
import G6, { Graph, IG6GraphEvent } from '@antv/g6';
import { generateDisasterNodeStyle, generateDisasterEdgeStyle } from './Utils/Bussiness';

const legendData = {
  nodes: [
    {
      id: 'income',
      label: 'Income',
      order: 0,
      style: {
        fill: '#61DDAA',
      },
    },
    {
      id: 'outcome',
      label: 'Outcome',
      order: 2,
      style: {
        fill: '#F08BB4',
      },
    },
    {
      id: 'unknown',
      label: 'Unknown',
      order: 2,
      style: {
        fill: '#65789B',
      },
    },
  ],
};

const trashCollection = [];

async function render(themeGraph) {
  let nodeAndRelations = await queryNodeAndRelationByLabel(themeGraph);

  // 创建裁剪路径
  const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
  clipPath.setAttribute('id', 'edgeTextClipPath');

  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', '100px');
  rect.setAttribute('y', '100px');
  rect.setAttribute('width', '100px');
  rect.setAttribute('height', '100px');

  const plugins = [
    // new G6.Minimap({
    //   size: [100, 100],
    //   className: 'minimap',
    //   type: 'delegate',
    // }),
    // new G6.Grid(),
    // new G6.Legend({
    //   data: legendData,
    //   align: 'center',
    //   layout: 'horizontal',
    // }),
    new G6.Legend({
      data: legendData,
      align: 'center',
      layout: 'horizontal', // vertical
      position: 'bottom-left',
      vertiSep: 12,
      horiSep: 24,
      offsetY: -24,
      padding: [4, 16, 8, 16],
      containerStyle: {
        fill: '#ccc',
        lineWidth: 1,
      },
      title: ' ',
      titleConfig: {
        offsetY: -8,
      },
    }),
  ];

  const graphContainer = document.getElementById('graphContainer');
  const width = graphContainer.scrollWidth;
  const height = graphContainer.scrollHeight;
  // registerClickBehavior();

  let graph: Graph = new G6.Graph({
    plugins: plugins,
    container: graphContainer,
    width,
    height,
    // linkCenter: true,
    animate: true,
    fitView: true,
    animateCfg: {
      duration: 2000,
      easing: 'linearEasing',
    },
    layout: {
      type: 'force',
      preventOverlap: true,
      gravity: 1,
      // linkDistance: 300, // 节点之间的距离
      nodeStrength: 50, // 节点间斥力大小
      edgeStrength: 1, // 边的弹簧系数
      nodeSpacing: 50,
      // workerEnabled: true,
    },
    defaultNode: {
      type: 'circle',
      size: 55,
      style: {
        fill: '#C6E5FF',
        stroke: '#5B8FF9',
        lineWidth: 0,
      },
      labelCfg: {
        position: 'center',
        style: {
          // fill: "#5B8FF9",
          fontSize: 12,
        },
      },
    },
    modes: {
      default: ['drag-canvas', 'drag-node', 'zoom-canvas'],
    },
    defaultEdge: {
      style: {
        // opacity: 0.6,
        stroke: 'gray',
        endArrow: {
          path: 'M 0,0 L 10,5 L 10,-5 Z', // 设置箭头的路径，这里使用了自定义的箭头形状
          fill: 'gray', // 设置箭头的填充颜色
        },
      },
      labelCfg: {
        refY: 13,
        autoRotate: true, // 边上的标签文本根据边的方向旋转
        style: {
          stroke: 'rgb(249 252 255)', // 覆盖边
          fontSize: 12,
          padding: 4,
          fill: 'gray',
        },
      },
    },
    nodeStateStyles: {
      // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
      hover: {
        shadowBlur: 10, // 阴影模糊程度
        shadowColor: 'rgba(0, 0, 0, 0.3)', // 阴影颜色
        shadowOffsetX: 0, // 阴影水平偏移
        shadowOffsetY: 0, // 阴影垂直偏移
      },
      // 鼠标点击节点，即 click 状态为 true 时的样式
      click: {
        shadowBlur: 10, // 阴影模糊程度
        shadowColor: 'rgba(0, 0, 0, 0.3)', // 阴影颜色
        shadowOffsetX: 0, // 阴影水平偏移
        shadowOffsetY: 0, // 阴影垂直偏移
      },
    },
    // 边在各状态下的样式
    edgeStateStyles: {
      // click 状态为 true 时的样式
      click: {
        stroke: 'steelblue',
        shadowBlur: 10, // 阴影模糊程度
        shadowColor: 'rgba(0, 0, 0, 0.3)', // 阴影颜色
        shadowOffsetX: 0, // 阴影水平偏移
        shadowOffsetY: 0, // 阴影垂直偏移
      },
      hover: {
        stroke: 'steelblue',
        shadowBlur: 10, // 阴影模糊程度
        shadowColor: 'rgba(0, 0, 0, 0.3)', // 阴影颜色
        shadowOffsetX: 0, // 阴影水平偏移
        shadowOffsetY: 0, // 阴影垂直偏移
      },
    },
  });

  // 鼠标进入节点
  graph.on('node:mouseenter', (e) => {
    const nodeItem = e.item; // 获取鼠标进入的节点元素对象
    graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
    // graph.setItemState(nodeItem, 'active', true);

    graph.get('canvas').setCursor('pointer');
  });

  // 鼠标离开节点
  graph.on('node:mouseleave', (e) => {
    const nodeItem = e.item; // 获取鼠标离开的节点元素对象
    graph.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
    // graph.setItemState(nodeItem, 'active', false);
    graph.get('canvas').setCursor('default');
  });

  // 鼠标进入节点
  graph.on('edge:mouseenter', (e) => {
    const nodeItem = e.item; // 获取鼠标进入的节点元素对象
    graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
  });

  // 鼠标离开节点
  graph.on('edge:mouseleave', (e) => {
    const nodeItem = e.item; // 获取鼠标离开的节点元素对象
    graph.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
  });

  // 点击节点
  graph.on('node:click', (e) => {
    // 先将所有当前是 click 状态的节点置为非 click 状态
    const clickNodes = graph.findAllByState('node', 'click');
    clickNodes.forEach((cn) => {
      graph.setItemState(cn, 'click', false);
    });
    const nodeItem = e.item; // 获取被点击的节点元素对象
    graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true
  });

  // 点击边
  graph.on('edge:click', (e) => {
    // 先将所有当前是 click 状态的边置为非 click 状态
    const clickEdges = graph.findAllByState('edge', 'click');
    clickEdges.forEach((ce) => {
      graph.setItemState(ce, 'click', false);
    });
    const edgeItem = e.item; // 获取被点击的边元素对象
    graph.setItemState(edgeItem, 'click', true); // 设置当前边的 click 状态为 true
  });

  const refreshDragedNodePosition = (e) => {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
  };

  graph.on('node:dragstart', function (e) {
    refreshDragedNodePosition(e);
  });
  graph.on('node:drag', function (e) {
    refreshDragedNodePosition(e);
  });
  graph.on('node:dragend', function (e) {
    e.item.get('model').fx = null;
    e.item.get('model').fy = null;
    graph.layout();
  });

  // 添加style
  generateDisasterNodeStyle(nodeAndRelations.nodes);

  generateDisasterEdgeStyle(nodeAndRelations.edges);

  graph.data({
    nodes: nodeAndRelations.nodes,
    edges: nodeAndRelations.edges,
  });

  // if (themeGraph == 'DebrisflowHazard') {
  //   graph.updateLayout({
  //     type: 'force',
  //     preventOverlap: true,
  //     gravity: 1,
  //     linkDistance: 300, // 节点之间的距离
  //     nodeStrength: 50, // 节点间斥力大小
  //     edgeStrength: 10, // 边的弹簧系数
  //     nodeSpacing: 50,
  //     workerEnabled: true,
  //   });
  // }

  graph.render();

  trashCollection.push(() => {
    graph.destroy(); // 销毁数据
  });
}

function clearCanvas() {
  for (let trash of trashCollection) {
    trash();
  }
}

defineExpose({
  render,
  clearCanvas,
});

onUnmounted(() => {
  for (let trash of trashCollection) {
    trash();
  }
});
</script>

<template>
  <div id="graphContainer"></div>
</template>

<style lang="scss" scoped>
#graphContainer {
  position: absolute;
  top: 120px;
  right: 5px;
  z-index: 1;
  width: 450px;
  height: 550px;
  background-color: rgb(14 63 66 / 40%);
}

.g6-legend-container {
  position: fixed !important;
}
</style>

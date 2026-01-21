<!--
 * @Date: 2023-03-26 16:45:36
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-07-22 20:25:09
 * @FilePath: \Geology-v3\src\views\Knowledge\KnowledgeMapping.vue
-->
<template>
  <div><div id="mountNode"></div></div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import G6, { Graph } from '@antv/g6';
import axios from 'axios';
const props = defineProps<{ kgTab: number }>();

//封装获取neo4j数据请求
async function query(query) {
  //创建axios实例
  const neo4jApi = axios.create({
    baseURL: '/neo4j ',
    headers: {
      Authorization: 'Basic ' + btoa('neo4j:1833104160'), // 替换为您的用户名和密码
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  //添加验证请求头
  axios.interceptors.request.use((config) => {
    const token = 'Basic ' + btoa('neo4j:1833104160');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  });
  //发送请求
  const response = await neo4jApi.post('', {
    statements: [
      {
        statement: query,
        resultDataContents: ['graph'],
      },
    ],
  });
  //提取图谱数据
  const graphData = response.data.results[0].data.map((graphObj) => graphObj.graph);

  return graphData;
}
// 从 Neo4j REST API 检索数据
async function acquireData(callback, graph, queryStr) {
  try {
    // 1.获取节点数据

    const nodesData = await query(queryStr[0]); //获取节点
    const nodes = callback(nodesData);

    // 2.获取关系数据
    const relsData = await query(queryStr[1]);
    const edges = callback(relsData);
    const G6Data = {
      nodes: nodes,
      edges: edges,
    };
    return G6Data;
  } catch (error) {
    console.error(error);
  }
}
// 转换数据格式为 G6 支持的格式
function neo4jToG6(neo4jData) {
  //转换节点格式
  if (neo4jData[0].relationships.length == 0) {
    let nodes: Array<object> = new Array();

    neo4jData.forEach((element) => {
      element.nodes.map((node) => {
        let nodeObj = {
          id: node.id,
          label: node.properties.name,
          level: node.properties.level,
          nodeSize: 35,
          style: null,
          x: null,
          y: null,
          comboId: null,
        };
        switch (node.properties.community) {
          case '孕灾环境':
            nodeObj.x = 200;
            nodeObj.y = 200;
            nodeObj.comboId = 'combo0';
            break;
          case '诱发因子':
            nodeObj.x = 300;
            nodeObj.y = 200;
            nodeObj.comboId = 'combo1';
            break;
          case '承灾体':
            nodeObj.x = 250;
            nodeObj.y = 315;
            nodeObj.comboId = 'combo2';
            break;
        }
        let color = undefined;
        // let comboIndex: number = 0
        switch (nodeObj.level) {
          case '主体':
            nodeObj.x = 250;
            nodeObj.y = 250;
            color = 'rgb(255, 215, 0)';
            break;
          case '一级':
            color = 'rgb(128, 0, 128)';
            break;
          case '二级':
            color = 'rgb(255, 165, 0)';
            break;
          case '三级':
            color = 'rgb(0, 0, 255)';
            break;
          case '四级':
            color = 'rgb(235, 0, 0)';
            break;
          default:
            break;
        }
        nodeObj.style = {
          fill: color,
        };
        nodes.push(nodeObj);
      });
    });
    return nodes;
  }
  //转换关系格式
  let edges: Array<object> = new Array();
  neo4jData.forEach((element) => {
    //一条关系的两个节点
    element.relationships.map((rel) =>
      edges.push({
        source: rel.startNode,
        target: rel.endNode,
        label: rel.properties.type,
        community: rel.properties.community,
      })
    );
  });
  return edges;
}
/**
 * @description: 用于初始化Graph对象
 * @param element： String | HTMLElement，必须，创建的画布容器 id 或容器本身
 * @return {Graph}
 */
function intiGraph(element): Graph {
  //实例化Tooltip插件
  const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 10,
    // v4.2.1 起支持配置 trigger，click 代表点击后出现 tooltip。默认为 mouseenter
    trigger: 'click',
    // the types of items that allow the tooltip show up
    // 允许出现 tooltip 的 item 类型
    itemTypes: ['node'],
    // custom the tooltip's content
    // 自定义 tooltip 内容
    getContent: (e) => {
      const outDiv = document.createElement('div');
      outDiv.style.width = 'fit-content';
      //outDiv.style.padding = '0px 0px 20px 0px';
      outDiv.innerHTML =
        `
      <h4>Elemenet Information</h4>
      <ul>
        <li style = "list-style:none">ID: ` +
        e.item._cfg.model.id +
        `</li>
      </ul>
      <ul>
        <li style = "list-style:none"}>Label: ` +
        e.item._cfg.model.label +
        `</li>
      </ul>`;
      return outDiv;
    },
  });

  const edge_tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 10,
    // v4.2.1 起支持配置 trigger，click 代表点击后出现 tooltip。默认为 mouseenter
    trigger: 'click',
    // the types of items that allow the tooltip show up
    // 允许出现 tooltip 的 item 类型
    itemTypes: ['edge'],
    // custom the tooltip's content
    // 自定义 tooltip 内容
    getContent: (e) => {
      const outDiv = document.createElement('div');
      outDiv.style.width = 'fit-content';
      //outDiv.style.padding = '0px 0px 20px 0px';
      outDiv.innerHTML =
        `
      <h4>Edge Information</h4>
      <ul>
        <li style = "list-style:none">Source: ` +
        e.item._cfg.model.sourceLabel +
        `</li>
      </ul>
      <li style = "list-style:none"}>Relationship: ` +
        e.item._cfg.model.label +
        `</li>
      <ul>
        <li style = "list-style:none"}>target: ` +
        e.item._cfg.model.targetLabel +
        `</li>
      </ul>`;
      return outDiv;
    },
  });

  const graph = new G6.Graph({
    container: element,
    width: 450, // Number，必须，图的宽度
    height: 550, // Number，必须，图的高度
    // fitView: true, //设置是否将图适配到画布中；
    linkCenter: true, //链接到节点中心
    animate: true, //关闭渲染动画
    animateCfg: {
      duration: 500, // Number，一次动画的时长
      easing: 'linearEasing', // String，动画函数
    },
    modes: {
      default: [
        'drag-canvas',
        'zoom-canvas',
        'drag-node', // 支持拖拽、缩放、拖拽节点
        'drag-combo',
      ],
    },
    plugins: [tooltip, edge_tooltip],
    defaultNode: {
      type: 'circle',
      size: 55,
      style: {
        fill: '#f1edeb',
        stroke: '#5c99ff7d',
        lineWidth: 2,
      },
      labelCfg: {
        position: 'center',
        style: {
          // fill: "#5B8FF9",
          fontSize: 12,
        },
      },
    },
    defaultEdge: {
      type: 'arc',
      labelCfg: {
        autoRotate: true,
        style: {
          // fill: "#5B8FF9",
          fontSize: 10,
        },
      },
      style: {
        stroke: '#CED4D9',
        lineWidth: 2,
        endArrow: {
          path: G6.Arrow.triangle(4, 4, 30),
          d: 30,
        },
      },
    },
    nodeStateStyles: {
      // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
      hover: {
        fill: 'lightsteelblue',
      },
      // 鼠标点击节点，即 click 状态为 true 时的样式
      click: {
        stroke: 'white',
        lineWidth: 3,
      },
    },
    // 边不同状态下的样式集合
    edgeStateStyles: {
      // 鼠标点击边，即 click 状态为 true 时的样式
      click: {
        stroke: 'steelblue',
      },
    },
  });
  // 鼠标进入节点
  graph.on('node:mouseenter', (e) => {
    const nodeItem = e.item; // 获取鼠标进入的节点元素对象
    graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
  });

  // 鼠标离开节点
  graph.on('node:mouseleave', (e) => {
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
    console.log(nodeItem._cfg.model.id, nodeItem._cfg.model.x, nodeItem._cfg.model.y);
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
  graph.on('node:dragstart', function (e) {
    graph.layout();
    refreshDragedNodePosition(e);
  });
  graph.on('node:drag', function (e) {
    refreshDragedNodePosition(e);
  });
  graph.on('node:dragend', function (e) {
    e.item.get('model').fx = null;
    e.item.get('model').fy = null;
  });
  function refreshDragedNodePosition(e) {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
  }
  return graph;
}
onMounted(async () => {
  let graph = intiGraph('mountNode');
  let NodesLabels = [
    '泥石流灾害',
    '孕灾环境',
    '地理环境',
    '地质条件',
    '承灾体',
    '致灾因子',
    '矿产资源',
    '自然因素',
    '人为因素',
    '地形地貌',
    '地表覆被',
    '气象水文',
    '内力作用',
    '水渗透',
    '岩石冻融',
    '侵蚀作用',
    '水位变化',
    '人工加载',
    '坡体破坏',
    '生态环境',
    '工程地质',
    '地层岩性',
    '地质构造',
    '水文地质',
    '人类社会',
    '径流水系',
    '自然景观',
    '生物资源',
    '实物资产',
    '生产用地',
    '生命健康',
    '土地建筑',
    '土地资源',
    '地理位置',
  ];
  let G6Data = {
    nodes: [
      {
        id: '0',
        label: '泥石流灾害',
        x: 202.7,
        y: 239.5,
        style: {
          fill: 'rgb(255, 255, 0)',
        },
      },
      {
        id: '1',
        label: '孕灾环境',
        x: 202.7,
        y: 147.5,
        style: {
          fill: 'rgb(200, 162, 200)',
        },
      },
      {
        id: '2',
        label: '地理环境',
        x: 140.7,
        y: 107.5,
        style: {
          fill: 'rgb(255, 165, 0)',
        },
      },
      {
        id: '3',
        label: '地质条件',
        x: 260.25,
        y: 77.5,
        style: {
          fill: 'rgb(255, 165, 0)',
        },
      },
      {
        id: '4',
        label: '承灾体',
        x: 300.2,
        y: 280,
        style: {
          fill: 'rgb(152, 100, 200)',
        },
      },
      {
        id: '5',
        label: '致灾因子',
        x: 140.3,
        y: 300,
        style: {
          fill: 'rgb(200, 162, 200)',
        },
      },
      {
        id: '6',
        label: '矿产资源',
        x: 100.7,
        y: 155.17,
        style: {
          fill: 'rgb(172, 215, 142)',
        },
      },
      {
        id: '7',
        label: '自然因素',
        x: 74.22,
        y: 255.17,
        style: {
          fill: 'rgb(255, 165, 0)',
        },
      },
      {
        id: '8',
        label: '人为因素',
        x: 117.74,
        y: 374.17,
        style: {
          fill: 'rgb(255, 165, 0)',
        },
      },
      {
        id: '9',
        label: '地形地貌',
        x: 39.26,
        y: 105.17,
        style: {
          fill: 'rgb(172, 215, 142)',
        },
      },
      {
        id: '10',
        label: '地表覆被',
        x: 70.8,
        y: 80,
        style: {
          fill: 'rgb(172, 215, 142)',
        },
      },
      {
        id: '33',
        label: '地理位置',
        x: 70.8,
        y: 50,
        style: {
          fill: 'rgb(172, 215, 142)',
        },
      },
      {
        id: '11',
        label: '气象水文',
        x: 130.3,
        y: 45.16,
        style: {
          fill: 'rgb(172, 215, 142)',
        },
      },
      {
        id: '12',
        label: '内力作用',
        x: 123.7,
        y: 210.8,
        style: {
          fill: 'rgb(135, 206, 235)',
        },
      },
      {
        id: '13',
        label: '水渗透',
        x: 30.2,
        y: 215.8,
        style: {
          fill: 'rgb(135, 206, 235)',
        },
      },
      {
        id: '14',
        label: '岩石冻融',
        x: 20.7,
        y: 285.8,
        style: {
          fill: 'rgb(135, 206, 235)',
        },
      },
      {
        id: '15',
        label: '侵蚀作用',
        x: 60.26,
        y: 335.83,
        style: {
          fill: 'rgb(135, 206, 235)',
        },
      },
      {
        id: '16',
        label: '水位变化',
        x: 40.8,
        y: 398.8,
        style: {
          fill: 'rgb(135, 206, 235)',
        },
      },
      {
        id: '17',
        label: '人工加载',
        x: 195.3,
        y: 390.83,
        style: {
          fill: 'rgb(135, 206, 235)',
        },
      },
      {
        id: '18',
        label: '坡体破坏',
        x: 216.22,
        y: 330.5,
        style: {
          fill: 'rgb(135, 206, 235)',
        },
      },
      {
        id: '19',
        label: '生态环境',
        x: 318.7,
        y: 338.5,
        style: {
          fill: 'rgb(255, 165, 0)',
        },
      },
      {
        id: '20',
        label: '工程地质',
        x: 189.74,
        y: 81.5,
        style: {
          fill: 'rgb(172, 215, 142)',
        },
      },
      {
        id: '21',
        label: '地层岩性',
        x: 300.8,
        y: 35.5,
        style: {
          fill: 'rgb(172, 215, 142)',
        },
      },
      {
        id: '22',
        label: '地质构造',
        x: 223.78,
        y: 28.83,
        style: {
          fill: 'rgb(172, 215, 142)',
        },
      },
      {
        id: '23',
        label: '水文地质',
        x: 358.3,
        y: 89.5,
        style: {
          fill: 'rgb(172, 215, 142)',
        },
      },
      {
        id: '24',
        label: '人类社会',
        x: 305.7,
        y: 203.5,
        style: {
          fill: 'rgb(255, 165, 0)',
        },
      },
      {
        id: '25',
        label: '径流水系',
        x: 258.7,
        y: 378.5,
        style: {
          fill: 'rgb(239, 148, 158)',
        },
      },
      {
        id: '26',
        label: '自然景观',
        x: 308.7,
        y: 408.5,
        style: {
          fill: 'rgb(239, 148, 158)',
        },
      },
      {
        id: '27',
        label: '生物资源',
        x: 358.7,
        y: 398.5,
        style: {
          fill: 'rgb(239, 148, 158)',
        },
      },
      {
        id: '28',
        label: '实物资产',
        x: 263.7,
        y: 143.5,
        style: {
          fill: 'rgb(239, 148, 158)',
        },
      },
      {
        id: '29',
        label: '生产用地',
        x: 328.7,
        y: 138.5,
        style: {
          fill: 'rgb(239, 148, 158)',
        },
      },
      {
        id: '30',
        label: '生命健康',
        x: 383.7,
        y: 198.5,
        style: {
          fill: 'rgb(239, 148, 158)',
        },
      },
      {
        id: '31',
        label: '土地建筑',
        x: 358.7,
        y: 268.5,
        style: {
          fill: 'rgb(239, 148, 158)',
        },
      },
      {
        id: '32',
        label: '土地资源',
        x: 388.7,
        y: 338.5,
        style: {
          fill: 'rgb(239, 148, 158)',
        },
      },
    ],
    edges: [
      {
        source: '0',
        target: '1',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[1],
        label: '触发',
      },
      {
        source: '0',
        target: '1',
        sourceLabel: NodesLabels[1],
        targetLabel: NodesLabels[0],
        label: '子类',
      },
      {
        source: '0',
        target: '4',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[4],
        label: '威胁',
      },
      {
        source: '0',
        target: '5',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[5],
        label: '外因',
      },
      {
        source: '1',
        target: '2',
        sourceLabel: NodesLabels[1],
        targetLabel: NodesLabels[2],
        label: '子类',
      },
      {
        source: '1',
        target: '3',
        sourceLabel: NodesLabels[1],
        targetLabel: NodesLabels[3],
        label: '子类',
      },
      {
        source: '1',
        target: '4',
        sourceLabel: NodesLabels[1],
        targetLabel: NodesLabels[4],
        label: '影响',
      },
      {
        source: '1',
        target: '5',
        sourceLabel: NodesLabels[1],
        targetLabel: NodesLabels[5],
        label: '影响',
      },
      {
        source: '0',
        target: '4',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[4],
        label: '影响',
      },
      {
        source: '2',
        target: '6',
        sourceLabel: NodesLabels[2],
        targetLabel: NodesLabels[6],
        label: '子类',
      },
      {
        source: '2',
        target: '9',
        sourceLabel: NodesLabels[2],
        targetLabel: NodesLabels[9],
        label: '子类',
      },
      {
        source: '2',
        target: '10',
        sourceLabel: NodesLabels[2],
        targetLabel: NodesLabels[10],
        label: '子类',
      },
      {
        source: '2',
        target: '33',
        sourceLabel: NodesLabels[2],
        targetLabel: NodesLabels[33],
        label: '子类',
      },
      {
        source: '2',
        target: '11',
        sourceLabel: NodesLabels[2],
        targetLabel: NodesLabels[11],
        label: '子类',
      },
      {
        source: '5',
        target: '7',
        sourceLabel: NodesLabels[5],
        targetLabel: NodesLabels[7],
        label: '子类',
      },
      {
        source: '5',
        target: '8',
        sourceLabel: NodesLabels[5],
        targetLabel: NodesLabels[8],
        label: '子类',
      },
      {
        source: '3',
        target: '20',
        sourceLabel: NodesLabels[3],
        targetLabel: NodesLabels[20],
        label: '子类',
      },
      {
        source: '3',
        target: '21',
        sourceLabel: NodesLabels[3],
        targetLabel: NodesLabels[21],
        label: '子类',
      },
      {
        source: '3',
        target: '22',
        sourceLabel: NodesLabels[3],
        targetLabel: NodesLabels[22],
        label: '子类',
      },
      {
        source: '3',
        target: '23',
        sourceLabel: NodesLabels[3],
        targetLabel: NodesLabels[23],
        label: '子类',
      },
      {
        source: '4',
        target: '19',
        sourceLabel: NodesLabels[4],
        targetLabel: NodesLabels[19],
        label: '子类',
      },
      {
        source: '4',
        target: '24',
        sourceLabel: NodesLabels[4],
        targetLabel: NodesLabels[24],
        label: '子类',
      },
      {
        source: '7',
        target: '12',
        sourceLabel: NodesLabels[7],
        targetLabel: NodesLabels[12],
        label: '子类',
      },
      {
        source: '7',
        target: '13',
        sourceLabel: NodesLabels[7],
        targetLabel: NodesLabels[13],
        label: '子类',
      },
      {
        source: '7',
        target: '14',
        sourceLabel: NodesLabels[7],
        targetLabel: NodesLabels[14],
        label: '子类',
      },
      {
        source: '7',
        target: '15',
        sourceLabel: NodesLabels[7],
        targetLabel: NodesLabels[15],
        label: '子类',
      },
      {
        source: '8',
        target: '16',
        sourceLabel: NodesLabels[8],
        targetLabel: NodesLabels[16],
        label: '子类',
      },
      {
        source: '8',
        target: '17',
        sourceLabel: NodesLabels[8],
        targetLabel: NodesLabels[17],
        label: '子类',
      },
      {
        source: '8',
        target: '18',
        sourceLabel: NodesLabels[8],
        targetLabel: NodesLabels[18],
        label: '子类',
      },
      {
        source: '19',
        target: '25',
        sourceLabel: NodesLabels[19],
        targetLabel: NodesLabels[25],
        label: '子类',
      },
      {
        source: '19',
        target: '26',
        sourceLabel: NodesLabels[19],
        targetLabel: NodesLabels[26],
        label: '子类',
      },
      {
        source: '19',
        target: '27',
        sourceLabel: NodesLabels[19],
        targetLabel: NodesLabels[27],
        label: '子类',
      },
      {
        source: '19',
        target: '32',
        sourceLabel: NodesLabels[19],
        targetLabel: NodesLabels[32],
        label: '子类',
      },
      {
        source: '24',
        target: '28',
        sourceLabel: NodesLabels[24],
        targetLabel: NodesLabels[28],
        label: '子类',
      },
      {
        source: '24',
        target: '29',
        sourceLabel: NodesLabels[24],
        targetLabel: NodesLabels[29],
        label: '子类',
      },
      {
        source: '24',
        target: '30',
        sourceLabel: NodesLabels[24],
        targetLabel: NodesLabels[30],
        label: '子类',
      },
      {
        source: '24',
        target: '31',
        sourceLabel: NodesLabels[24],
        targetLabel: NodesLabels[31],
        label: '子类',
      },
    ],
  };

  //设置多边
  G6.Util.processParallelEdges(G6Data.edges);
  //3. 渲染数据为图形
  graph.data(G6Data);
  graph.render(); // 渲染图

  watch(
    props,
    async (newval, oldval) => {
      G6.Util.processParallelEdges(G6Data.edges);
      graph.destroy();
      graph = intiGraph('mountNode');
      graph.data(G6Data);
      graph.render(); // 渲染图
    },
    { deep: true }
  );
});
</script>
<style lang="scss">
#mountNode {
  display: inline-block;
  position: absolute;
  top: 10px;
  right: 0;
  z-index: 1;
  width: 500px;
  height: 550px;
  background-color: rgb(85 104 103 / 50.3%);
}

.g6- .g6-tooltip {
  padding: 10px 8px;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  color: #545454;
  font-size: 12px;
  background-color: rgb(255 255 255 / 90%);
  box-shadow: rgb(174 174 174) 0 0 10px;
}
</style>

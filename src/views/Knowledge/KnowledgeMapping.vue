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
            color = 'rgb(255, 224, 129)';
            break;
          case '一级':
            color = 'rgb(201, 144, 192)';
            break;
          case '二级':
            color = 'rgb(247, 151, 103)';
            break;
          case '三级':
            color = 'rgb(87, 199, 227)';
            break;
          case '四级':
            color = 'rgb(241, 102, 103)';
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
        stroke: '#2461ff',
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
    '落石灾害',
    '隐患面',
    '落石体',
    '落石轨迹',
    '地质体',
    '地形',
    '河流',
    '北斗',
    '边坡',
    '地表植被',
    '农田',
    '森林',
    '高压塔',
    '施工便道',
    '桥梁工程',
    '建筑',
    '影响区',
    '人类活动',
    '降雨',
    '自动\n气象站',
    '气象',
    '风速',
    '温度',
    '湿度',
  ];
  let G6Data = {
    nodes: [
      {
        id: '0',
        label: '落石灾害',
        x: 282.7,
        y: 289.5,
      },
      {
        id: '1',
        label: '隐患面',
        x: 227.2,
        y: 167.5,
        style: {
          fill: '#f12424',
        },
      },
      {
        id: '2',
        label: '落石体',
        x: 141.7,
        y: 238.5,
      },
      {
        id: '3',
        label: '落石轨迹',
        x: 50.25,
        y: 151.5,
        style: {
          fill: 'l(0) 0:#FF0000 0.3:#f57213 0.5:#f5c613 0.8:#0ce798 1:#13e9f5',
        },
      },
      {
        id: '4',
        label: '地质体',
        x: 154.77,
        y: 301.5,
        style: {
          fill: '#eb7d11',
        },
      },
      {
        id: '5',
        label: '地形',
        x: 187.3,
        y: 376.5,
      },
      {
        id: '6',
        label: '河流',
        x: 56.7,
        y: 285.17,
        style: {
          fill: '#80d5f3',
        },
      },
      {
        id: '7',
        label: '北斗',
        x: 74.22,
        y: 365.17,
        style: {
          fill: 'l(0) 0:#c1ef28 0.3:#c0dd5b 0.5:#cfe77d 0.7:#d9e7a9 1:#e4e5df',
        },
      },
      {
        id: '8',
        label: '边坡',
        x: 117.74,
        y: 424.17,
      },
      {
        id: '9',
        label: '地表植被',
        x: 268.26,
        y: 430.17,
      },
      {
        id: '10',
        label: '农田',
        x: 458.8,
        y: 467,
        style: {
          fill: '#82db47',
        },
      },
      {
        id: '11',
        label: '森林',
        x: 412.3,
        y: 421.16,
      },
      {
        id: '12',
        label: '高压塔',
        x: 373.7,
        y: 351.8,
        style: {
          fill: '#484b47',
        },
      },
      {
        id: '13',
        label: '施工便道',
        x: 420.2,
        y: 275.8,
        style: {
          fill: '#8e9392',
        },
      },
      {
        id: '14',
        label: '桥梁工程',
        x: 438.7,
        y: 84.8,
        style: {
          fill: '#2d52fb',
        },
      },
      {
        id: '15',
        label: '建筑',
        x: 330.26,
        y: 396.83,
        style: {
          fill: 'l(0) 0:#f51a13 0.3:#eb6307 0.7:#ffffff 1:#ffffff',
        },
      },
      {
        id: '16',
        label: '影响区',
        x: 505.8,
        y: 348.8,
        style: {
          fill: '#d9e3b7',
        },
      },
      {
        id: '17',
        label: '人类活动',
        x: 416.3,
        y: 182.83,
      },
      {
        id: '18',
        label: '降雨',
        x: 318.7,
        y: 148.5,
      },
      {
        id: '19',
        label: '自动\n气象站',
        x: 67.22,
        y: 58.5,
        style: {
          fill: 'l(0) 0:#b7d7f7 0.4:#b7d7f7 0.8:#9daac1 1:#87929d',
        },
      },
      {
        id: '20',
        label: '气象',
        x: 179.74,
        y: 121.5,
      },
      {
        id: '21',
        label: '风速',
        x: 300.8,
        y: 40.5,
      },
      {
        id: '22',
        label: '温度',
        x: 223.78,
        y: 28.83,
      },
      {
        id: '23',
        label: '湿度',
        x: 358.3,
        y: 99.5,
      },
    ],
    edges: [
      {
        source: '0',
        target: '1',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[1],
        label: '来源',
      },
      {
        source: '0',
        target: '2',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[2],
        label: '主体',
      },
      {
        source: '1',
        target: '2',
        sourceLabel: NodesLabels[1],
        targetLabel: NodesLabels[2],
        label: '产生',
      },
      {
        source: '2',
        target: '3',
        sourceLabel: NodesLabels[2],
        targetLabel: NodesLabels[3],
        label: '落石轨迹',
      },
      {
        source: '0',
        target: '4',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[4],
        label: '影响',
      },
      {
        source: '4',
        target: '0',
        sourceLabel: NodesLabels[4],
        targetLabel: NodesLabels[0],
        label: '制约',
      },
      {
        source: '6',
        target: '4',
        sourceLabel: NodesLabels[6],
        targetLabel: NodesLabels[4],
        label: '侵蚀',
      },
      {
        source: '6',
        target: '5',
        sourceLabel: NodesLabels[6],
        targetLabel: NodesLabels[5],
        label: '冲刷',
      },
      {
        source: '0',
        target: '5',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[5],
        label: '影响',
      },
      {
        source: '5',
        target: '0',
        sourceLabel: NodesLabels[5],
        targetLabel: NodesLabels[0],
        label: '制约',
      },
      {
        source: '7',
        target: '5',
        sourceLabel: NodesLabels[7],
        targetLabel: NodesLabels[5],
        label: '监测',
      },
      {
        source: '8',
        target: '5',
        sourceLabel: NodesLabels[8],
        targetLabel: NodesLabels[5],
        label: '属于',
      },
      {
        source: '0',
        target: '9',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[9],
        label: '破坏',
      },
      {
        source: '9',
        target: '0',
        sourceLabel: NodesLabels[9],
        targetLabel: NodesLabels[0],
        label: '减缓',
      },
      {
        source: '9',
        target: '10',
        sourceLabel: NodesLabels[9],
        targetLabel: NodesLabels[10],
        label: '包括',
      },
      {
        source: '9',
        target: '11',
        sourceLabel: NodesLabels[9],
        targetLabel: NodesLabels[11],
        label: '包括',
      },
      {
        source: '0',
        target: '12',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[12],
        label: '破坏',
      },
      {
        source: '0',
        target: '13',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[13],
        label: '破坏',
      },
      {
        source: '0',
        target: '14',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[14],
        label: '破坏',
      },
      {
        source: '0',
        target: '15',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[15],
        label: '破坏',
      },
      {
        source: '10',
        target: '16',
        sourceLabel: NodesLabels[10],
        targetLabel: NodesLabels[16],
        label: '位于',
      },
      {
        source: '11',
        target: '16',
        sourceLabel: NodesLabels[11],
        targetLabel: NodesLabels[16],
        label: '位于',
      },
      {
        source: '12',
        target: '16',
        sourceLabel: NodesLabels[12],
        targetLabel: NodesLabels[16],
        label: '位于',
      },
      {
        source: '13',
        target: '16',
        sourceLabel: NodesLabels[13],
        targetLabel: NodesLabels[16],
        label: '位于',
      },
      {
        source: '14',
        target: '16',
        sourceLabel: NodesLabels[14],
        targetLabel: NodesLabels[16],
        label: '位于',
      },
      {
        source: '15',
        target: '16',
        sourceLabel: NodesLabels[15],
        targetLabel: NodesLabels[16],
        label: '位于',
      },
      {
        source: '0',
        target: '16',
        sourceLabel: NodesLabels[0],
        targetLabel: NodesLabels[16],
        label: '发生于',
      },
      {
        source: '17',
        target: '0',
        sourceLabel: NodesLabels[17],
        targetLabel: NodesLabels[0],
        label: '加剧/减缓',
      },
      {
        source: '17',
        target: '13',
        sourceLabel: NodesLabels[17],
        targetLabel: NodesLabels[13],
        label: '修建',
      },
      {
        source: '17',
        target: '14',
        sourceLabel: NodesLabels[17],
        targetLabel: NodesLabels[14],
        label: '修建',
      },
      {
        source: '18',
        target: '0',
        sourceLabel: NodesLabels[18],
        targetLabel: NodesLabels[0],
        label: '触发',
      },
      {
        source: '18',
        target: '1',
        sourceLabel: NodesLabels[18],
        targetLabel: NodesLabels[1],
        label: '影响',
      },
      {
        source: '19',
        target: '20',
        sourceLabel: NodesLabels[19],
        targetLabel: NodesLabels[20],
        label: '监测',
      },
      {
        source: '20',
        target: '21',
        sourceLabel: NodesLabels[20],
        targetLabel: NodesLabels[21],
        label: '包括',
      },
      {
        source: '20',
        target: '22',
        sourceLabel: NodesLabels[20],
        targetLabel: NodesLabels[22],
        label: '包括',
      },
      {
        source: '20',
        target: '23',
        sourceLabel: NodesLabels[20],
        targetLabel: NodesLabels[23],
        label: '包括',
      },
      {
        source: '20',
        target: '18',
        sourceLabel: NodesLabels[20],
        targetLabel: NodesLabels[18],
        label: '包括',
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
  right: 5px;
  z-index: 1;
  width: 460px;
  height: 570px;
  background-color: rgb(11 55 61 / 80%);
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

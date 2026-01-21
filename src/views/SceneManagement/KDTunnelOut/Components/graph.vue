<template>
  <div id="app">
    <div>
      <input v-model="searchQuery" placeholder="输入节点名称进行查询" />
      <button @click="searchNode">查询</button>
      <div v-if="searchResultMessage" class="search-message">{{ searchResultMessage }}</div>
    </div>
    <!-- <div id="mountNode"></div> -->

    <!-- 点击实体节点之后出现的信息框 -->
    <div id="nodeInfo" v-if="selectedNode">
      <div class="title">节点信息 ：{{ selectedNode.title }}</div>
      <div class="close-btn" @click="closeNodeInfo">
        <img src="../Assets/img/close.svg" class="close-img" />
      </div>
      <!-- 检索框 -->
      <div id="outer">
        <form id="form1" @submit.prevent="searchNode" class="search-form">
          <div class="head">起始里程 - 终止里程</div>
          <div class="input-container">
            <input ref="firstInput" type="number" class="first" v-model="firstMileage" min="0" placeholder="例如：298528.8" value="298513.7" />
            <div class="and">-</div>
            <input ref="secondInput" type="number" class="second" v-model="secondMileage" min="0" placeholder="例如：298531.8" value="298504.8" />
          </div>
          <div class="entry" @click="searchNode">搜索</div>
        </form>
        <div v-if="searchResultMessage" class="result-message">{{ searchResultMessage }}</div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
import neo4jService from '../Utils/neo4jService';
import G6 from '@antv/g6';
import { DTScopeEngine } from '@/utils/Common/Viewer';
import Cesium from 'Cesium';
import apiClient, { searchMeta } from '../Utils/apiClient.js';

let firstMileage = ref(297058.6);
let secondMileage = ref(297060.6);
let searchQuery = ref('');
let searchResultMessage = ref('');
let selectedNode = ref(null);
let graph = null;
let requestBody = reactive({
  lineMileageType: 'DK',
  get startLineMileage() {
    return firstMileage.value;
  },
  get endLineMileage() {
    return secondMileage.value;
  },
});
const resetGraph = () => {
  if (graph) {
    graph.clear(); // 清空图数据
    graph.destroy(); // 释放内存
  }
};

function layerControl(layerNames) {
  DTScopeEngine.getViewer(() => {
    DTScopeEngine.viewer.DTScene.layers.forEach((layers) => {
      layers._array.forEach((layer) => {
        DTScopeEngine.viewer.DTScene.setLayerVisiability(layer, layerNames.indexOf(layer._label) !== -1);
      });
    });
  });
}

// 根据里程范围加载数据
const searchNode = () => {
  // 传送两个参数firstMileage.value，secondMileage.value(number类型)

  const mileageQuery = `DK${firstMileage.value}+${secondMileage.value}`;

  // 根据里程范围查询数据
  searchMeta(requestBody).then((response: any) => {
    if (response.msg == 'success') {
      searchResultMessage.value = '成功检索到数据!';
    } else {
      searchResultMessage.value = '数据暂未更新!';
    }

    let responseData = response.data;

    DTScopeEngine.getViewer(async () => {
      let viewer = DTScopeEngine.viewer;
      let DTScene = DTScopeEngine.viewer.DTScene;

      const promises = responseData.map((element) => {
        let dataUrl = element.filePath.serverPath;

        // 加载数据
        console.log(element);
        let layer = DTScene.createDT3DTilesLayer({
          url: dataUrl,
        });
        console.log(layer);

        return new Promise((resolve) => {
          setTimeout(() => {
            let position = new Cesium.Cartesian3(layer._position.x + 1, layer._position.y + 17, layer._position.z - 2);
            console.log('图层创建成功，位置:', position);
            resolve(position);
          }, 1000);
        });
      });
      // 等待所有图层创建完成
      const positions = await Promise.all(promises);
      // 最后可以选择最后一个图层的位置进行飞行
      if (positions.length > 0) {
        viewer.camera.flyTo({
          destination: positions[positions.length - 1], // 跳转到最后一个图层的位置
          orientation: {
            heading: 0.19758139108633177, // 0度朝北
            pitch: -0.809321795283259, // 向下45度
            roll: 0.1009289785327020184, // 旋转
          },
          duration: 3, // 飞行时间
        });
      }
    });
  });
};
function getCurrentCameraView() {
  let viewer = DTScopeEngine.viewer;
  if (viewer) {
    let camera = viewer.camera;
    let cartographic = Cesium.Cartographic.fromCartesian(camera.position);
    let view = {
      position: {
        longitude: Cesium.Math.toDegrees(cartographic.longitude),
        latitude: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height,
      },
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll,
    };
    // 输出为 JSON 字符串
    let jsonString = JSON.stringify(view, null, 2);
    console.log(jsonString);
    console.log('当前相机视角:', view);
    alert(`当前相机视角: ${JSON.stringify(view, null, 2)}`);
  } else {
    console.warn('无法获取当前相机视角，viewer未定义');
  }
}
const closeNodeInfo = () => {
  selectedNode.value = null;
};

const highlightNode = (item) => {
  graph.setItemState(item, 'highlight', true);
};

const clearHighlightedNode = () => {
  const items = graph.findAllByState('node', 'highlight');
  items.forEach((item) => graph.setItemState(item, 'highlight', false));
};

const transformDataToG6Format = (data) => {
  const nodes = [],
    edges = [],
    nodeMap = {};

  data.forEach((record) => {
    const node1 = record['n'],
      node2 = record['m'],
      relationship = record['r'];

    if (!nodeMap[node1.identity]) {
      nodes.push(createNode(node1));
      nodeMap[node1.identity] = true;
    }

    if (!nodeMap[node2.identity]) {
      nodes.push(createNode(node2));
      nodeMap[node2.identity] = true;
    }

    edges.push(createEdge(node1, node2, relationship));
  });

  return { nodes, edges };
};

const createNode = (node) => ({
  id: node.identity.toString(),
  label: node.properties.title,
  data: node.properties,
  style: { fill: getNodeColor(node.properties.level) },
});

const createEdge = (node1, node2, relationship) => ({
  id: `${node1.identity.toString()}-${node2.identity.toString()}`,
  source: node1.identity.toString(),
  target: node2.identity.toString(),
  label: relationship.type,
  style: { stroke: '#b3b3b3', lineWidth: 1 },
});

const getNodeColor = (level) => {
  const colors = {
    1: '#92cddc',
    2: '#dbeef3',
    3: '#dfe6d6',
    4: '#fff2cc',
    5: '#ddd6e5',
    6: '#aff8b4',
  };
  return colors[level] || '#9EC9FF'; // 默认颜色
};

const setupGraph = async () => {
  const initialQuery = `MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100`;
  const data = await neo4jService.getGraphData(initialQuery);
  const graphData = transformDataToG6Format(data);

  graph = new G6.Graph({
    container: 'mountNode',
    width: document.getElementById('mountNode').clientWidth,
    height: document.getElementById('mountNode').clientHeight,
    layout: {
      type: 'force',
      // type: 'mindtree',
      preventOverlap: true,
      nodeSpacing: 45,
      linkDistance: 150,
      nodeStrength: -50,
      edgeStrength: 0.2,
    },
    defaultNode: {
      size: 50,
      style: { fill: '#5B8FF9', lineWidth: 3 },
      labelCfg: { position: 'center', style: { fill: '#000', fontSize: 14 } },
      stateStyles: { highlight: { fill: '#000', lineWidth: 5 } },
    },
    defaultEdge: { size: 1, style: { stroke: '#b3b3b3' } },
    modes: { default: ['drag-node', 'zoom-canvas', 'drag-canvas'] },
  });

  graph.data(graphData);
  graph.render();

  // 调整图谱以适应容器大小
  // graph.fitView();

  // 根据节点布局进一步优化缩放，确保居中且完全可见
  graph.zoom(graph.getZoom() * 0.9); // 调整缩放比例，0.9 使节点看起来更紧凑

  // 点击节点开始检索
  graph.on('node:click', (evt) => handleNodeClick(evt.item.getModel()));
};

const hideLowLevelNodes = (level) => {
  const lowLevelNodes = graph.getNodes().filter((node) => node.getModel().data.level > level);

  lowLevelNodes.forEach((node) => {
    graph.hideItem(node);
    graph
      .getEdges()
      .filter((edge) => edge.getSource() === node || edge.getTarget() === node)
      .forEach((edge) => graph.hideItem(edge));
  });
};

const handleNodeClick = (clickedNode) => {
  const clickedLevel = clickedNode.data.level;

  graph
    .getNodes()
    .filter((node) => node.getModel().data.level > clickedLevel)
    .forEach((node) => {
      graph.showItem(node);
      graph
        .getEdges()
        .filter((edge) => edge.getSource() === node || edge.getTarget() === node)
        .forEach((edge) => graph.showItem(edge));
    });

  selectedNode.value = clickedNode.data;
};

onMounted(() => {
  setupGraph();
});

onBeforeUnmount(() => {
  resetGraph();
});
</script>

<style lang="scss" scoped>
#mountNode {
  position: absolute;
  top: 10%;
  left: 5%;
  width: 25%;
  height: 50%;
  background-color: rgb(149 204 221 / 65.8%);
}

.title {
  margin: 5px;
}

.head {
  margin-left: 6px;
  padding-bottom: 10px;
}

#nodeInfo {
  position: absolute;
  top: 10%;
  left: 32%;
  z-index: 10;
  width: 340px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: rgb(149 204 221 / 65.8%);
}

pre {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  white-space: pre-wrap;
  background-color: rgb(150 219 240);
}

.entry {
  display: flex;
  width: 80px;
  height: 40px;
  border: 1px solid rgb(0 0 0);
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  color: rgb(66 65 65);
  font-size: 16px;
  cursor: pointer;
}

.entry:hover {
  background-color: #59a5d8;
}

.search-message {
  margin-top: 10px;
  color: red;
}

.input-container {
  display: flex;
  align-items: center;

  /* 垂直居中对齐 */
  justify-content: center;

  /* 水平居中对齐，如果你想要它们居中 */
}

.first,
.second {
  width: 100%;
  box-sizing: border-box;
  margin: 8px 0;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: inset 0 1px 3px rgb(0 0 0 / 10%);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.and {
  margin: 0 5px;
  font-size: 14px;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 15px;
  height: 15px;
  border: none;
  cursor: pointer;
}

.close-img {
  width: 15px;
  height: 15px;
}
</style>

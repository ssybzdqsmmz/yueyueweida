<template>
  <div class="toggle-button" @click="isCollapsed = !isCollapsed">
    <i class="el-icon-arrow-left" v-if="isCollapsed"></i>
    <i class="el-icon-arrow-right" v-else></i>
  </div>
  <div class="right" :class="{ collapsed: isTableCollapsed }">
    <div class="arrow-container" @click="toggleTable">
      <div class="bar"></div>
    </div>
    <div class="constructionInfo">
      <el-table :data="construction" style="width: 400px" height="270px">
        <el-table-column fixed label="施工信息" id="sg">
          <el-table-column fixed prop="attribute" label="属性" width="160px"></el-table-column>
          <el-table-column fixed prop="information" label="信息" width="240px"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="designInfo">
      <el-table :data="design" style="width: 400px" height="270px">
        <el-table-column fixed label="设计信息">
          <el-table-column fixed prop="attribute" label="属性" width="160px"></el-table-column>
          <el-table-column fixed prop="information" label="信息" width="240px"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="extensionInfo">
      <el-table :data="extension" style="width: 400px" height="270px">
        <el-table-column fixed label="扩展信息">
          <el-table-column fixed prop="attribute" label="属性" width="160px"></el-table-column>
          <el-table-column fixed prop="information" label="信息" width="240px"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, onBeforeUnmount, ref } from 'vue';
let isCollapsed = ref(true);
const cxt = getCurrentInstance();
const bus = cxt.appContext.config.globalProperties.$bus;
const construction = ref([]);
const design = ref([]);
const extension = ref([]);
const isTableCollapsed = ref(true);

const toggleTable = () => {
  isTableCollapsed.value = !isTableCollapsed.value;
};
onMounted(() => {
  bus.on('expressBIMInfo', (message) => {
    console.log(message);
    updateTables(message);
  });
});
onBeforeUnmount(() => {
  bus.off('expressBIMInfo');
});

const updateTables = (message) => {
  // 施工信息
  construction.value = [
    { attribute: '深化定位信息', information: message.深化定位信息 },
    { attribute: '施工开始时间', information: message.施工开始时间 },
    { attribute: '施工完成时间', information: message.施工完成时间 },
    { attribute: '开挖工法', information: message.开挖工法 },
    { attribute: '起始里程', information: message.起始里程 },
    { attribute: '终止里程', information: message.终止里程 },
    { attribute: '是否发生变更', information: message.是否发生变更 },
    { attribute: '实际所属断面类型', information: message.实际所属断面类型 },
    { attribute: '实际围岩等级', information: message.实际围岩等级 },
    // 其他施工信息
  ];

  // 设计信息
  design.value = [
    { attribute: '定位信息', information: message.定位信息 },
    { attribute: '类型名称', information: message.类型名称 },
    { attribute: '混凝土强度等级', information: message.混凝土强度等级 },
    { attribute: '开挖工法', information: message.开挖工法 },
    { attribute: '喷射工艺', information: message.喷射工艺 },
    { attribute: '初支厚度', information: message.初支厚度 },
    { attribute: '参考模型编号', information: message.参考模型编号 },
    { attribute: '所属断面类型', information: message.所属断面类型 },
    { attribute: '起始里程', information: message.起始里程 },
    { attribute: '终止里程', information: message.终止里程 },
    // 其他设计信息
  ];

  // 扩展信息
  extension.value = [
    { attribute: '变更简要说明', information: message.变更简要说明 },
    { attribute: '变更纪要编号', information: message.变更纪要编号 },
    { attribute: '实际参考模型编号', information: message.实际参考模型编号 },
    // { attribute: '实际混凝土强度类型', information: message.实际混凝土强度类型 },
    { attribute: '实际锚杆类型名称', information: message.实际锚杆类型名称 },
    { attribute: '实际锚杆支护范围', information: message.实际锚杆支护范围 },
    { attribute: '实际锚杆材料型号', information: message.实际锚杆材料型号 },
    { attribute: '实际锚杆长度', information: message.实际锚杆长度 },
    { attribute: '实际钢架类型名称', information: message.实际钢架类型名称 },
    // { attribute: '实际锚杆材料型号', information: message.实际锚杆材料型号 },

    // 填充扩展信息
  ];
};
</script>

<style lang="scss" scoped>
.right {
  display: flex;
  position: absolute;
  top: 80px;
  right: 10px;
  width: 400px;
  height: 810px;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.8s ease-in-out;
  transform: translateX(0); // 初始位置

  &.collapsed {
    transform: translateX(410px); // 折叠后的位置
  }
}

.arrow-container {
  position: absolute;
  top: 60%;
  left: -10px;
  cursor: pointer;
  transform: translateY(-50%);
}

.arrow-container .bar {
  display: block;
  z-index: 1;
  width: 0.0364rem;
  height: 1.0416rem;
  border-radius: 0.026rem;
  background: rgb(126 124 124 / 60%);
  transform: translateY(-50%);
}

.arrow-container .bar:hover {
  background: rgb(255 255 255 / 60%);
}

:deep(.el-table) {
  background-color: transparent;
}

:deep(.el-table thead.is-group th.el-table__cell) {
  background-color: rgb(5 105 102 / 88.4%);

  // border-style: double;
  // border-color: rgb(77 147 194)
}

:deep(.el-table .cell) {
  line-height: 17px;
  font-size: 14px;
  color: white;
  font-family: TRENDS;
  font-weight: 400;
}

:deep(.el-table--enable-row-transition .el-table__body td.el-table__cell) {
  background-color: rgb(5 105 101 / 40%);

  // border-style: double;
  // border-color: rgb(77 147 194)
}

// :deep(.el-table.is-scrolling-left.el-table--border .el-table-fixed-column--left.is-last-column.el-table__cell){
// 	border-color: rgb(77 147 194)
// }

:deep(.el-table td.el-table__cell div) {
  color: rgb(75 70 70);
  font-family: 'PingFang SC';
  background-color: transparent; // 设置表格背景透明，以便下面的半透明效果生效
}
</style>

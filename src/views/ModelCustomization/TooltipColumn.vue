<template>
  <template v-if="computeOverflow(value, width)">
    <el-tooltip placement="top-start" effect="light" :show-after="200">
      <template #content>
        <div class="tooltip-box">{{ value }}</div>
      </template>
      <span :class="[`tooltip-text-${overflowRow}`]">{{ value }}</span>
    </el-tooltip>
  </template>
  <span v-else>{{ value }}</span>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    value: any;
    width: string | number;
    overflowRow?: number;
  }>(),
  {
    value: '',
    width: '',
    overflowRow: 2,
  }
);
/**
 * @description: 获取 实际宽度、每行至多字符、最多几行
 * @param {string | number} width
 * @return {*}
 */
const getOverFlowData = (width: string | number) => {
  // 实际装文字的宽度，table cell有总共20的内边距  通过查看元素 发现还有 1px 需要减去
  const realWidth = parseInt(width as string) - 21;
  // 一行至多存在字符数 一个字符 6 px  （文字font-size为12px）
  const rowChar = Math.floor(realWidth / 6);
  // 获取 至多 显示 几行
  const row = props.overflowRow;

  return {
    rowChar,
    row,
  };
};
/**
 * @description: 是否显示tooltip
 * @param {string} val
 * @param {string | number} width
 * @return {number}
 */
const computeOverflow = (val: string, width: string | number): boolean => {
  if (typeof val !== 'string' || !width) {
    return false;
  }
  // 内容字符长度
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    const code = val.charCodeAt(i);
    len++;
    // 中文算两个字符
    if (code > 255) {
      len++;
    }
  }
  const { rowChar, row } = getOverFlowData(width);
  // console.log(len, rowChar, row * rowChar)
  return row * rowChar < len;
};
</script>
<style scoped lang="scss">
.tooltip-box {
  max-width: 600px;
  white-space: pre-wrap;
}

.tooltip-text-1,
.tooltip-text-2,
.tooltip-text-3,
.tooltip-text-4 {
  display: inline-block;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

.tooltip-text-1 {
  -webkit-line-clamp: 1;
}

.tooltip-text-2 {
  -webkit-line-clamp: 2;
}

.tooltip-text-3 {
  -webkit-line-clamp: 3;
}

.tooltip-text-4 {
  -webkit-line-clamp: 4;
}
</style>

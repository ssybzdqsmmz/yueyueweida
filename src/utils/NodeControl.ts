/*
 * @Author: changfanhao
 * @Date: 2023-03-29 13:24:40
 * @LastEditors: changfanhao
 * @LastEditTime: 2023-03-30 16:01:08
 * @FilePath: \GeoProject\src\utils\NodeControl.ts
 * @Description:
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import { Graph } from '@antv/x6';

export default class NodeControl {
  public container: HTMLElement = null;
  public graph: Graph = null;
  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }
  //初始化画布
  init(): void {
    this.graph = new Graph({
      container: this.container,
      width: this.container.clientWidth,
      height: this.container.clientHeight,
      autoResize: true,
      background: {
        color: '#f2f7fa',
      },
      grid: {
        size: 2,
      },
      mousewheel: {
        enabled: true,
      },
      panning: true,
    });
  }
  //添加节点
  addNode(): any {
    const node = this.graph.addNode({
      shape: 'custom-vue-node-outputdata',
      x: 100,
      y: 60,
    });
    const node1 = this.graph.addNode({
      shape: 'custom-vue-node-importdata',
      x: 100,
      y: 100,
    });
    const node2 = this.graph.addNode({
      shape: 'custom-vue-node-modelanalyse',
      x: 150,
      y: 150,
    });
    return node;
  }
}

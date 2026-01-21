/*
 * @Author: Lincong-pro
 * @Date: 2024-02-25 12:36:50
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2024-02-27 15:06:42
 * @FilePath: \Geology-V3\src\views\SceneManagement\KDTunnel\Utils\eventBus.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import { singleTon } from './DesignMode';
class EventBus {
  private listeners: Record<string, ((...args: any[]) => any)[]> = {};
  private excludeFilters: string[] = []; //不需要执行过滤器的消息，其余的都要执行过滤器

  addExcludeFilter(event: string) {
    this.excludeFilters.push(event);
  }

  // Subscribe to an event
  on(event: string, callback: (any) => any) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * @description: 只调用一次的函数，如垃圾清理函数
   * @param {string} event
   * @param {function} callback
   * @return {void}
   */
  once(event: string, callback: (any) => any) {
    const onceCallback = (...args) => {
      callback(args);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }

  // Unsubscribe from an event
  off(event: string, callback: (any) => any) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
    }
  }

  /**
   * @description: 在切换场景之前删除调用垃圾函数
   * @param event
   * @param args
   * @return {void}
   */
  beforeFilter(event: string, ...args) {
    // default step into
    // if (event.startsWith('tunnel_')) {
    this.listeners['clearTrash'].forEach((callback) => {
      callback();
    });

    // }
    return true;
  }

  // Publish an event
  emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      if (this.excludeFilters.includes(event)) {
        this.listeners[event].forEach((listener) => {
          listener(...args);
        });
      } else {
        // 如果Filter未中断,继续调用->否则直接断开
        if (this.beforeFilter(event, ...args)) {
          if (event != 'clearTrash') {
            // 避免多次调用
            this.listeners[event].forEach((listener) => {
              listener(...args);
            });
          }

          this.afterFilter(event, ...args);
        }
      }
    }
  }

  /**
   * @description: 在切换场景之后删除调用垃圾函数
   * @param event
   * @param args
   * @return {void}
   */
  afterFilter(event: string, ...args: any[]) {
    if (event == 'clearTrash') {
      this.clearAll();
    }
  }

  /**
   * @description: 清空所有的回调函数
   * @return {void}
   */
  clearAll() {
    Object.keys(this.listeners).forEach((key) => {
      this.listeners[key] = [];
    });
    this.listeners = {};
    this.excludeFilters = [];
  }
}

export default singleTon(EventBus);

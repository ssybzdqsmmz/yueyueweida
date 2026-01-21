/*
 * @Author: Lincong-pro
 * @Date: 2024-02-25 12:36:50
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-04-13 10:35:03
 * @FilePath: \Geology-V3\src\views\SceneManagement\GeologyModel\Utils\EventBus.ts
 * @Description:
 * Copyright (c) 2024 by VGE, All Rights Reserved.
 */
import { singleTon } from './DesignMode';
import { reactive } from 'vue';
class EventBus {
  private listeners: Record<string, ((...args: any[]) => any)[]> = {};
  private excludeFilters: string[] = []; //不需要执行过滤器的消息，其余的都要执行过滤器
  private _state: any = reactive({}); // 用于保留交互状态-持久化存储

  public state = new Proxy(this._state, {
    get: (target, property, receiver) => {
      if (!Object.hasOwn(target, property)) {
        throw new Error('Invalid property');
      }
      return Reflect.get(target, property, receiver);
    },
    set: (target, property, value, receiver) => {
      if (!Object.hasOwn(target, property)) {
        this.addKey(property, value); // 创建并赋值
      } else {
        target[property] = value; // 直接赋值
      }

      return true;
    },
  });

  private addKey(key, initValue) {
    this._state[key] = initValue;
  }

  addExcludeFilter(event: string) {
    this.excludeFilters.push(event);
  }

  emptyExcludeFilter() {
    this.excludeFilters = [];
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
  private beforeFilter(event: string, ...args) {
    // 二级场景
    if (event == 'clearTrash') {
      // default step into
      this.listeners['clearTrash'].forEach((callback) => {
        callback();
      });
    }
    // 三级场景
    if (event == 'subSceneClearTrash') {
      // default step into
      this.listeners['subSceneClearTrash'].forEach((callback) => {
        callback();
      });
    }

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
          // 子组件不负责清理
          if (event != 'subSceneClearTrash') {
            this.afterFilter(event, ...args);
          }
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
  private afterFilter(event: string, ...args: any[]) {
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

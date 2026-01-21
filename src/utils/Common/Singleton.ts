/**
 * Singleton代理
 * @param className 类对象 - 透明代理
 * @returns {Proxy}
 */
export function singleton(className: object) {
  let instance = null;
  return new Proxy(className, {
    /**
     * @description construct()方法用于拦截new命令,可以接受三个参数
     * @param {any} target
     * @param {any} args
     * @returns {ProxyClass}
     */
    construct(target: any, args: any[]): object {
      class ProxyClass {
        constructor() {
          if (instance == null) {
            instance = new target(...args);
          }
        }
      }
      return new ProxyClass();
    },
  });
}

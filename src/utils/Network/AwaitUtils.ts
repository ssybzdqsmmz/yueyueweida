/**
 * 优雅的使用await处理Promise
 * @param promise 网络请求
 * @returns [err, data]
 */
export function awaitWrap<T, U = any>(promise: Promise<T>): Promise<[U | null, T | null]> {
  return promise.then<[null, T]>((data: T) => [null, data]).catch<[U, null]>((err) => [err, null]);
}

/*
 * @Author: Guo yongxin
 * @Date: 2022-08-03 17:29:37
 * @LastEditTime: 2023-03-28 09:35:31
 * @LastEditors: Lincong-pro
 * @Description: Encapsulate axios interface metheds.
 * @FilePath: \geoproject2.0\src\utils\NetWork\Request.ts
 */
import { BASE_URL } from '@/api/url';
import axios, { InternalAxiosRequestConfig, AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';

/**
 * @description: type + status message
 * @return {*}
 */
type Response<T = any> = {
  msg: string;
  result: T;
};

// 设置携带cookie发送
axios.defaults.withCredentials = true;

const instance: AxiosInstance = axios.create({
  timeout: 0,
  baseURL: BASE_URL,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject();
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response;
    }
    Promise.reject();
  },
  (error: AxiosError) => {
    if (error.code === 'ERR_CANCELED') {
      return Promise.resolve({ status: 201 });
    }
    return Promise.reject();
  }
);

/**
 * @description: 泛型T作为结果类型
 * @param {AxiosRequestConfig} config
 * @return {T} return result
 */
const request = <T>(config: AxiosRequestConfig) => {
  return new Promise<Response<T>>((resolve, reject) => {
    instance
      .request<Response<T>>(config)
      .then((response: AxiosResponse<Response<T>>) => {
        resolve(response.data);
      })
      .catch((error: any) => {
        if (error == undefined) {
          error = '网络错误';
        }
        reject(error);
      });
  });
};

export { request };
export type { Response };

/*
 * @Author: fuweiaa 2567873016@qq.com
 * @Date: 2024-11-04 10:10:28
 * @LastEditors: fuweiaa 2567873016@qq.com
 * @LastEditTime: 2024-11-04 10:17:08
 * @FilePath: \Geology-v3\src\views\SceneManagement\Layout\Utils\knowledgeSearch.js
 * @Description: 用来访问数据库中的数据 已有：根据里程范围访问数据
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:9090', // 数据库后台服务地址
  timeout: 10000, // 请求超时设置
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加token或其他请求头
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // 直接返回数据
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 新增 POST 请求函数
export const searchMeta = (requestBody) => {
  return apiClient.post('/data/searchMeta', requestBody);
};

export default apiClient;

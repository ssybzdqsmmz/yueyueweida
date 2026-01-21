/*
 * @Author: Guo yongxin
 * @Date: 2022-08-03 17:29:37
 * @LastEditTime: 2023-07-10 21:09:15
 * @LastEditors: Lincong-pro
 * @Description: Encapsulate axios interface metheds.
 * @FilePath: \Railway_DTPlatform-DTCZ_12\src\utils\Network\Request.js
 */
// import { BASE_URL } from "@/api/url"
import axios from 'axios';

// 设置携带cookie发送
axios.defaults.withCredentials = true;

const instance = axios.create({
  timeout: 0,
  // baseURL: BASE_URL
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject();
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response;
    }
    Promise.reject();
  },
  (error) => {
    if (error.code === 'ERR_CANCELED') {
      return Promise.resolve({ status: 201 });
    }

    return Promise.reject(error);
  }
);

const request = (config) => {
  return new Promise((resolve, reject) => {
    instance
      .request(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export { request };

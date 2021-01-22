import Vue from 'vue';
import axios from "axios";

let config = {//axios的配置
  baseURL: "http://www.kangliuyong.com:10002/",//设置请求域名 接口版本 v1 v2
  timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);//根据配置创建axios实例
//axios 请求的前置配置

_axios.interceptors.request.use(
  function (config) {
    // 修改请求参数数据
    if(config.method === 'post'){
      let paramsString = '';
      for(var key in config.data){
        paramsString +=`${key}=${config.data[key]}&`;
      }
      paramsString +='appkey=U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';
      config.data = paramsString;
    }else if(config.method === 'get'){
      if (config.url.indexOf('http') != 0) {
            // 根据实际情况添加连接符
            config.url += (config.url.indexOf('?') != -1) ? '&' : '?';
            config.url += 'appkey=U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';
        }
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
//axios 请求之后后置配置
// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);
//把 axios做成 Vue 插件
Plugin.install = function (Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
    $http: {
      get() {
        return _axios;
      }
    }
  });
};

Vue.use(Plugin)
export default Plugin;
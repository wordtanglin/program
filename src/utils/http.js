import axios from "axios";

// 默认超时设置
axios.defaults.timeout = 50000;

// 相对路径设置
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // 获取token
    const token = localStorage.getItem("cc_token");
    // 设置参数格式
    if (!config.headers["Content-Type"]) {
      config.headers = {
        "Content-Type": "application/json"
      };
    }
    // 添加token到headers
    if (token) {
      config.headers.token = token;
    }
    // 鉴权参数设置
    if (config.method === "get") {
      // get请求下 参数在params中，其他请求在data中
      config.params = config.params || {};
      // 一些参数处理
    } else {
      config.data = config.data || {};
      // 一些参数处理
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // 一些统一code的返回处理
    if (response.data.code === 501) {
      // 登录验证
      // 做了个示例跳转项目中登录，并记录下相对路径
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * 封装get方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(response => {
        if (url === "/download") {
          resolve(response.data);
        }
        if (response.data.returnCode === "6006") {
          if (response.data.data) {
            resolve(response.data.data);
          } else {
            resolve(response.data);
          }
        }
        if (response.data.returnCode === "6007") {
          resolve(response.data);
        }
      })
      .catch(err => {
        reject(err);
        // let message = "请求失败！请检查网络";
        // if (err.response) message = err.response.data.message;
      });
  });
}

/**
 * post
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      response => {
        if (response.data.returnCode === "6006") {
          if (response.data.data) {
            resolve(response.data.data);
          } else {
            resolve(response.data);
          }
        }
        if (response.data.returnCode === "6007") {
          resolve(response.data);
        }
      },
      err => {
        reject(err);
        // let message = "请求失败！请检查网络";
        // if (err.response) message = err.response.data.message;
      }
    );
  });
}

/**
 * patch
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data).then(
      response => {
        if (response.data.code === 200) {
          resolve(response.data.data);
        }
      },
      err => {
        reject(err);
        // let message = "请求失败！请检查网络";
        //if (err.response) message = err.response.data.message;
      }
    );
  });
}

/**
 * put
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      response => {
        if (response.data.code === 200) {
          resolve(response.data.data);
        }
      },
      err => {
        reject(err);
        //let message = "请求失败！请检查网络";
        //if (err.response) message = err.response.data.message;
      }
    );
  });
}

/**
 * del
 * @param {*} url
 * @param {*} data
 */
export function del(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, data).then(
      response => {
        if (response.data.code === 200) {
          resolve(response.data.data);
        }
      },
      err => {
        reject(err);
        // let message = "请求失败！请检查网络";
        // if (err.response) message = err.response.data.message;
      }
    );
  });
}

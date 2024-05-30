import Axios from 'axios'
import config from '../config'
import router from '../router'
import { doEncrypt, doDecrypt, encryptUrl } from '../utils/sm2'
import { Message } from 'element-ui'
import Vue from 'vue'

Axios.defaults.baseURL = config.apiBaseUrl
Axios.defaults.timeout = 10000000
Axios.defaults.headers['Content-Type'] = 'application/json; charset=utf-8'

window.__axiosPromiseArr = []

// Axios 请求拦截器
Axios.interceptors.request.use(async (config) => {
  config.headers['Content-Type'] = 'application/json; charset=utf-8'

  // 加密
  // if (encryptUrl.includes(config.url)) {
  //   config.data = await doEncrypt(config.data)
  // }

  config.headers['responseType'] = 'blob'

  if (sessionStorage.getItem('tokenValue')) {
    let key = JSON.parse(sessionStorage.getItem('user')).tokenName
    config.headers[key] = `Bearer ${sessionStorage.getItem('tokenValue')}`
  }

  // ROUTE_CHANNEL本地测试使用
  // if (process.env.NODE_ENV == 'development') {
  //   config.headers['ROUTE_CHANNEL'] = '/manage-api'
  // }

  // 将cancel放置于全局变量的数组中, 用于取消请求
  config.cancelToken = new Axios.CancelToken((cancel) => {
    window.__axiosPromiseArr.push({
      cancel
    })
  })
  return config
})

// Axios 响应拦截器 对返回码进行处理处理
Axios.interceptors.response.use(
  async (res) => {
    if (res.status === 200) {
      //  处理文件流接口
      if (res.headers['content-disposition']) {
        return res
      }
      // 调用成功返回接口数据
      if (res.data.code === 200) {
        // return await doDecrypt(res.data.data)
        return res.data.data
      } else if (res.data.code === 9999) {
        router.replace({
          name: 'Login'
        })
      }
    } else {
      Message.error(res.data.msg);
      return Promise.reject(res.data.msg)
    }
  },
  (err) => {
    Message.error(err.response.data.msg);
    return Promise.reject(err.response.data.msg)
  }
)

import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use((config) => {
  // 注入token
//  this.$store.getters
  // store.getters.token => 请求头里面
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, (error) => {
  // 失败执行promise
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use((response) => {
  const { data, message, success } = response.data // 默认json格式
  if (success) {
    return data
  } else {
    Message({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async(error) => {
  // error.message
  if (error.response.status === 401) {
    // 1.清空本地的token
    store.dispatch('user/logout')
    // 2.跳转到登录页
    router.push('/login')
    // 3.提示
    Message({ type: 'warning', message: '登录过期，请重新登录' })
    return Promise.reject(new Error(error.message))
  }
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})

export default service

import ajax from 'axios'
// import router from '@/router'
import { Notify } from 'vant'
import { getToken, removeToken, setToken } from '@/utils/token'
import { tokenAPI } from '@/api'
import router from '@/router'
import { removeStorage } from '@/utils/storages'

const axios = ajax.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 20000
})
// axios.defaults.timeout = 20000
// axios.defaults.baseURL = 'http://toutiao.itheima.net'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // ?.代表可选链操作符,如果对象木有length则原地返回undefined
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, async function (error) {
  // 对响应错误做点什么
  // 身份过期或token错误
  console.log(error)
  if (error.response.status === 401) {
    // Notify({ type: 'warning', message: '身份已过期' })

    // token过期的第一种方式,清除token,让用户重新登录,但体验不好
    removeToken() // 清除token,防止全局前置守卫失效
    // router.replace('/login')

    // token过期的第二种方式,token续签
    const res = await tokenAPI()
    // 储存新的token
    setToken(res.data.data.token)
    // 更新新的token在请求头中
    error.config.headers.Authorization = `Bearer ${res.data.data.token}`
    // 重新发起请求
    // error.config就是上次请求的配置对象
    // 结果要return对原本的调用的地方
    return axios(error.config)
  } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
    // refresh_token也过期了
    console.log('500')
    removeToken()
    removeStorage('refresh_token')
    // 会删除搜索历史
    // localStorage.clear()
    // token过期可以回到当前页面的方式
    // 登录未遂地址
    await router.replace({ path: `/login?path=${router.currentRoute.fullPath}` })
    // await router.replace('/login')
    Notify({ type: 'warning', message: '身份已过期' })
  }
  return Promise.reject(error)
})

// 二次封装axios
export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url: url,
    method: method,
    params: params,
    data: data,
    headers: headers
  })
}

import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token'

// webpack的打包思路是main.js的文件,会把所有的打包到一起,导致app.js过大
// 优化,进行路由懒加载, 让app.js的文件变小
// 思路: 当路由匹配到时,才去import对应的组件
// 把组件按组分块
// const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home' // 默认显示首页
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login'),
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
      if (getToken()?.length > 0) {
        // next(false)有bug 就是用户手动改变地址后无法返回
        // next(false) // 留在原地,什么也不干
        next('/') // 让其返回首页
      } else { // 其他情况一律放行
        next()
      }
    }
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/Layout'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Home'),
        meta: {
          scrollT: 0 // 保存滚动位置
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '@/views/User')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search')
  },
  {
    path: '/search_result/:kw',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult')
  },
  {
    path: '/article_detail',
    component: () => import(/* webpackChunkName: "ArticleDetail" */ '@/views/ArticleDetail')
  },
  {
    path: '/info_edit',
    component: () => import(/* webpackChunkName: "InfoEdit" */ '@/views/User/InfoEdit')
  },
  {
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat')
  }
]

const router = new VueRouter({
  routes
})

// 添加前置守卫, 防止登录用户手动切换路径进去登录页面
// router.beforeEach((to, from, next) => {
//   if (getToken()?.length > 0 && to.path === '/login') {
//     next('/') // 让其返回首页 // 留在原地,什么也不干
//   } else { // 其他情况一律放行
//     next()
//   }
// })

export default router

import Vue from 'vue'
import Router from 'vue-router'
import utils from '../utils'
// const originalPush = Router.prototype.push
// Router.prototype.push = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(Router)

const files = require.context('.', true, /\.js$/)
let routerArray = []
files.keys().forEach(key => {
  if (key === './index.js') return
  routerArray = routerArray.concat(files(key).default)
})

const router = new Router({
  routes: [{
      path: '/',
      name: 'Login',
      component: utils.view('login/index'),
      meta: {
        ignoreAuth: true,
        title: '登录'
      }
    },
    ...routerArray
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.ignoreAuth) {
    console.log('不需要鉴权')
  }
  // 页面跳转取消axios的请求
  window.__axiosPromiseArr.forEach((ele, idx) => {
    ele.cancel()
    delete window.__axiosPromiseArr[idx]
  })
  next()
})

export default router